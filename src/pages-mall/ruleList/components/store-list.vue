<template>
  <view class="box">
    <view class="box-center">
      <view class="search-box">
        <view class="search-icon">
          <img
            src="https://dqdl.oss-cn-hangzhou.aliyuncs.com/agent_client/search.png"
          />
        </view>
        <view class="search-input">
          <input type="text" placeholder="搜索店铺名称" />
        </view>
      </view>

      <view class="store-box">
        <view class="item" v-for="item in 5">
          <view class="item-info">
            <view class="info-box">
              <view class="store-icon">
                <view class="image">
                  <img
                    src="https://dqdl.oss-cn-hangzhou.aliyuncs.com/agent_client/store.png"
                  />
                </view>
              </view>
              <view class="store-info">
                <view class="name">星巴克咖啡 陆家嘴</view>
                <view class="address">上海市浦东新区陆家嘴1000号</view>
              </view>
            </view>

            <view class="status"> 营业中 </view>
          </view>

          <view class="text-box">
            <view class="time">
              <view class="icon">
                <img
                  src="https://dqdl.oss-cn-hangzhou.aliyuncs.com/agent_client/time.png"
                />
              </view>
              <view class="text">营业时间：10:00-21:00</view>
            </view>
            <view class="phone">
              <view class="icon">
                <img
                  src="https://dqdl.oss-cn-hangzhou.aliyuncs.com/agent_client/phone.png"
                />
              </view>
              <view class="text">021-321312 3333</view>
            </view>
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
    padding-bottom: 120rpx;
    box-sizing: border-box;
    .search-box {
      width: 100%;
      height: 80rpx;

      border-radius: 24rpx;
      background: #f9fafb;
      padding: 8rpx 26rpx;
      display: flex;
      align-items: center;
      .search-icon {
        @include imageFlex(28rpx, 28rpx);
        margin-right: 28rpx;
      }
      .search-input {
        flex: 1;
        input {
          border: none;
        }
      }
    }

    .store-box {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 20rpx;

      .item {
        width: 100%;
        height: 208rpx;

        padding: 32rpx;
        box-sizing: border-box;

        border-radius: 24rpx;
        background: #f9fafb;
        margin-bottom: 20rpx;
        .item-info {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .info-box {
            display: flex;
            align-items: center;
            .store-icon {
              /* 自动布局子元素 */
              width: 96rpx;
              height: 96rpx;
              @include flex();

              border-radius: 24rpx;
              background: #ffffff;
              box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0, 0, 0, 0.05);
              .image {
                @include imageFlex(44rpx, 40rpx);
              }
              margin-right: 24rpx;
            }
            .store-info {
              .name {
                font-size: 32rpx;
                font-weight: 500;
                line-height: 48rpx;
                color: #000000;
              }
              .address {
                font-size: 24rpx;
                line-height: 32rpx;
                color: #6b7280;
                margin-top: 8rpx;
              }
            }
          }

          .status {
            padding: 10rpx 8rpx;
            box-sizing: border-box;

            font-size: 24rpx;
            line-height: 32rpx;
            color: #16a34a;
          }
        }

        .text-box {
          width: 100%;
          display: flex;
          margin-top: 20rpx;
          .time,
          .phone {
            display: flex;
            align-items: center;
            .icon {
              @include imageFlex(24rpx, 24rpx);
              margin-right: 8rpx;
            }
            .text {
              font-size: 24rpx;
              line-height: 32rpx;
              color: #6b7280;
            }
          }
          .phone {
            margin-left: 32rpx;
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
