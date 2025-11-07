const express = require('express');
const router = express.Router();
const cardCNController = require('../controllers/cardCNController');

// 卡片搜索 API
router.post('/cardCN/search', cardCNController.searchCards);
router.get('/cardCN/search', cardCNController.searchCards);

// 根据 ID 获取卡片
router.get('/cardCN/:id', cardCNController.getCardById);

// 获取所有卡片（分页）
router.get('/cardsCN', cardCNController.getAllCards);

// 获取统计信息
router.get('/cardsCN/stats', cardCNController.getStats);

module.exports = router;
