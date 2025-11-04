<template>
  <view class="up-image">
    <u-popup :show="show" mode="center" :round="10" width="400" @close="close">
      <view class="up-box">
        <image mode="aspectFit" :src="url"></image>
      </view>
    </u-popup>
  </view>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

export default Vue.extend({
  data() {
    return {};
  },
  props: {
    show: Boolean,
    url: String,
  },
  onShow() {},
  methods: {
    close() {
      this.$emit("close");
    },
  },
});
</script>

<style lang="scss">
.up-image {
  width: 100%;
  .up-box {
    padding: 20rpx;
    box-sizing: border-box;
  }
}
</style>
