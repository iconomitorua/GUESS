<template>
  <view class="list">
    <view class="list-box">
      <view class="box">
        <view class="item-list">
          <view
            class="item"
            v-for="item in listArr"
            :key="item.id"
            @click="goItemDetail(item.id)"
          >
            <view class="item-image">
              <image :src="item.image" mode="aspectFit"></image>
            </view>
            <view class="title">
              {{ item.name }}
            </view>
            <view class="price">
              <view class="new-price"
                >¥ {{ fnMaxPrice(item.itemSkuList) }}</view
              >
              <!-- <view class="old-price"
                >¥ {{ fnMinPrice(item.itemSkuList) }}</view
              > -->
            </view>
          </view>
        </view>

        <u-empty
          text="暂无数据"
          marginTop="20"
          mode="list"
          v-if="!listArr.length"
        ></u-empty>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    listArr: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  methods: {
    fnMaxPrice(list: any[]) {
      const maxPrice = Math.max(...list.map((item) => item.price));
      return (maxPrice / 100).toFixed(2);
    },
    fnMinPrice(list: any[]) {
      const minPrice = Math.max(...list.map((item) => item.price));
      return (minPrice / 100).toFixed(2);
    },
    goItemDetail(id: string) {
      uni.navigateTo({
        url: `/pages-mall/itemDetail/index?id=${id}`,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
  .list-box {
    width: 100%;
    .box {
      width: 100%;
      padding: 20rpx 20rpx;
      box-sizing: border-box;
      .item-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .item {
          width: 345rpx;
          margin-bottom: 30rpx;
          padding: 30rpx 20rpx;
          border-radius: 15rpx;
          box-sizing: border-box;
          background: #fff;
          margin-right: 10rpx;

          box-shadow: 0rpx 0rpx 25rpx 0rpx #f2f2f2;
          .item-image {
            width: 100%;
            height: 320rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            // background: red;
            border-radius: 15rpx;
            margin-bottom: 10rpx;
            image {
              width: 100%;
              height: 100%;
            }
          }
          .title {
            font-size: 28rpx;
            font-weight: 400;
            color: #000000;
            line-height: 35rpx;
            overflow: hidden; //溢出内容隐藏
            text-overflow: ellipsis; //文本溢出部分用省略号表示
            display: -webkit-box; //特别显示模式
            -webkit-line-clamp: 2; //行数
            line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          .price {
            width: 100%;
            display: flex;
            align-items: center;
            margin-top: 20px;
            .new-price {
              font-size: 38rpx;
              font-weight: 300;
              color: #f62b28;
              line-height: 0rpx;
              margin-right: 20rpx;
              font-weight: bold;
            }
            .old-price {
              font-size: 26rpx;
              font-weight: 300;
              color: #b4b4b4;
              line-height: 0rpx;
              text-decoration: line-through;
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>
