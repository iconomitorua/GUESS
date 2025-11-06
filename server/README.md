# 游戏王卡片 API 后端 (MySQL 版本)

一个基于 Node.js + Express + MySQL 的游戏王卡片数据管理和查询 API。

## 功能特性

- ✅ 卡片搜索（支持中英文）
- ✅ 多条件筛选（类型、属性、种族、攻击力等）
- ✅ 分页查询
- ✅ 数据统计
- ✅ 从 YGOPRODeck API 导入数据
- ✅ RESTful API 设计
- ✅ 完整的错误处理

## 技术栈

- **Node.js** - 运行环境
- **Express** - Web 框架
- **MySQL** - 数据库
- **Sequelize** - ORM
- **Axios** - HTTP 客户端

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的 MySQL 配置：

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=yugioh_cards
DB_USER=root
DB_PASSWORD=你的MySQL密码
```

### 3. 创建数据库

在 Navicat 或 MySQL 命令行中创建数据库：

```sql
CREATE DATABASE yugioh_cards CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 初始化数据库

从 YGOPRODeck API 导入卡片数据：

```bash
npm run init-db
```

这个过程会：

1. 自动创建数据表
2. 从 YGOPRODeck API 导入约 13000+ 张卡片数据
3. 需要几分钟时间

### 5. 启动服务器

开发模式（自动重启）：

```bash
npm run dev
```

生产模式：

```bash
npm start
```

服务器默认运行在 `http://localhost:3001`

## API 端点

### 健康检查

```
GET /health
```

### 搜索卡片（支持中文）

```
POST /konami/card/search
GET /konami/card/search
```

**请求参数（支持 query 或 body）：**

```json
{
  "params": {
    "keyword": "青眼白龙",
    "page": 1,
    "pageSize": 10
  }
}
```

**响应示例：**

```json
{
  "code": 200000,
  "message": "SUCCESS",
  "result": {
    "code": 200000,
    "message": "TRUE"
  },
  "response": {
    "cardList": [...],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

### 其他端点

- `GET /konami/card/:id` - 根据 ID 获取卡片
- `GET /konami/cards` - 获取所有卡片（分页）
- `GET /konami/cards/stats` - 统计信息

## 使用 Navicat 管理数据库

### 1. 连接数据库

- 主机：localhost
- 端口：3306
- 数据库：yugioh_cards
- 用户名：root
- 密码：你的 MySQL 密码

### 2. 查看数据

运行 `npm run init-db` 后，可以在 Navicat 中看到 `cards` 表，包含所有卡片数据。

## 添加中文卡片名称

编辑 [src/utils/initDatabase.js:7-22](src/utils/initDatabase.js#L7-L22) 中的 `chineseNames` 对象：

```javascript
const chineseNames = {
  "Blue-Eyes White Dragon": "青眼白龙",
  "Dark Magician": "黑魔导",
  // 添加更多...
};
```

然后重新运行 `npm run init-db` 更新数据库。

## License

MIT
