require('dotenv').config();
const axios = require('axios');
const { sequelize } = require('../config/database');
const Card = require('../models/Card');

// 中文卡片名称映射（示例，实际需要完整的数据）
const chineseNames = {
  'Blue-Eyes White Dragon': '青眼白龙',
  'Dark Magician': '黑魔导',
  'Red-Eyes Black Dragon': '真红眼黑龙',
  'Exodia the Forbidden One': '被封印的艾克佐迪亚',
  'Slifer the Sky Dragon': '欧西里斯的天空龙',
  'Obelisk the Tormentor': '欧贝利斯克的巨神兵',
  'The Winged Dragon of Ra': '拉的翼神龙',
  'Stardust Dragon': '星尘龙',
  'Black Rose Dragon': '黑蔷薇龙',
  'Ancient Fairy Dragon': '古代妖精龙',
  'Power Tool Dragon': '力量工具龙',
  'Black-Winged Dragon': '黑羽龙',
  'Red Dragon Archfiend': '红莲恶魔龙',
  // 可以添加更多映射...
};

/**
 * 从 YGOPRODeck API 获取所有卡片数据
 */
async function fetchAllCards() {
  try {
    console.log('🔄 正在从 YGOPRODeck API 获取卡片数据...');

    const response = await axios.get(`${process.env.YGOPRODECK_API}/cardinfo.php`, {
      timeout: 60000 // 60秒超时
    });

    if (response.data && response.data.data) {
      console.log(`✅ 成功获取 ${response.data.data.length} 张卡片数据`);
      return response.data.data;
    }

    return [];
  } catch (error) {
    console.error('❌ 获取卡片数据失败:', error.message);
    throw error;
  }
}

/**
 * 添加中文名称
 */
function addChineseName(card) {
  if (chineseNames[card.name]) {
    card.nameCN = chineseNames[card.name];
  }
  return card;
}

/**
 * 导入卡片到数据库
 */
async function importCards(cards) {
  try {
    console.log('🔄 正在导入卡片到数据库...');

    let imported = 0;
    let updated = 0;
    let failed = 0;

    for (const cardData of cards) {
      try {
        // 添加中文名称
        const cardWithChinese = addChineseName(cardData);

        // 使用 upsert（存在则更新，不存在则插入）
        const [card, created] = await Card.upsert({
          id: cardWithChinese.id,
          name: cardWithChinese.name,
          nameCN: cardWithChinese.nameCN || '',
          type: cardWithChinese.type,
          race: cardWithChinese.race,
          attribute: cardWithChinese.attribute,
          level: cardWithChinese.level,
          atk: cardWithChinese.atk,
          def: cardWithChinese.def,
          desc: cardWithChinese.desc,
          descCN: cardWithChinese.descCN || '',
          archetype: cardWithChinese.archetype,
          card_images: cardWithChinese.card_images,
          card_prices: cardWithChinese.card_prices,
          frameType: cardWithChinese.frameType,
          scale: cardWithChinese.scale,
          linkval: cardWithChinese.linkval,
          linkmarkers: cardWithChinese.linkmarkers
        });

        if (created) {
          imported++;
        } else {
          updated++;
        }

        if ((imported + updated) % 100 === 0) {
          console.log(`   已处理 ${imported + updated}/${cards.length} 张卡片...`);
        }

      } catch (error) {
        failed++;
        console.error(`   ⚠️  导入卡片失败 [${cardData.id}] ${cardData.name}:`, error.message);
      }
    }

    console.log('\n📊 导入统计:');
    console.log(`   ✅ 新增: ${imported} 张`);
    console.log(`   🔄 更新: ${updated} 张`);
    console.log(`   ❌ 失败: ${failed} 张`);

    return { imported, updated, failed };

  } catch (error) {
    console.error('❌ 导入过程出错:', error);
    throw error;
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    // 连接数据库
    console.log('🔄 正在连接数据库...');
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功\n');

    // 同步数据库表（创建表）
    console.log('🔄 正在同步数据库表...');
    await sequelize.sync({ alter: true }); // 使用 alter 自动调整表结构
    console.log('✅ 数据库表同步完成\n');

    // 获取所有卡片数据
    const cards = await fetchAllCards();

    if (cards.length === 0) {
      console.log('⚠️  没有获取到卡片数据');
      process.exit(0);
    }

    // 导入到数据库
    await importCards(cards);

    // 显示统计信息
    const totalCards = await Card.count();
    console.log(`\n📊 数据库统计:`);
    console.log(`   总卡片数: ${totalCards}`);

    console.log('\n✅ 数据初始化完成!');

  } catch (error) {
    console.error('\n❌ 初始化失败:', error);
    process.exit(1);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
    console.log('👋 数据库连接已关闭');
  }
}

// 执行
if (require.main === module) {
  main();
}

module.exports = { fetchAllCards, importCards };
