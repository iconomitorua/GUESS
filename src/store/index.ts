//引入vue和vuex
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const store = new Vuex.Store({
  //全局变量定义
  state: {
    forcedLogin: false, //是否需要强制登录
    hasLogin: false,
  },
  getters: {},
  mutations: {
    setLoginStatus(state, status) {
      state.hasLogin = status;
    },
  },
});
export default store;
