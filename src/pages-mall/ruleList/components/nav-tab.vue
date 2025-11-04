<template>
  <view class="box">
    <view class="box-center">
      <view class="tab-nav">
        <view class="select">选择身份</view>
        <view class="store">选择店铺</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {};
  },
  async onLoad(options: any) {},
  methods: {},
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

    .tab-nav {
      width: 100%;
      border-radius: 24rpx;
      background: #f3f4f6;
      padding: 8rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .select {
        width: 50%;
        height: 72rpx;
        padding: 16rpx 0rpx;
        box-sizing: border-box;
        z-index: 0;
        border-radius: 16rpx;
        background: #ffffff;
        @include flex();

        font-size: 28rpx;
        line-height: 40rpx;
        color: #cd1800;
      }

      .rule,
      .store {
        width: 50%;
        height: 72rpx;
        padding: 16rpx 0rpx;
        box-sizing: border-box;
        @include flex();
        font-size: 28rpx;
        line-height: 40rpx;
        color: #6b7280;
      }
    }
  }
}
</style>
