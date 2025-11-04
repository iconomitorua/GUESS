<template>
  <view class="box">
    <view class="box-center">
      <view class="item-box">
        <view class="item" v-for="item in [true, false, true]">
          <view class="icon">
            <view class="image">
              <img
                :src="
                  item
                    ? 'https://dqdl.oss-cn-hangzhou.aliyuncs.com/agent_client/daqudaili.png'
                    : 'https://dqdl.oss-cn-hangzhou.aliyuncs.com/agent_client/yunyin.png'
                "
              />
            </view>
          </view>
          <view class="info">
            <view class="name">大区代理商</view>
            <view class="detail">管理品牌，商品和门店运营</view>
          </view>
        </view>
      </view>

      <view class="btn-box">
        <view class="btn">确认选择</view>
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
    margin-top: 32rpx;
    padding-bottom: 120rpx;
    box-sizing: border-box;
    .item-box {
      width: 100%;
      .item {
        width: 100%;
        border-radius: 24rpx;
        background: rgba(0, 0, 0, 0);
        box-sizing: border-box;
        border: 4rpx solid #e5e7eb;

        height: 168rpx;
        padding: 32rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        margin-bottom: 32rpx;
        .icon {
          width: 96rpx;
          height: 96rpx;
          @include flex();
          z-index: 0;
          border-radius: 24rpx;
          background: rgba(205, 24, 0, 0.1);
          .image {
            @include imageFlex(30rpx, 40rpx);
          }
          margin-right: 32rpx;
        }
        .info {
          flex: 1;
          .name {
            font-size: 32rpx;
            font-weight: 500;
            line-height: 48rpx;
            color: #000000;
          }
          .detail {
            font-size: 28rpx;
            line-height: 40rpx;
            color: #6b7280;
          }
        }
      }
    }
    .btn-box {
      width: 100%;
      position: fixed;
      bottom: 0px;
      left: 0px;
      padding: 32rpx;
      box-sizing: border-box;

      background: #ffffff;
      box-sizing: border-box;
      border-width: 2rpx 0rpx 0rpx 0rpx;
      border-style: solid;
      border-color: #f3f4f6;
      .btn {
        width: 100%;
        border-radius: 8rpx;
        background: #e5e7eb;
        height: 88rpx;
        @include flex();

        font-size: 28rpx;
        line-height: 42rpx;

        color: #ffffff;
      }
    }
  }
}
</style>
