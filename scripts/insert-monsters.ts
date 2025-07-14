import { PrismaClient } from "@prisma/client";
import * as fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(
    __dirname,
    "monsterData_維多利亞島_converted.json"
  );
  const raw = await fs.readFile(filePath, "utf-8");
  const monsters = JSON.parse(raw);

  for (const monster of monsters) {
    // 先插入 DropItem，再插入 Monster 和 MonsterDrop 關聯
    const dropItems = await Promise.all(
      (monster.drops || []).map(async (drop: any) => {
        // 用 nameZh + nameEn 判斷唯一
        const existed = await prisma.dropItem.findFirst({
          where: { nameZh: drop.nameZh, nameEn: drop.nameEn },
        });
        if (existed) return existed;
        return prisma.dropItem.create({
          data: {
            nameZh: drop.nameZh,
            nameEn: drop.nameEn,
          },
        });
      })
    );

    // 插入 Monster
    const monsterRecord = await prisma.monster.create({
      data: {
        nameEn: monster.nameEn,
        nameZh: monster.nameZh,
        attribute: monster.attribute,
        imageUrl: monster.imageUrl ?? null,
        level: Number(String(monster.level).replace(/[^0-9]/g, "")) || 0,
        hp: Number(monster.hp) || 0,
        exp: Number(monster.exp) || 0,
        gold: monster.gold,
        defensePhysical: Number(monster.defense.defensePhysical) || 0,
        defenseMagic: Number(monster.defense.defenseMagic) || 0,
        evasionRate: Number(monster.defense.evasionRate) || 0,
        accuracy: String(monster.defense.accuracy ?? ""),
        // 下面這行只要 drops 跟 monsterDrop 是關聯正確就好
        monsterDrops: {
          create: dropItems.map((item) => ({
            dropItem: { connect: { id: item.id } },
          })),
        },
      },
    });
    console.log(
      `✔ 已寫入怪物：${monsterRecord.nameZh || monsterRecord.nameEn}`
    );
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("✅ 匯入完成");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
