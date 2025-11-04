<template>
  <view class="tag_wrap">
    <view class="tag_item" v-for="item in options" :key="item.value">
      <u-tag
        :text="item.label"
        :name="item.label"
        borderColor="transparent"
        type="warning"
        :color="!valueMap.has(item.value) ? '#444' : undefined"
        :bgColor="!valueMap.has(item.value) ? '#eee' : undefined"
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
    value: Array as PropType<(string | number)[]>,
    options: Array as PropType<{ label: string; value: string | number }[]>,
  },
  onShow() {},
  computed: {
    valueMap() {
      const map = new Map();
      this.value.forEach((item) => {
        map.set(item, item);
      });
      return map;
    },
  },
  methods: {
    onChange(value: string | number) {
      const hasvalue = this.valueMap.has(value);
      let newArry = this.value;
      if (hasvalue) {
        newArry = this.value.filter((i) => i !== value);
      } else {
        newArry.push(value);
      }
      this.$emit("input", newArry);
    },
  },
});
</script>

<style lang="scss">
.tag_wrap {
  display: flex;
  .tag_item {
    margin-right: 10rpx;
  }
}
</style>
