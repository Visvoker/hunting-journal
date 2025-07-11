const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const xlsxPath = path.join(__dirname, '中英文_Artale Monster Database_.xlsx');
const sheetName = '維多利亞島(Victoria Island)';

const workbook = XLSX.readFile(xlsxPath);
const ws = workbook.Sheets[sheetName];
const table = XLSX.utils.sheet_to_json(ws, { header: 1 });

const MONSTERS_PER_ROW = 5;
const MONSTER_COL_OFFSET = 6; // 每隻怪物相隔 6 欄
const nameColIndexes = [4, 10, 16, 22, 28]; // 改這裡

function getBlockStartRows(table) {
  const blockStarts = [];
  for (let i = 0; i < table.length; i++) {
    if (!table[i]) continue;
    for (let c = 0; c < table[i].length; c++) {
      if (typeof table[i][c] === 'string' && /^LV\./.test(table[i][c])) {
        blockStarts.push(i - 1); // 這行就是這個怪物群的起點
        break;
      }
    }
  }
  return blockStarts;
}

function getMonsterDrops(table, startRow, nameCol, maxDropRows = 6) {
  const drops = [];
  for (let r = 0; r < maxDropRows; r++) {
    for (let d = 0; d < 3; d++) {
      const col = nameCol + d * 2;
      const cell = table[startRow + 10 + r]?.[col];
      if (cell && String(cell).trim() !== '') {
        drops.push(cell);
      }
    }
  }
  return drops;
}

function getMonsterDefBlock(table, blockStart, col) {
  // 物理防禦力通常在掉落物下面
  let defRow = -1;
  for (let i = blockStart + 16; i < blockStart + 25; i++) { // 限定往下找
    if (
      table[i] &&
      typeof table[i][col] === 'string' &&
      table[i][col].includes('物理防禦力')
    ) {
      defRow = i;
      break;
    }
  }
  if (defRow === -1) return { defensePhysical: '', defenseMagic: '', evasionRate: '', accuracy: '' };

  // 這一行的下一行才是數值！橫向 spread
  const valRow = defRow + 1;
  return {
    defensePhysical: table[valRow]?.[col] ?? '',
    defenseMagic: table[valRow]?.[col + 2] ?? '',
    evasionRate: table[valRow]?.[col + 4] ?? '',
    accuracy: table[valRow + 1]?.[col] ?? '',
  };
}

function parseAllMonsters(table) {
  const monsters = [];
  const blockStartRows = getBlockStartRows(table);

  for (let blockIdx = 0; blockIdx < blockStartRows.length; blockIdx++) {
    const blockStart = blockStartRows[blockIdx];
    for (let i = 0; i < MONSTERS_PER_ROW; i++) {
      const col = nameColIndexes[i];

      const defBlock = getMonsterDefBlock(table, blockStart, col);

      const monster = {
        level: table[blockStart + 1][col] || '',
        name: table[blockStart + 9][col] || '',
        gold: table[blockStart + 9][col + 1] || '',
        drops: getMonsterDrops(table, blockStart, col, 6),
        ...defBlock
      };
      monsters.push(monster);
    }
  }
  return monsters;
}

const monsters = parseAllMonsters(table);

fs.writeFileSync(
  path.join(__dirname, 'monsterData.json'),
  JSON.stringify(monsters, null, 2),
  'utf-8'
);
console.log(`已輸出 ${monsters.length} 隻怪到 monsterData.json`);
