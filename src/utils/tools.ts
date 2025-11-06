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
  let errorMessage = "请求失败";

  if (typeof error === "string") {
    errorMessage = error;
  } else if (error?.message) {
    errorMessage = error.message;
  } else if (error?.errMsg) {
    errorMessage = error.errMsg;
  } else if (error) {
    errorMessage = String(error);
  }

  uni.showToast({ title: errorMessage, icon: "none" });
};



function debounce(func: any, Function: FunctionConstructor, wait: any, number: any) {
  throw new Error("Function not implemented.");
}

