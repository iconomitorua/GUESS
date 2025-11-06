const Card = require('../models/Card');
const { Op } = require('sequelize');

/**
 * 搜索卡片
 */
exports.searchCards = async (req, res) => {
  try {
    // 支持从 query 或 body 获取参数
    const params = req.body.params || req.query;
    const {
      keyword = '',
      page = 1,
      pageSize = 10,
      type,
      attribute,
      race,
      level,
      atk,
      def
    } = params;

    // 构建查询条件
    const where = {};

    // 关键词搜索（支持中英文）
    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { nameCN: { [Op.like]: `%${keyword}%` } },
        { desc: { [Op.like]: `%${keyword}%` } },
        { descCN: { [Op.like]: `%${keyword}%` } }
      ];
    }

    // 精确匹配条件
    if (type) where.type = type;
    if (attribute) where.attribute = attribute;
    if (race) where.race = race;
    if (level) where.level = parseInt(level);
    if (atk !== undefined) where.atk = parseInt(atk);
    if (def !== undefined) where.def = parseInt(def);

    // 计算分页
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    // 执行查询
    const { count, rows } = await Card.findAndCountAll({
      where,
      offset,
      limit,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      code: 200000,
      message: 'SUCCESS',
      result: {
        code: 200000,
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
      code: 500000,
      message: 'ERROR',
      result: {
        code: 500000,
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
    const card = await Card.findOne({ where: { id: parseInt(id) } });

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
      code: 200000,
      message: 'SUCCESS',
      result: {
        code: 200000,
        message: 'TRUE'
      },
      response: {
        card
      }
    });

  } catch (error) {
    console.error('获取卡片错误:', error);
    res.status(500).json({
      code: 500000,
      message: 'ERROR',
      result: {
        code: 500000,
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

    const { count, rows } = await Card.findAndCountAll({
      offset,
      limit,
      order: [['id', 'ASC']]
    });

    res.json({
      code: 200000,
      message: 'SUCCESS',
      result: {
        code: 200000,
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
      code: 500000,
      message: 'ERROR',
      result: {
        code: 500000,
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
    const totalCards = await Card.count();
    const monsterCards = await Card.count({
      where: { type: { [Op.like]: '%Monster%' } }
    });
    const spellCards = await Card.count({
      where: { type: 'Spell Card' }
    });
    const trapCards = await Card.count({
      where: { type: 'Trap Card' }
    });

    res.json({
      code: 200000,
      message: 'SUCCESS',
      result: {
        code: 200000,
        message: 'TRUE'
      },
      response: {
        total: totalCards,
        monsters: monsterCards,
        spells: spellCards,
        traps: trapCards
      }
    });

  } catch (error) {
    console.error('获取统计信息错误:', error);
    res.status(500).json({
      code: 500000,
      message: 'ERROR',
      result: {
        code: 500000,
        message: error.message
      }
    });
  }
};
