<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
</style>

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import { loginEffectiveness } from "./util/tools";
// import { updateLoginWithWechatCode, queryMpConfig } from "./api/common";
// import { uniLogin } from "./util/requests/query";
export default Vue.extend({
  mpType: "app",
  store,
  async onLaunch(options: any) {
    console.log("App Launch");
    // this.checkUpdate();
    // await this.loginEffectiveness();
    const appId = uni.getAccountInfoSync().miniProgram.appId;
    // await this.getStoreId(appId).then((result) => {
    //   console.log("%cApp.vue line:23 111", "color: #007acc;", 111);

    //   //@ts-ignore
    //   this.$isResolve();
    // });
  },
  onShow() {},
  onHide() {
    console.log("App Hide");
  },
  methods: {
    async GetupdateLoginWithWechatCode(code: any, appId: any) {
      const { loginWithWechatCode } = await updateLoginWithWechatCode({
        code,
        appId,
      });
      return {
        // refreshToken: loginWithWechatCode?.refreshToken,
        accessToken: loginWithWechatCode?.accessToken,
      };
    },

    // 判断用户登录是否过期
    async loginEffectiveness() {
      // #ifdef  MP-WEIXIN
      // 判断用户登录是否过期
      let refreshToken = wx.getStorageSync("refreshToken");
      const appId = uni.getAccountInfoSync().miniProgram.appId;
      console.log(appId, "%%%%%%%%%%%%%%%%%%%%%%%%%%%");
      if (refreshToken == "") {
        let code = "";
        const loginResult: any = await uniLogin();
        code = loginResult.code;

        let { accessToken } = await this.GetupdateLoginWithWechatCode(
          code,
          appId
        );

        if (accessToken) {
          uni.setStorageSync("refreshToken", accessToken);
          this.$store.commit("setLoginStatus", true);
        }
        // if (accessToken) {
        //   uni.setStorageSync("accessToken", accessToken);
        //   this.$store.commit("setLoginStatus", true);
        // }
      } else {
        let than = this;
        wx.checkSession({
          success() {
            //session_key 未过期，并且在本生命周期一直有效
            console.log("有效登录");
          },
          fail: async () => {
            let code = "";
            const loginResult: any = await uniLogin();
            code = loginResult.code;
            console.log("已经失效，需要重新执行登录流程");
            // console.log(code, "code^^^^^^^^^^^");
            // session_key 已经失效，需要重新执行登录流程
            let { accessToken } = await than.GetupdateLoginWithWechatCode(
              code,
              appId
            );

            if (accessToken) {
              uni.setStorageSync("refreshToken", accessToken);
              uni.setStorageSync("isLogin", false);
            }
            // if (accessToken) {
            //   uni.setStorageSync("accessToken", accessToken);
            //   uni.setStorageSync("isLogin", false);
            //   this.$store.commit("setLoginStatus", true);
            // }
          },
        });
      }
      // #endif
    },

    async getStoreId(appId: string) {
      try {
        const res = await queryMpConfig({ appId });
        const storeId = res.queryMpConfig?.storeId;
        uni.setStorageSync("storeId", storeId);
      } catch (error) {}
    },

    /** 软件更新 */
    checkUpdate() {
      const updateManager = uni.getUpdateManager();
      console.log("updateManager", updateManager);

      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调
        console.log("是否有更新", res.hasUpdate);
        console.log("process.env.NODE_ENV", process.env.NODE_ENV);
      });

      // 下载新版本
      updateManager.onUpdateReady(function () {
        uni.showModal({
          title: "更新提示",
          content: "新版本已经准备好，是否重启应用？",
          success(res: { confirm: any }) {
            if (res.confirm) {
              // 重启应用
              updateManager.applyUpdate();
            } else {
              uni.showToast({ title: "您取消了更新", icon: "none" });
            }
          },
        });
      });
      // 新版本下载失败
      updateManager.onUpdateFailed(function (res: any) {
        // 新的版本下载失败
        uni.showModal({
          title: "已经有新版本了哟~",
          content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~",
        });
      });
    },
  },
});
</script>

<style>
/*每个页面公共css */
</style>
