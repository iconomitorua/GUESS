require("dotenv").config();
const axios = require("axios");
const { sequelize } = require("../config/database");
const CardCN = require("../models/CardCN");

// 远程 API 配置
const REMOTE_API = "https://yxwdbapi.windoent.com/konami/card/search";
const PAGE_SIZE = 10000; // 每次获取 10000 条数据

/**
 * 从远程 API 分批获取卡片数据
 */
async function fetchAllCardsFromRemote() {
  try {
    console.log("🔄 正在从远程 API 获取中文卡片数据...\n");

    let allCards = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        console.log(
          `   📡 正在获取第 ${page} 批数据 (pageSize: ${PAGE_SIZE})...`
        );

        const response = await axios.post(
          REMOTE_API,
          {
            params: {
              page: page,
              pageSize: PAGE_SIZE,
              atkFrom: "",
              atkTo: "",
              attributeList: [],
              cardType: "",
              defFrom: "",
              defTo: "",
              effectList: [],
              exclusionList: [],
              keyword: "",
              lang: "cn",
              keywordLang: "cn",
              linkCondition: "1",
              linkMarkerList: [],
              mode: "1",
              otherCondition: "1",
              otherItemList: [],
              penscaleList: [],
              searchType: "1",
              sort: "1",
              uspeciesList: [],
              starList: [],
              titleId: "1",
              ullist: 0,
            },
          },
          {
            timeout: 30000, // 30秒超时
          }
        );

        if (
          response.data &&
          response.data.result &&
          (response.data.result.code === 200000 || response.data.result.code === "200000") &&
          response.data.response &&
          response.data.response.cardList &&
          Array.isArray(response.data.response.cardList)
        ) {
          const cards = response.data.response.cardList;
          const total = response.data.response.total;

          console.log(`   ✅ 成功获取 ${cards.length} 张卡片`);
          console.log(
            `   📊 当前进度: ${allCards.length + cards.length}/${total}`
          );

          allCards = allCards.concat(cards);

          // 判断是否还有更多数据
          if (allCards.length >= total || cards.length === 0) {
            hasMore = false;
            console.log(`   ✅ 所有数据获取完成！\n`);
          } else {
            page++;
            // 等待一会儿，避免请求过快
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        } else {
          console.error("   ❌ 数据格式错误");
          console.error("   📝 实际响应:", JSON.stringify(response.data, null, 2).substring(0, 1000));
          hasMore = false;
        }
      } catch (error) {
        console.error(`   ❌ 获取第 ${page} 批数据失败:`, error.message);
        // 如果失败，尝试继续下一批
        page++;
        if (page > 5) {
          // 最多重试5次
          hasMore = false;
        }
      }
    }

    console.log(`\n✅ 总共获取 ${allCards.length} 张卡片数据\n`);
    return allCards;
  } catch (error) {
    console.error("❌ 获取卡片数据失败:", error.message);
    throw error;
  }
}

/**
 * 导入卡片到数据库
 */
async function importCards(cards) {
  try {
    console.log("🔄 正在导入卡片到数据库...\n");

    let imported = 0;
    let updated = 0;
    let failed = 0;

    for (const cardData of cards) {
      try {
        // 检查是否已存在（通过 cardId 判断）
        const existingCard = await CardCN.findOne({
          where: { cardId: cardData.cardId }
        });

        const cardInfo = {
          cardId: cardData.cardId,
          lang: cardData.lang || "cn",
          cardName: cardData.cardName,
          cardText: cardData.cardText,
          atk: cardData.atk,
          def: cardData.def,
          attributeName: cardData.attributeName,
          speciesName: cardData.speciesName,
          starchip: cardData.starchip,
          effectName: cardData.effectName,
          otherItemNameList: cardData.otherItemNameList,
          otherItemIcon: cardData.otherItemIcon,
          penScale: cardData.penScale,
          pendulumText: cardData.pendulumText,
          linkMarker: cardData.linkMarker,
          linkMarkerCount: cardData.linkMarkerCount,
          imageId: cardData.imageId,
          imageKey: cardData.imageKey,
          lots: cardData.lots,
        };

        if (existingCard) {
          // 更新现有记录
          await existingCard.update(cardInfo);
          updated++;
        } else {
          // 创建新记录（id 自动递增）
          await CardCN.create(cardInfo);
          imported++;
        }

        if ((imported + updated) % 500 === 0) {
          console.log(
            `   已处理 ${imported + updated}/${cards.length} 张卡片...`
          );
        }
      } catch (error) {
        failed++;
        console.error(
          `   ⚠️  导入卡片失败 [${cardData.cardId}] ${cardData.cardName}:`,
          error.message
        );
      }
    }

    console.log("\n📊 导入统计:");
    console.log(`   ✅ 新增: ${imported} 张`);
    console.log(`   🔄 更新: ${updated} 张`);
    console.log(`   ❌ 失败: ${failed} 张`);

    return { imported, updated, failed };
  } catch (error) {
    console.error("❌ 导入过程出错:", error);
    throw error;
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log("");
    console.log("🚀 ========================================");
    console.log("🎮 开始导入游戏王中文卡片数据");
    console.log("🚀 ========================================");
    console.log("");

    // 连接数据库
    console.log("🔄 正在连接数据库...");
    await sequelize.authenticate();
    console.log("✅ 数据库连接成功\n");

    // 同步数据库表（创建表）
    console.log("🔄 正在同步数据库表...");
    await sequelize.sync({ alter: true }); // 使用 alter 自动调整表结构
    console.log("✅ 数据库表同步完成\n");

    // 获取所有卡片数据（分批）
    const cards = await fetchAllCardsFromRemote();

    if (cards.length === 0) {
      console.log("⚠️  没有获取到卡片数据");
      process.exit(0);
    }

    // 导入到数据库
    await importCards(cards);

    // 显示统计信息
    const totalCards = await CardCN.count();
    console.log(`\n📊 数据库统计:`);
    console.log(`   总卡片数: ${totalCards}`);

    console.log("\n✅ 中文卡片数据导入完成!");
    console.log("");
  } catch (error) {
    console.error("\n❌ 初始化失败:", error);
    process.exit(1);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
    console.log("👋 数据库连接已关闭");
  }
}

// 执行
if (require.main === module) {
  main();
}

module.exports = { fetchAllCardsFromRemote, importCards };
