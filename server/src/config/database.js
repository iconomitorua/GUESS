const { Sequelize } = require('sequelize');

// 创建 Sequelize 实例
const sequelize = new Sequelize(
  process.env.DB_NAME || 'yugioh_cards',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '12345678',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    timezone: '+08:00', // 东八区时区
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true, // 不自动复数化表名
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

// 测试数据库连接
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL 数据库连接成功');

    // 同步数据库表（开发环境）
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ 数据库表同步完成');
    }

  } catch (error) {
    console.error('❌ MySQL 连接失败:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
