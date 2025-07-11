import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  // 1. 讀取 monsterData.json
  const filePath = path.join(__dirname, 'monsterData.json')
  const json = fs.readFileSync(filePath, 'utf-8')
  const monsters = JSON.parse(json)

  for (const m of monsters) {
    // 2. 先建立 Monster（drops 之後加）
    await prisma.monster.create({
      data: {
        id: m.id,
        name: m.name,
        imageUrl: m.imageUrl,
        level: m.level,
        attribute: m.attribute,
        hp: m.hp,
        exp: m.exp,
        money: m.money,
        defensePhysical: m.defensePhysical,
        defenseMagic: m.defenseMagic,
        evasionRate: m.evasionRate,
        accuracy: m.accuracy,
      }
    })
    // 3. 批次加掉落物
    for (const drop of m.drops) {
      await prisma.monsterDrop.create({
        data: {
          monsterId: m.id,
          itemNameZh: drop.itemNameZh,
          itemNameEn: drop.itemNameEn,
        }
      })
    }
  }
}

main()
  .then(() => {
    console.log('匯入完成！')
    return prisma.$disconnect()
  })
  .catch(e => {
    console.error('匯入失敗:', e)
    return prisma.$disconnect()
  })
