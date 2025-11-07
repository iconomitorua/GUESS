const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CardCN = sequelize.define('CardCN', {
  // 基础信息
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: 'ID'
  },
  cardId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '卡片 ID'
  },
  lang: {
    type: DataTypes.STRING(10),
    defaultValue: 'cn',
    comment: '语言'
  },
  cardName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '卡片中文名称'
  },
  cardText: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '卡片效果描述'
  },

  // 怪兽属性
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
  attributeName: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: '属性名称（光属性、暗属性等）'
  },
  speciesName: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '种族名称数组（龙、战士等）'
  },
  starchip: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '星级/等级'
  },

  // 效果和类型
  effectName: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: '效果名称'
  },
  otherItemNameList: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '其他类型列表（融合、同步、超量等）'
  },
  otherItemIcon: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '类型图标'
  },

  // 灵摆相关
  penScale: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '灵摆刻度'
  },
  pendulumText: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '灵摆效果描述'
  },

  // Link 怪兽相关
  linkMarker: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Link 标记'
  },
  linkMarkerCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Link 数量'
  },

  // 图片信息
  imageId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '图片 ID'
  },
  imageKey: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: '图片密钥'
  },

  // 其他
  lots: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '卡包信息'
  }
}, {
  tableName: 'cards_cn',
  timestamps: true,
  indexes: [
    {
      fields: ['id']
    },
    {
      fields: ['cardId']
    },
    {
      fields: ['cardName']
    },
    {
      fields: ['attributeName']
    },
    {
      fields: ['starchip']
    }
  ]
});

module.exports = CardCN;
