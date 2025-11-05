<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
</style>

<script lang="ts">
import Vue from "vue";
import store from "@/store";
import { loginEffectiveness } from "./utils/tools";
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
  onShow() { },
  onHide() {
    console.log("App Hide");
  },
  methods: {

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
