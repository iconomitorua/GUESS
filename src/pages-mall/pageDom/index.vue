<template>
  <view class="box">
    <view class="box-center"> 我是模版页面 </view>
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
  background-color: #f7f7f7;
}
</style>
<style lang="scss" scoped>
.box {
  width: 100%;
  .box-center {
  }
}
</style>
