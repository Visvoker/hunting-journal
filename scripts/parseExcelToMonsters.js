const axios = require('axios');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const regionSheets = [
  { name: '維多利亞島', gid: '2100610320' },
  // { name: '艾納斯大陸', gid: '483624389' },
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

function getBlockStartRowsLv(table) {
  const blockStarts = [];

  for (let i = 0; i < table.length; i++) {
    if (!table[i]) continue;
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
        mp: table[blockStart + 7][col] || '',
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

function getMonsterDrop(){
  
}

function parseAllMonsters(table) {
  const monsters = getMonsterBasicInformation(table);
  const defenses = getMonsterDefense(table);

  return monsters.map((monster, idx) => ({
    ...monster,
    defense: defenses[idx] || {},
  }));
}

async function main() {
  for (const region of regionSheets) {
    console.log('region:', region);
    const table = await fetchAndParseSheet(region);
    const monsters = parseAllMonsters(table);

    // ====== 這裡插測試用 code ======
    const lvStarts = getBlockStartRowsLv(table);
    const defenseStarts = getBlockStartRowsDefense(table);

    const firstLvIdx = lvStarts[0];
    const firstDefenseIdx = defenseStarts.find(idx => idx > firstLvIdx) ?? table.length;

    const firstDropBlock = table.slice(firstLvIdx + 1, firstDefenseIdx);

    console.log('第一組 LV~物理防禦力之間的區塊：');
    firstDropBlock.forEach((row, i) => {
      console.log(`Row ${firstLvIdx + 1 + i}:`, row);
    });
    // ====== 測試用 code 結束 ======

    fs.writeFileSync(
      path.join(__dirname, `monsterData_${region.name}.json`),
      JSON.stringify(monsters, null, 2),
      'utf-8'
    );

  }
}
main();

