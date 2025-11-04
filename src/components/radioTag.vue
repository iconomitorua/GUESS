<template>
  <view class="tag_wrap">
    <view class="tag_item" v-for="item in options" :key="item.value">
      <u-tag
        :text="item.label"
        :name="item.label"
        borderColor="transparent"
        type="warning"
        :color="item.value !== value ? '#444' : undefined"
        :bgColor="item.value !== value ? '#eee' : undefined"
        @click="onChange(item.value)"
      />
    </view>
  </view>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

export default Vue.extend({
  data() {
    return {};
  },
  props: {
    value: Number as PropType<string | number>,
    options: Array as PropType<{ label: string; value: string | number }[]>,
  },
  onShow() {},
  methods: {
    onChange(value: string | number) {
      this.$emit("input", value);
    },
  },
});
</script>

<style lang="scss">
.tag_wrap {
  display: flex;
  flex: 1;

  .tag_item {
    margin-right: 10rpx;
  }
}
</style>
