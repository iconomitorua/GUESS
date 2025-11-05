import { ruoyiOrderCenterPost } from "@/options/service/ruoyiOrderCenter";

export default {
    getCards: async (name: any) => {

        return new Promise((resolve, reject) => {
            uni.request({
                url: `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${name}`,
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
    getCard: async (data: any) => {
        try {
            const res = await ruoyiOrderCenterPost("/card/search", data);
            return res;
        } catch (error) {
            throw error;
        }
    },
}