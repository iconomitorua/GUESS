import { ruoyiCardCenterGet, ruoyiCardCenterPost } from "@/options/service/ruoyiCardCenter";

export default {
    getCard: async (data: any) => {
        try {
            const res = await ruoyiCardCenterPost("cardCN/search", data);
            return res;
        } catch (error) {
            throw error;
        }
    },
    getCardById: async (id: number) => {
        try {
            const res = await ruoyiCardCenterGet("cardCN/" + id);
            return res;
        } catch (error) {
            throw error;
        }
    },
    //获取统计数据
    getStatistics: async () => {
        try {
            const res = await ruoyiCardCenterGet("cardsCN/stats");
            return res;
        } catch (error) {
            throw error;
        }
    }
}