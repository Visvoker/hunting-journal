import * as fs from "fs/promises";
import * as path from "path";

const regionSheets = [
  { name: "維多利亞島" },
  { name: "艾納斯大陸" },
  { name: "路德斯湖" },
  { name: "水世界" },
  // ...其他地區
];

// 把 "英文\n(中文)" 拆分
function splitName(mixed: string): { nameEn: string; nameZh: string } {
  // 英文＋中文格式
  const match = mixed.match(/^([^\n]+)\n?\(([^)]+)\)$/);
  if (match) {
    return {
      nameEn: match[1].trim(),
      nameZh: match[2].trim(),
    };
  }

  // 只有全中文
  if (/^[\u4e00-\u9fff\s]+$/.test(mixed.trim())) {
    return {
      nameEn: "",
      nameZh: mixed.trim(),
    };
  }

  // 只有英文（或混合沒括號）
  if (/^[\x00-\x7F\s]+$/.test(mixed.trim())) {
    return {
      nameEn: mixed.trim(),
      nameZh: "",
    };
  }

  // 萬一是混合沒括號（中英混雜），一律塞進 nameZh，英文留空
  return {
    nameEn: "",
    nameZh: mixed.trim(),
  };
}


async function convertRegion(regionName: string) {
  const inputPath = path.join(__dirname, `monsterData_${regionName}.json`);
  const outputPath = path.join(
    __dirname,
    `monsterData_${regionName}_converted.json`
  );

  try {
    const raw = await fs.readFile(inputPath, "utf-8");
    const monsters = JSON.parse(raw);

    // 怪物
    const newMonsters = monsters.map((monster: any) => {
      const { nameEn, nameZh } = splitName(monster.name);
      // 掉落物
      const drops = (monster.drops ?? []).map((drop: string) =>
        splitName(drop)
      );
      return {
        ...monster,
        nameEn,
        nameZh,
        drops,
      };
    });

    await fs.writeFile(
      outputPath,
      JSON.stringify(newMonsters, null, 2),
      "utf-8"
    );
    console.log(`✔ 已轉換 ${regionName}，輸出 ${outputPath}`);
  } catch (e) {
    console.error(`✘ 轉換 ${regionName} 失敗:`, e);
  }
}

async function main() {
  for (const region of regionSheets) {
    await convertRegion(region.name);
  }
}

main();
