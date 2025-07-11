// scripts/fetch-monster.ts
import { writeFile } from 'fs/promises';

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1xb6FhSGcM6EIj7aDcUmxZA9zVxLEw8xxXxxej5Tcrt4/export?format=csv&gid=2009398468';

async function fetchCSV() {
  const res = await fetch(SHEET_CSV_URL);
  const csvText = await res.text();
  await writeFile('public/monster.csv', csvText); // 直接存一份在 public 資料夾
  console.log('✅ 怪物資料已儲存到 public/monster.csv');
}

fetchCSV().catch(console.error);