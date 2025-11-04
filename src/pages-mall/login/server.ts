import { ruoyiSystemPost } from "@/options/service/ruoyiSystem";
import { UserInput } from "./data";
import { clientPost } from "@/options/apollo";

export default {
  // 登录没有模块
  async authLogin(data: { password: string; username: string }) {
    try {
      const res = await clientPost("/auth/login", data);
      return res;
    } catch (error) {
      throw error;
    }
  },
  async getAdminByToken(data: any) {
    try {
      const res = await ruoyiSystemPost("/admin/getAdminByToken", data);
      return res;
    } catch (error) {
      throw error;
    }
  },
};
