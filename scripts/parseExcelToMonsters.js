const axios = require('axios');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const regionSheets = [
  { name: '維多利亞島', gid: '2100610320' },
  { name: '艾納斯大陸', gid: '483624389' },
  { name: '路德斯湖', gid: '1917063682' },
  { name: '水世界', gid: '1535813276' },
  // 其他地區...
];

async function fetchAndParseSheet(region) {
  const url = `https://docs.google.com/spreadsheets/d/1xb6FhSGcM6EIj7aDcUmxZA9zVxLEw8xxXxxej5Tcrt4/export?format=csv&gid=${region.gid}`;
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const csvText = Buffer.from(response.data).toString('utf-8');
  const workbook = XLSX.read(csvText, { type: 'string' });
  const ws = workbook.Sheets[workbook.SheetNames[0]];
  const table = XLSX.utils.sheet_to_json(ws, { header: 1 });
  return table;
}

const MONSTERS_PER_ROW = 5;
const nameColIndexes = [4, 10, 16, 22, 28];
const DROP_COL_INDEXES = [
  [1, 3, 5],
  [7, 9, 11],
  [13, 15, 17],
  [19, 21, 23],
  [25, 27, 29],
];


function getBlockStartRowsLv(table) {
  const blockStarts = [];

  for (let i = 0; i < table.length; i++) {
    if (!table[i]) continue;

    // 先檢查這一列有沒有 "BOSS"
    if (table[i].some(cell =>
      typeof cell === 'string' && cell.toLowerCase().includes('boss')
    )) {
      // 偵測到 "BOSS" 就整個結束，後面都不抓
      break;
    }

    for (let c = 0; c < table[i].length; c++) {
      const cell = table[i][c];
      if (
        typeof cell === 'string' &&
        cell.trim().toLowerCase().startsWith('lv.')
      ) {
        blockStarts.push(i - 1);
        break;
      }
    }
  }
  return blockStarts;
}

function getBlockStartRowsDefense(table) {
  const blockStarts = [];

  for (let i = 0; i < table.length; i++) {
    if (!table[i]) continue;

    // 先檢查這一行有沒有 "BOSS"
    if (table[i].some(cell =>
      typeof cell === 'string' && cell.toLowerCase().includes('boss')
    )) {
      break; // 偵測到 BOSS 就整個 break
    }

    for (let c = 0; c < table[i].length; c++) {
      const cell = table[i][c];
      if (
        typeof cell === 'string' &&
        cell.trim().toLowerCase().startsWith('物理防禦力')
      ) {
        blockStarts.push(i - 1);
        break;
      }
    }
  }
  return blockStarts;
}

function getMonsterBasicInformation(table) {
  const monsters = [];
  const blockStartRows = getBlockStartRowsLv(table);

  for (let blockIdx = 0; blockIdx < blockStartRows.length; blockIdx++) {
    const blockStart = blockStartRows[blockIdx];
    for (let i = 0; i < MONSTERS_PER_ROW; i++) {
      const col = nameColIndexes[i];

      monsters.push({
        level: table[blockStart + 1][col] || '',
        attribute: table[blockStart + 3][col] || '',
        hp: table[blockStart + 5][col] || '',
        mp: table[blockStart + 7][col] || '0',
        exp: table[blockStart + 8][col] || '',
        name: table[blockStart + 9][col - 3] || '',
        gold: table[blockStart + 9][col] || '',
      })
    }
  }
  return monsters;
}

function getMonsterDefense(table) {
  const monsters = [];
  const blockStartRows = getBlockStartRowsDefense(table);

  for (let blockIdx = 0; blockIdx < blockStartRows.length; blockIdx++) {
    const blockStart = blockStartRows[blockIdx];
    for (let i = 0; i < MONSTERS_PER_ROW; i++) {
      const col = nameColIndexes[i]

      monsters.push({
        defensePhysical: table[blockStart + 2][col - 3] || '0',
        defenseMagic: table[blockStart + 2][col - 1] || '0',
        evasionRate: table[blockStart + 2][col + 1] || '0',
        accuracy: table[blockStart + 3][col - 1] || '0',
      })
    }
  }
  return monsters;
}

function getMonsterDrop(table) {
  const lvStarts = getBlockStartRowsLv(table);
  const defenseStarts = getBlockStartRowsDefense(table);

  const allDrops = [];

  lvStarts.forEach((lvIdx, block) => {
    const nextDefenseIdx = defenseStarts.find(idx => idx > lvIdx) ?? table.length;
    const dropRows = table.slice(lvIdx + 10, Math.min(lvIdx + 25, nextDefenseIdx)); // Row 10~25

    // 依序抓5隻怪
    for (let i = 0; i < DROP_COL_INDEXES.length; i++) {
      const colIndexes = DROP_COL_INDEXES[i];
      const monsterDrops = [];

      // 每一列row，對應這三個欄位抓一次
      for (const row of dropRows) {
        for (const col of colIndexes) {
          const cell = row[col];
          if (typeof cell === 'string' && cell.trim()) {
            monsterDrops.push(cell.trim());
          }
        }
      }
      allDrops.push(monsterDrops);
    }
  });

  return allDrops;
}


function parseAllMonsters(table) {
  const monsters = getMonsterBasicInformation(table);
  const defenses = getMonsterDefense(table);
  const drops = getMonsterDrop(table);

  return monsters.map((monster, idx) => ({
    ...monster,
    defense: defenses[idx] || {},
    drops: drops[idx] || [],
  }))

    .filter(monster => monster.name && monster.name.trim() !== '');
}

async function main() {
  for (const region of regionSheets) {
    console.log('region:', region);
    const table = await fetchAndParseSheet(region);
    const monsters = parseAllMonsters(table);

    // ====== 這裡插測試用 code ======

    // const drops = getMonsterDrop(table);

    // drops.slice(0, 5).forEach((monsterDrops, i) => {
    //   console.log(`第${i + 1}隻怪物的掉落物:`);
    //   monsterDrops.forEach((item, idx) => {
    //     console.log(`  ${idx + 1}: ${item}`);
    //   });
    // });

    // ====== 測試用 code 結束 ======

    fs.writeFileSync(
      path.join(__dirname, `monsterData_${region.name}.json`),
      JSON.stringify(monsters, null, 2),
      'utf-8'
    );

  }
  console.log("完成")
}
main();

