const CardCN = require('../models/CardCN');
const { Op } = require('sequelize');

/**
 * 搜索卡片
 */
exports.searchCards = async (req, res) => {
  try {
    // 支持从 query 或 body 获取参数
    const params = req.body.params || req.query;
    const {
      page = 1,
      pageSize = 10,
      keyword = '',
      cardld,
      lang,
      cardName,
      cardText,
      atk,
      def,
      attributeName,
      speciesName,
      starchip,
      effectName,
      otherltemNameList,
      otherltemlcon,
      penScale,
      pendulumText,
      linkMarker,
      linkMarkerCount,
      imageld,
      imageKey,
      lots,
      createdAt,
      updatedAt,
    } = params;

    // 构建查询条件
    const where = {};

    // 关键词搜索
    if (keyword) {
      where[Op.or] = [
        { cardId: { [Op.like]: `%${keyword}%` } },
        { cardName: { [Op.like]: `%${keyword}%` } },
        { attributeName: { [Op.like]: `%${keyword}%` } },
        { starchip: { [Op.like]: `%${keyword}%` } }
      ];
    }

    // 精确匹配条件
    if (cardld) where.cardld = parseInt(cardld);
    if (lang) where.lang = lang;
    if (cardName) where.cardName = cardName;
    if (cardText) where.cardText = { [Op.like]: `%${cardText}%` };
    if (pendulumText) where.pendulumText = { [Op.like]: `%${pendulumText}%` };
    if (attributeName) where.attributeName = attributeName;
    if (speciesName) where.speciesName = speciesName;
    if (penScale) where.penScale = parseInt(penScale);
    if (linkMarker) where.linkMarker = linkMarker;
    if (linkMarkerCount) where.linkMarkerCount = parseInt(linkMarkerCount);
    if (starchip) where.starchip = parseInt(starchip);
    if (imageld) where.imageld = parseInt(imageld);
    if (atk !== undefined) where.atk = parseInt(atk);
    if (def !== undefined) where.def = parseInt(def);

    // 计算分页
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    // 执行查询
    const { count, rows } = await CardCN.findAndCountAll({
      where,
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      code: 200,
      message: 'SUCCESS',
      result: {
        code: 200,
        message: 'TRUE'
      },
      response: {
        cardList: rows,
        total: count,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(count / parseInt(pageSize))
      }
    });

  } catch (error) {
    console.error('搜索卡片错误:', error);
    res.status(500).json({
      code: 500,
      message: 'ERROR',
      result: {
        code: 500,
        message: error.message
      }
    });
  }
};

/**
 * 根据 ID 获取卡片
 */
exports.getCardById = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await CardCN.findOne({ where: { id: parseInt(id) } });

    if (!card) {
      return res.status(404).json({
        code: 404000,
        message: 'NOT_FOUND',
        result: {
          code: 404000,
          message: '卡片不存在'
        }
      });
    }

    res.json({
      code: 200,
      message: 'SUCCESS',
      response: {
        card
      }
    });

  } catch (error) {
    console.error('获取卡片错误:', error);
    res.status(500).json({
      code: 500,
      message: 'ERROR',
      result: {
        code: 500,
        message: error.message
      }
    });
  }
};

/**
 * 获取所有卡片（支持分页）
 */
exports.getAllCards = async (req, res) => {
  try {
    const { page = 1, pageSize = 50 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const { count, rows } = await CardCN.findAndCountAll({
      offset,
      limit,
      order: [['id', 'ASC']]
    });

    res.json({
      code: 200,
      message: 'SUCCESS',
      result: {
        code: 200,
        message: 'TRUE'
      },
      response: {
        cardList: rows,
        total: count,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(count / parseInt(pageSize))
      }
    });

  } catch (error) {
    console.error('获取所有卡片错误:', error);
    res.status(500).json({
      code: 500,
      message: 'ERROR',
      result: {
        code: 500,
        message: error.message
      }
    });
  }
};

/**
 * 获取统计信息
 */
exports.getStats = async (req, res) => {
  try {
    const totalCards = await CardCN.count();
    res.json({
      code: 200,
      message: 'SUCCESS',
      response: {
        total: totalCards,
      }
    });

  } catch (error) {
    console.error('获取统计信息错误:', error);
    res.status(500).json({
      code: 500,
      message: 'ERROR',
      result: {
        code: 500,
        message: error.message
      }
    });
  }
};
