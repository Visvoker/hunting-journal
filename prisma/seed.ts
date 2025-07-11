// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 嫩寶
  await prisma.monster.create({
    data: {
      id: 1,
      name: "嫩寶",
      imageUrl: "",
      level: 1,
      attribute: "強毒",
      hp: 8,
      exp: 0,
      money: 3,
      defensePhysical: 0,
      defenseMagic: 0,
      evasionRate: 0,
      accuracy: 0,
      drops: {
        create: [
          { itemNameZh: "嫩寶的蝸牛殼", itemNameEn: "Bob's Snail Shell" },
          { itemNameZh: "紅色藥水", itemNameEn: "Red Potion" },
          { itemNameZh: "青蘋果", itemNameEn: "Green Apple" },
          { itemNameZh: "石榴石母礦", itemNameEn: "Garnet Ore" },
          { itemNameZh: "箭矢", itemNameEn: "Arrow" },
          { itemNameZh: "綠髮帶", itemNameEn: "Green Headband" },
          { itemNameZh: "青銅母礦", itemNameEn: "Bronze Ore" },
          { itemNameZh: "弩箭", itemNameEn: "Crossbow Bolt" },
          {
            itemNameZh: "披風魔防捲軸60%",
            itemNameEn: "Cloak MDEF Scroll 60%",
          },
        ],
      },
    },
  });

  // 藍寶
  await prisma.monster.create({
    data: {
      id: 2,
      name: "藍寶",
      imageUrl: "",
      level: 2,
      attribute: "X",
      hp: 15,
      exp: 15,
      money: 4,
      defensePhysical: 0,
      defenseMagic: 0,
      evasionRate: 0,
      accuracy: 0,
      drops: {
        create: [
          { itemNameZh: "藍寶殼", itemNameEn: "Blue Snail Shell" },
          { itemNameZh: "紅色藥水", itemNameEn: "Red Potion" },
          { itemNameZh: "青蘋果", itemNameEn: "Green Apple" },
          { itemNameZh: "紫水晶母礦", itemNameEn: "Amethyst Ore" },
          { itemNameZh: "鋼鐵母礦", itemNameEn: "Steel Ore" },
          {
            itemNameZh: "紅白條紋T恤",
            itemNameEn: "Red-White Striped T-Shirt",
          },
          { itemNameZh: "灰色棉褲", itemNameEn: "Grey Cotton Pants" },
          {
            itemNameZh: "灰/棕訓練衫",
            itemNameEn: "Grey/Brown Training Shirt",
          },
          {
            itemNameZh: "灰/棕訓練褲",
            itemNameEn: "Grey/Brown Training Pants",
          },
        ],
      },
    },
  });

  // 菇菇仔
  await prisma.monster.create({
    data: {
      id: 3,
      name: "菇菇仔",
      imageUrl: "",
      level: 2,
      attribute: "X",
      hp: 20,
      exp: 15,
      money: 5,
      defensePhysical: 0,
      defenseMagic: 0,
      evasionRate: 0,
      accuracy: 0,
      drops: {
        create: [
          { itemNameZh: "蘑菇芽胞", itemNameEn: "Mushroom Spore" },
          { itemNameZh: "紅色藥水", itemNameEn: "Red Potion" },
          { itemNameZh: "青蘋果", itemNameEn: "Green Apple" },
          { itemNameZh: "海藍石母礦", itemNameEn: "Aquamarine Ore" },
          { itemNameZh: "錸礦石母礦", itemNameEn: "Rhodium Ore" },
          { itemNameZh: "戰鬥短刀", itemNameEn: "Combat Dagger" },
          { itemNameZh: "破爛牛仔褲", itemNameEn: "Tattered Jeans" },
          { itemNameZh: "藍馬褲", itemNameEn: "Blue Jeans" },
          { itemNameZh: "披風生命捲軸60%", itemNameEn: "Cloak HP Scroll 60%" },
        ],
      },
    },
  });

  // 紅寶
  await prisma.monster.create({
    data: {
      id: 4,
      name: "紅寶",
      imageUrl: "",
      level: 4,
      attribute: "X",
      hp: 40,
      exp: 30,
      money: 8,
      defensePhysical: 3,
      defenseMagic: 10,
      evasionRate: 0,
      accuracy: 0,
      drops: {
        create: [
          { itemNameZh: "紅寶殼", itemNameEn: "Red Snail Shell" },
          { itemNameZh: "紅色藥水", itemNameEn: "Red Potion" },
          { itemNameZh: "青蘋果", itemNameEn: "Green Apple" },
          { itemNameZh: "銀礦母礦", itemNameEn: "Silver Ore" },
          { itemNameZh: "蛋白石母礦", itemNameEn: "Opal Ore" },
          { itemNameZh: "皮製手提包", itemNameEn: "Leather Pouch" },
          { itemNameZh: "金屬短杖", itemNameEn: "Metal Short Staff" },
          { itemNameZh: "紅布褲", itemNameEn: "Red Cloth Pants" },
          { itemNameZh: "褐色洛磯外衣", itemNameEn: "Brown Rocky Coat" },
          { itemNameZh: "紫水晶耳環", itemNameEn: "Amethyst Earrings" },
          { itemNameZh: "箭矢", itemNameEn: "Arrow" },
          {
            itemNameZh: "整體防具敏捷捲軸10%",
            itemNameEn: "Overall Armor DEX Scroll 10%",
          },
          {
            itemNameZh: "披風魔力捲軸100%",
            itemNameEn: "Cloak MP Scroll 100%",
          },
        ],
      },
    },
  });

  // 木妖
  await prisma.monster.create({
    data: {
      id: 5,
      name: "木妖",
      imageUrl: "",
      level: 4,
      attribute: "弱火",
      hp: 45,
      exp: 30,
      money: 8,
      defensePhysical: 3,
      defenseMagic: 10,
      evasionRate: 0,
      accuracy: 0,
      drops: {
        create: [
          { itemNameZh: "樹枝", itemNameEn: "Tree Branch" },
          { itemNameZh: "紅色藥水", itemNameEn: "Red Potion" },
          { itemNameZh: "青蘋果", itemNameEn: "Green Apple" },
          { itemNameZh: "祖母綠母礦", itemNameEn: "Emerald Ore" },
          { itemNameZh: "朱鎳石母礦", itemNameEn: "Nickel Ore" },
          { itemNameZh: "鋼鐵弓", itemNameEn: "Steel Bow" },
          { itemNameZh: "木劍", itemNameEn: "Wooden Sword" },
          { itemNameZh: "棕短指手套", itemNameEn: "Brown Short Gloves" },
          { itemNameZh: "褐旅行鞋", itemNameEn: "Brown Traveling Shoes" },
          { itemNameZh: "紅皮甲褲", itemNameEn: "Red Leather Pants" },
          {
            itemNameZh: "上衣防禦捲軸10%",
            itemNameEn: "Topwear DEF Scroll 10%",
          },
          { itemNameZh: "披風生命捲軸10%", itemNameEn: "Cloak HP Scroll 10%" },
        ],
      },
    },
  });
}

// 2. （可選）建立一個測試用帳號
await prisma.user.createMany({
  data: [
    {
      username: "mapleHunter",
      password: "hunter123",
      email: "hunter1@example.com",
    },
    {
      username: "gemCollector",
      password: "gemstone!@#",
      email: "collector42@example.com",
    },
    {
      username: "snailChaser",
      password: "snailPASS",
      email: "chaser77@example.com",
    },
  ],
  skipDuplicates: true,
});

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
