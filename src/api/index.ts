import { ruoyiOrderCenterPost } from "@/options/service/ruoyiOrderCenter";

export default {
    /**
     * 从 YGOPRODeck API 获取游戏王卡片信息
     * API 文档: https://ygoprodeck.com/api-guide/
     * 限流: 20 请求/秒
     *
     * 重要提示：
     * - 默认返回英文数据（不传 language 参数）
     * - 只支持以下语言：'fr'(法语), 'de'(德语), 'it'(意大利语), 'pt'(葡萄牙语)
     * - 不支持中文！搜索必须使用英文卡片名称
     *
     * @param params 查询参数
     * @param params.name - 卡片名称（模糊搜索，必须使用英文）
     * @param params.id - 卡片 ID（精确匹配）
     * @param params.fname - 卡片名称（精确匹配，必须使用英文）
     * @param params.type - 卡片类型 (如: "Effect Monster", "Spell Card")
     * @param params.atk - 攻击力
     * @param params.def - 防御力
     * @param params.level - 等级
     * @param params.race - 种族 (如: "Dragon", "Warrior")
     * @param params.attribute - 属性 (如: "DARK", "LIGHT")
     * @param params.archetype - 系列
     * @param params.language - 语言（可选：'fr', 'de', 'it', 'pt'，不传则为英文）
     */
    getYugiohCards: async (params: {
        name?: string;
        id?: number;
        fname?: string;
        type?: string;
        atk?: number;
        def?: number;
        level?: number;
        race?: string;
        attribute?: string;
        archetype?: string;
        language?: string;
    } = {}) => {
        return new Promise((resolve, reject) => {
            // 手动构建查询字符串（小程序环境不支持 URLSearchParams）
            const queryParts: string[] = [];
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
                }
            });

            const queryString = queryParts.length > 0 ? '?' + queryParts.join('&') : '';
            const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php${queryString}`;

            console.log('请求 YGOPRODeck API:', url);

            uni.request({
                url,
                method: 'GET',
                success: (res: any) => {
                    console.log('YGOPRODeck API 响应:', res);
                    if (res.statusCode === 200) {
                        resolve(res.data.data);
                    } else {
                        reject(new Error(`请求失败: ${res.statusCode}`));
                    }
                },
                fail: (err: any) => {
                    console.error('YGOPRODeck API 失败:', err);
                    reject(err);
                }
            });
        });
    },

    /**
     * 获取所有游戏王卡片（无参数时返回所有卡片）
     */
    getAllYugiohCards: async () => {
        return new Promise((resolve, reject) => {
            uni.request({
                url: 'https://db.ygoprodeck.com/api/v7/cardinfo.php',
                method: 'GET',
                success: (res: any) => {
                    if (res.statusCode === 200) {
                        resolve(res.data.data);
                    } else {
                        reject(new Error(`请求失败: ${res.statusCode}`));
                    }
                },
                fail: (err: any) => {
                    reject(err);
                }
            });
        });
    },

    /**
     * 从自定义后端获取卡片（原有接口）
     */
    getCard: async (data: any) => {
        try {
            const res = await ruoyiOrderCenterPost("/cards", data);
            return res;
        } catch (error) {
            throw error;
        }
    },
}