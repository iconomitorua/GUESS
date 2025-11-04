<template>
  <view class="my">
    <view class="my-box">
      <view class="title" :style="{ top: statusBarHeight + 'px' }">我的</view>

      <view class="box-nav">
        <view class="box">
          <view class="nav-avatar">
            <view class="avatar-box">
              <view class="avatar">
                <u-icon name="account-fill" size="50" color="#beb6cc"></u-icon>
              </view>
              <view class="avatar-title">
                <view class="wrapper" v-if="btnShow">
                  <button
                    id="agree-btn1"
                    open-type="getPhoneNumber|agreePrivacyAuthorization"
                    @getphonenumber="onGetUserInfos"
                    @agreeprivacyauthorization="agreeprivacyauthorization"
                    @click="onGetUserInfosShow"
                    :plain="true"
                  >
                    点此登陆
                  </button>
                </view>
                <view class="name" v-if="!btnShow">
                  <!-- <view class="use-name">小鸭子</view> -->
                  <view class="use-phone">{{ userPhone }}</view>
                </view>
              </view>
            </view>

            <view class="nav-icon">
              <image
                src="https://image.ht-mall.hetuntech.cn/wxapp-image/right.png"
                mode="aspectFit"
              />
            </view>
          </view>
        </view>
        <view class="order-status">
          <viwe class="order-box">
            <view class="order-title">我的订单</view>
            <view class="order-list">
              <view
                class="order-item"
                v-for="item in data"
                :key="item.id"
                @click="goUrl(item.id)"
              >
                <view class="order-img">
                  <image :src="item.imgUrl" mode="aspectFit"></image>
                </view>
                <view class="order-text">{{ item.title }}</view>
              </view>
            </view>
          </viwe>
        </view>
        <view class="list">
          <view class="list-box">
            <view class="list-title">常用</view>
            <!-- <view class="list-item" @click="gotoRecharge">
              <view class="list-icon">
                <view class="icon">
                  <image
                    src="https://image.ht-mall.hetuntech.cn/wxapp-image/address.png"
                    mode="aspectFit"
                  />
                </view>

                <view class="list-name">地址管理</view>
              </view>
              <view class="list-right">
                <image
                  src="https://image.ht-mall.hetuntech.cn/wxapp-image/right.png"
                  mode="aspectFit"
                />
              </view>
            </view> -->

            <view class="list-item" @click="goAfterBack">
              <view class="list-icon">
                <view class="icon">
                  <image
                    src="https://image.ht-mall.hetuntech.cn/wxapp-image/feedback.png"
                    mode="aspectFit"
                  />
                </view>

                <view class="list-name">售后反馈</view>
              </view>
              <view class="list-right">
                <image
                  src="https://image.ht-mall.hetuntech.cn/wxapp-image/right.png"
                  mode="aspectFit"
                />
              </view>
            </view>
            <view class="list-item" @click="goCart">
              <view class="list-icon">
                <view class="icon">
                  <image
                    src="https://image.ht-mall.hetuntech.cn/wxapp-image/gouwuche.png"
                    mode="aspectFit"
                  />
                </view>

                <view class="list-name">购物车</view>
              </view>
              <view class="list-right">
                <image
                  src="https://image.ht-mall.hetuntech.cn/wxapp-image/right.png"
                  mode="aspectFit"
                />
              </view>
            </view>
            <view class="list-item">
              <view class="list-icon">
                <view class="icon">
                  <image
                    src="https://image.ht-mall.hetuntech.cn/wxapp-image/newkefu.png"
                    mode="aspectFit"
                  />
                </view>

                <view class="list-name">
                  <button
                    class="item-btn"
                    open-type="contact"
                    hover-class="none"
                    plain="none"
                  >
                    联系客服
                  </button></view
                >
              </view>
              <view class="list-right">
                <image
                  src="https://image.ht-mall.hetuntech.cn/wxapp-image/right.png"
                  mode="aspectFit"
                />
              </view>
            </view>

            <view class="list-item" @click="loginOut">
              <view class="list-icon">
                <view class="icon">
                  <image
                    src="https://image.ht-mall.hetuntech.cn/wxapp-image/quit.png"
                    mode="aspectFit"
                  />
                </view>

                <view class="list-name">退出登录</view>
              </view>
              <view class="list-right">
                <image
                  src="https://image.ht-mall.hetuntech.cn/wxapp-image/right.png"
                  mode="aspectFit"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { pdateLoginWithWechatPhoneCode } from "@/api/common";
import { userInfo } from "./server";
export default Vue.extend({
  data() {
    return {
      // 是否加载中
      loading: true,
      hasLogins: "" as any,
      isLogin: Boolean,
      icon: "" as any,
      btnShow: true,
      statusBarHeight: 25,
      showIsLoading: false,
      data: [
        {
          imgUrl: "https://image.ht-mall.hetuntech.cn/wxapp-image/due.png",
          title: "待支付",
          id: "all",
        },
        {
          imgUrl: "https://image.ht-mall.hetuntech.cn/wxapp-image/wait.png",
          title: "待发货",
          id: "WAITSHIPPED",
        },
        {
          imgUrl: "https://image.ht-mall.hetuntech.cn/wxapp-image/picked.png",
          title: "待收货",
          id: "WAITRECEIVED",
        },
        {
          imgUrl: "https://image.ht-mall.hetuntech.cn/wxapp-image/order.png",
          title: "已完成",
          id: "COMPLETE",
        },
        {
          imgUrl: "https://image.ht-mall.hetuntech.cn/wxapp-image/after.png",
          title: "退款",
          id: "all",
        },
      ],
      userPhone: "",
    };
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync();
    let status = systemInfo?.statusBarHeight;
    if (status) {
      this.statusBarHeight = status + 15;
      console.log("status", status);
    }
  },
  async onShow() {
    const isLogin = uni.getStorageSync("isLogin");
    this.showIsLoading = isLogin;
    if (isLogin) {
      // 登陆
      this.btnShow = false;
      this.getUserInfo();
    } else {
      // 为登陆
      this.btnShow = true;
    }
  },
  methods: {
    agreeprivacyauthorization(e: any) {
      console.log("出发了");
      // this.btnShow = !this.btnShow;
    },

    async onGetUserInfos(e: any) {
      console.log("eee", e);
      if (e.detail.errMsg == "getPhoneNumber:fail user deny") {
        uni.showToast({
          title: "已取消授权",
          icon: "none",
        });
        return;
      }
      console.log("^^^^^^^^^^^^");
      const refreshToken = uni.getStorageSync("refreshToken");
      if (refreshToken == "") {
        console.log("$$$$$$$$$$$$$$$$$$$");
        wx.showToast({
          title: "登录失败，请重新进入小程序登录",
          icon: "none",
        });
        return;
      }
      const appId = uni.getAccountInfoSync().miniProgram.appId;
      let code = e.detail.code;
      // 获取用户信息
      console.log("$$$$$$$$$$$$$$$$$$$$$$", e);
      console.log("微信登录");
      let accessToken: any;
      try {
        console.log("iv", appId, code);
        accessToken = await pdateLoginWithWechatPhoneCode({
          appId,
          code,
        });
      } catch (error) {
        uni.showToast({
          title: error,
          icon: "none",
        });
      }
      if (accessToken.loginWithWechatPhoneCode) {
        this.btnShow = false;
        wx.setStorageSync(
          "accessToken",
          accessToken.loginWithWechatPhoneCode?.accessToken
        );
        wx.setStorageSync("isLogin", true);
        this.$store.commit("setLoginStatus", true);
        this.getUserInfo();
        // wx.reLaunch({
        //   url: "/pages/index/index",
        // });
      }
    },

    goUrl(id: string) {
      // let isLogin = uni.getStorageSync("isLogin");
      // if (!isLogin) {
      //   uni.showToast({
      //     title: "请先登录",
      //     icon: "none",
      //   });
      //   return;
      // }
      uni.navigateTo({
        url: `/pages-mall/orderList/index?id=${id}`,
      });
    },

    loginOut() {
      const isLogin = uni.getStorageSync("isLogin");
      if (isLogin) {
        uni.showModal({
          title: "提示",
          content: "确认退出账号？",
          success: (res) => {
            if (res.confirm) {
              uni.removeStorageSync("accessToken");
              // uni.removeStorageSync("tenantId");
              wx.setStorageSync("isLogin", false);
              this.hasLogins = false;
              this.$store.commit("setLoginStatus", false);
              this.btnShow = true;
            } else if (res.cancel) {
            }
          },
        });
      } else {
        uni.showToast({
          title: "请先登陆",
          icon: "none",
        });
      }
    },
    onGetUserInfosShow() {},
    async getUserInfo() {
      try {
        const userInfoDetail = await userInfo({});
        this.userPhone = userInfoDetail.userInfo?.phone as string;
      } catch (error) {}
    },
    goCart() {
      let isLogin = uni.getStorageSync("isLogin");
      if (!isLogin) {
        uni.showToast({
          title: "请先登录",
          icon: "none",
        });
        return;
      }
      uni.navigateTo({
        url: "/pages-mall/shopingCart/index",
      });
    },
    goAfterBack() {
      let isLogin = uni.getStorageSync("isLogin");
      if (!isLogin) {
        uni.showToast({
          title: "请先登录",
          icon: "none",
        });
        return;
      }
      uni.navigateTo({
        url: "/pages-mall/afterBack/index",
      });
    },
  },
});
</script>
<style lang="scss">
page {
  background: #f7f7f6;
}
</style>
<style lang="scss" scoped>
.my {
  width: 100%;
  .my-box {
    width: 100%;
    position: relative;
    width: 750rpx;
    height: 344rpx;
    background: linear-gradient(360deg, #055d34 0%, #055d34 0%);
    opacity: 1;
    border-bottom-left-radius: 60rpx;
    border-bottom-right-radius: 60rpx;
    .title {
      width: 100%;
      font-size: 32rpx;
      font-weight: 300;
      color: #ffffff;
      line-height: 49rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 65rpx;
    }
    .box-nav {
      width: 100%;
      padding: 195rpx 17rpx 50rpx 17rpx;
      box-sizing: border-box;
      .box {
        width: 100%;
        height: 222rpx;
        background: #ffffff;
        border-radius: 30rpx 30rpx 30rpx 30rpx;
        display: flex;
        align-items: center;
        opacity: 1;
        padding: 0 29rpx;
        box-sizing: border-box;
        .nav-avatar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .avatar-box {
            display: flex;
            align-items: center;
            .avatar {
              width: 122rpx;
              height: 122rpx;
              background: #ffffff;
              border-radius: 50%;
              margin-right: 18rpx;
              overflow: hidden;
              display: flex;
              justify-content: center;
              align-items: center;

              image {
                width: 100%;
                height: 100%;
              }
            }
            .avatar-title {
              // font-size: 38rpx;
              // font-weight: 400;
              // color: #000000;
              // line-height: 39rpx;
              // flex: 1;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .wrapper {
                // margin-bottom: 30rpx;
                button {
                  // background: #a6e4ed;
                  border: none;
                }
              }
            }
          }

          .nav-icon {
            width: 17rpx;
            height: 27rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            image {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .order-status {
        width: 100%;
        background: #ffffff;
        border-radius: 30rpx 30rpx 30rpx 30rpx;
        padding: 34rpx 28rpx;
        box-sizing: border-box;
        margin-top: 28rpx;
        .order-box {
          width: 100%;

          opacity: 1;
          // padding: 34rpx 28rpx;
          // box-sizing: border-box;
          .order-title {
            font-size: 30rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #242424;
            line-height: 34rpx;
            margin-bottom: 50rpx;
          }
          .order-list {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .order-item {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .order-img {
                width: 56rpx;
                height: 56rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                image {
                  width: 100%;
                  height: 100%;
                }
              }
              .order-text {
                font-size: 24rpx;
                font-family: PingFangSC, PingFang SC;
                font-weight: 400;
                color: #242424;
                line-height: 34rpx;
                margin-top: 10rpx;
              }
            }
          }
        }
      }
      .list {
        width: 100%;
        // padding: 0 28rpx;
        // box-sizing: border-box;
        margin-top: 46rpx;
        .list-box {
          width: 100%;
          display: flex;
          // align-items: center;
          flex-direction: column;
          background: #ffffff;
          box-shadow: 0rpx 0rpx 20rpx 0rpx rgba(19, 69, 67, 0.1);
          border-radius: 30rpx;
          padding: 48rpx 40rpx 0 40rpx;
          box-sizing: border-box;
          .list-title {
            font-size: 30rpx;
            font-family: PingFangSC, PingFang SC;
            font-weight: 400;
            color: #121212;
            line-height: 34rpx;
            margin-bottom: 30rpx;
          }
          .list-item {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 60rpx;
            .item {
              width: 100%;
              height: 100%;
              // opacity: 0;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0;
              background: none;
              border: 0rpx solid #fff;
            }
            .list-icon {
              display: flex;
              align-items: center;
              .icon {
                width: 52rpx;
                height: 52rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 30rpx;
                image {
                  width: 100%;
                  height: 100%;
                }
              }
              .list-name {
                font-size: 30rpx;
                font-weight: 400;
                color: #242424;
                line-height: 34rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                .item-btn {
                  // margin-top: 20rpx;
                  // padding: 15rpx 30rpx;
                  // height: 50rpx;
                  padding: 0;
                  // border-radius: 30rpx;
                  border: 1px solid #ffffff;
                  font-size: 30rpx;
                  color: #333;
                  display: flex;
                  align-items: center;
                  // margin-right: 20rpx;
                  button::after {
                    border: none;
                  }
                }
              }
            }
            .list-right {
              width: 12rpx;
              height: 22rpx;
              display: flex;
              justify-content: center;
              align-items: center;
              image {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
