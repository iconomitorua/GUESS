<template>
  <view class="box">
    <view class="box-center">
      <view class="nav">
        <NavTab></NavTab>
      </view>
      <view class="list">
        <!-- <RuleList></RuleList> -->
        <StoreList></StoreList>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import NavTab from "./components/nav-tab.vue";
import RuleList from "./components/rule-list.vue";
import StoreList from "./components/store-list.vue";
export default Vue.extend({
  components: {
    NavTab,
    RuleList,
    StoreList,
  },
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
    padding: 32rpx;
    box-sizing: border-box;

    .nav {
      width: 100%;
    }
    .list {
      width: 100%;
      margin-top: 32rpx;
    }
  }
}
</style>
