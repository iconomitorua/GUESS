<template>
  <view class="box">
    <view class="box-center">
      <view class="icon">
        <img src="https://file.douqiudalu.com/agent_client/logo-icon.png" />
      </view>
      <view class="title">斗球大陆管理系统</view>

      <view class="user-box">
        <view class="user-name">
          <u--input
            placeholder="请输入账号"
            prefixIcon="account-fill"
            prefixIconStyle="font-size: 22px;color: #909399"
          >
          </u--input>
        </view>
        <view class="user-password">
          <u--input
            placeholder="请输入密码"
            prefixIcon="lock-fill"
            type="password"
            prefixIconStyle="font-size: 22px;color: #909399"
          ></u--input>
        </view>
      </view>

      <view class="btn" @click="login"> 登录 </view>
      <view class="text">忘记密码?</view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { handleError } from "@/util/tools";
export default Vue.extend({
  data() {
    return {
      phone: "",
      password: "",
    };
  },
  async onLoad(options: any) {},
  methods: {
    login() {
      try {
        if (!(this.phone && this.password)) {
          uni.showToast({
            title: "账号或密码格式错误",
            icon: "none",
          });
          return;
        }
        const input = {
          phone: this.phone,
          password: this.password,
        };

        // uni.setStorageSync("refreshToken", accessToken);
      } catch (error) {
        handleError(error);
      }
    },
  },
});
</script>

<style lang="scss">
page {
  background-color: #ffffff;
}
</style>
<style lang="scss" scoped>
.box {
  width: 100%;
  .box-center {
    width: 100%;
    padding: 0 32rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .icon {
      @include imageFlex(240rpx, 240rpx);
      margin-top: 160rpx;
    }
    .title {
      font-size: 48rpx;
      font-weight: bold;
      line-height: 48rpx;
      color: #cd1800;
      margin-top: 30rpx;
    }
    .user-box {
      width: 622rpx;
      margin-top: 128rpx;
      .user-password {
        margin-top: 48rpx;
      }
    }
    .btn {
      width: 622rpx;
      height: 96rpx;
      border-radius: 8rpx;
      background: #cd1800;
      @include flex();
      font-size: 28rpx;
      font-weight: 500;
      line-height: 42rpx;
      text-align: center;
      color: #ffffff;
      margin-top: 40rpx;
    }
    .text {
      font-size: 28rpx;
      line-height: 42rpx;
      text-align: center;
      color: #6b7280;
      margin-top: 32rpx;
    }
  }
}
</style>
