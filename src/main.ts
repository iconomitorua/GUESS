import Vue from "vue";
import App from "./App.vue";
import uView from "uview-ui";

Vue.config.productionTip = false;
Vue.use(uView);
// 强制先执行APP.vue onLaunch 方法
Vue.prototype.$onLaunched = new Promise((resolve) => {
  Vue.prototype.$isResolve = resolve;
});
Vue.prototype.isLogin = "123321";
console.log("%cmain.ts line:12 Vue", "color: #007acc;", Vue.prototype);
function isPromise(obj: any) {
  return (
    !!obj &&
    (typeof obj === "object" || typeof obj === "function") &&
    typeof obj.then === "function"
  );
}

uni.addInterceptor({
  returnValue(res: any) {
    if (!isPromise(res)) {
      return res;
    }
    return new Promise((resolve, reject) => {
      res.then((res: [any, any]) => {
        if (res[0]) {
          reject(res[0]);
        } else {
          resolve(res[1]);
        }
      });
    });
  },
});

const app = new (
  typeof App === "function"
    ? App
    : Vue.extend(Object.assign({ mpType: "app" }, App))
)();
app.$mount();
