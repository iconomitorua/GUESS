<template>
  <view class="nav-top">
    <view class="top-box">
      <view class="box">
        <view class="box-nav" :style="{ top: rectHeight }">
          <view class="search-icon">
            <image
              mode="aspectFit"
              src="https://image.ht-mall.hetuntech.cn/wxapp-image/search_icon.png"
            ></image>
          </view>
          <view class="input" @click="goSearch">
            <input type="text" :disabled="true" placeholder="请输入搜索内容" />
          </view>
        </view>
        <view class="box-branner" v-if="imageList.length">
          <view class="branner">
            <u-swiper height="100%" :list="imageList"></u-swiper>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  created() {
    const rect = uni.getMenuButtonBoundingClientRect();
    console.log(rect);
    this.rectHeight = rect.top - 2 + "px";
    console.log("%cnavTop.vue line:15 123321", "color: #007acc;", 123321);
  },
  props: {
    imageList: {
      type: Array,
    },
  },
  data() {
    return {
      rectHeight: "0px",
    };
  },
  methods: {
    goSearch() {
      uni.navigateTo({
        url: "/pages-mall/searchItem/index",
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.nav-top {
  width: 100%;
  .top-box {
    width: 100%;
    .box {
      width: 100%;
      // height: 520rpx;
      //   background: linear-gradient(359.8deg, #fbfbfb 0%, #055d34 66%);
      background: linear-gradient(0deg, #fff 0%, #52b386 50%, #055d34 100%);
      opacity: 1;
      padding: 167rpx 0 0 0;
      box-sizing: border-box;
      .box-nav {
        width: 500rpx;
        height: 72rpx;
        background: #ffffff;
        border-radius: 20rpx 20rpx 20rpx 20rpx;
        opacity: 1;
        display: flex;
        align-items: center;
        position: fixed;
        // top: bind(rectHeight);
        left: 7px;
        padding-left: 28rpx;
        box-sizing: border-box;
        .search-icon {
          width: 35rpx;
          height: 37rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .input {
          margin-left: 20rpx;
        }
      }
      .box-branner {
        width: 100%;
        padding: 17rpx;
        box-sizing: border-box;
        .branner {
          width: 100%;
          height: 290rpx;

          border-radius: 15rpx;
        }
      }
    }
  }
}
</style>
