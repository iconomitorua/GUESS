const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

// 卡片搜索 API
router.post('/card/search', cardController.searchCards);
router.get('/card/search', cardController.searchCards);

// 根据 ID 获取卡片
router.get('/card/:id', cardController.getCardById);

// 获取所有卡片（分页）
router.get('/cards', cardController.getAllCards);

// 获取统计信息
router.get('/cards/stats', cardController.getStats);

module.exports = router;
