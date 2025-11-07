require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { connectDB } = require('./config/database');
const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const cardRoutes = require('./routes/cards');
const cardCNRoutes = require('./routes/cardsCN');

// 创建 Express 应用
const app = express();
const PORT = process.env.PORT || 3001;

// 连接数据库
connectDB();

// 中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(compression()); // 启用 gzip 压缩
app.use(express.json()); // 解析 JSON
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码
app.use(logger); // 请求日志

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API 路由
app.use('/konami', cardRoutes);
app.use('/konami', cardCNRoutes);

// 首页
app.get('/', (req, res) => {
  res.json({
    name: '游戏王卡片 API',
    version: '1.0.0',
    database: 'MySQL',
    endpoints: {
      health: '/health',
      search: 'POST /konami/card/search',
      getCard: 'GET /konami/card/:id',
      getAllCards: 'GET /konami/cards',
      stats: 'GET /konami/cards/stats'
    }
  });
});

// 错误处理
app.use(notFound);
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log(`🎮 游戏王卡片 API 服务已启动`);
  console.log(`📡 端口: ${PORT}`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 数据库: MySQL`);
  console.log(`🔗 地址: http://localhost:${PORT}`);
  console.log('🚀 ========================================');
  console.log('');
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('👋 收到 SIGTERM 信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 收到 SIGINT 信号，正在关闭服务器...');
  process.exit(0);
});

module.exports = app;
