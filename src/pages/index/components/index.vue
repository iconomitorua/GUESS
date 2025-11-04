<template>
  <view class="center-item">
    <view class="item-box">
      <view
        class="item"
        v-for="item in categoryList"
        :key="item.id"
        @click="goVipCode(item.id)"
      >
        <view class="image">
          <image mode="aspectFit" :src="item.indexImage"></image>
        </view>
        <view class="title">{{ item.name }}</view>
      </view>
    </view>

    <!-- <view class="empty">
      <u-empty v-if="!itemList.length" mode="list" marginTop="50"></u-empty>
    </view> -->
  </view>
</template>

<script lang="ts">
import dayjs from "dayjs";
import Vue from "vue";
export default Vue.extend({
  props: {
    categoryList: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  methods: {
    goVipCode(id: string) {
      var params = id;
      uni.setStorageSync("params", params);
      uni.switchTab({
        url: `/pages/vipCode/index`,
      });
    },
  },
});
</script>

<style lang="scss">
.center-item {
  width: 100%;
  .item-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    background: #fff;
  }
  .item {
    margin: 18rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 20rpx;
    .image {
      width: 112rpx;
      height: 112rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .title {
      font-size: 26rpx;
      font-weight: 400;
      color: #090909;
      line-height: 56rpx;
      text-align: center;
    }
  }
}
</style>
