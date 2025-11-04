// import { loginWithWechatCode } from "./service";

function uniLogin() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: "weixin",
      success: (res) => {
        resolve(res);
      },
      fail: (e) => {
        reject(e);
      },
    });
  });
}

// async function login(appId: string) {
//   const loginResult: any = await uniLogin();
//   const code = loginResult.code;
//   const {
//     loginWithWechatCode: { refreshToken },
//   } = await loginWithWechatCode({ code, appId });

//   uni.setStorageSync("refreshtoken", refreshToken);
// }

// 判断用户登录是否过期
export async function loginEffectiveness() {
  const refreshtoken = wx.getStorageSync("refreshtoken");

  const appId = uni.getAccountInfoSync().miniProgram.appId;
  if (!refreshtoken) {
    // await login(appId);
    return;
  }

  return new Promise<void>((resolve, reject) => {
    uni.checkSession({
      success: () => {
        //session_key 未过期，并且在本生命周期一直有效
        console.log("有效登录");
        resolve();
      },
      fail: async () => {
        // await login(appId);
        resolve();
      },
    });
  });
}

export const handleError = (error: any) => {
  uni.showToast({ title: error, icon: "none" });
};
