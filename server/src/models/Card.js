const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Card = sequelize.define('Card', {
  // 基础信息
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    comment: '卡片 ID'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '卡片英文名称'
  },
  nameCN: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: '',
    comment: '卡片中文名称'
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '卡片类型：Monster, Spell, Trap'
  },

  // 怪兽卡属性
  race: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '种族：Dragon, Warrior 等'
  },
  attribute: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '属性：DARK, LIGHT, WATER 等'
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '等级'
  },
  atk: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '攻击力'
  },
  def: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '防御力'
  },

  // 描述信息
  desc: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '英文描述'
  },
  descCN: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '中文描述'
  },

  // 卡组信息
  archetype: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '系列'
  },

  // 图片（JSON 格式存储）
  card_images: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '卡片图片'
  },

  // 价格信息（JSON 格式存储）
  card_prices: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '卡片价格'
  },

  // 额外信息
  frameType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '框架类型'
  },
  scale: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '刻度'
  },
  linkval: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Link 值'
  },
  linkmarkers: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Link 标记'
  }
}, {
  tableName: 'cards',
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['nameCN']
    },
    {
      fields: ['type']
    },
    {
      fields: ['race']
    },
    {
      fields: ['attribute']
    }
  ]
});

module.exports = Card;
