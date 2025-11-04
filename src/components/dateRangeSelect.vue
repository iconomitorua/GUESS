<template>
  <view class="tag_wrap">
    <u-tag
      :text="fromStr ? fromStr : '开始时间'"
      type="warning"
      borderColor="transparent"
      color="#444"
      bgColor="#eee"
      @click="show = true"
    />
    <view class="split_line">-</view>
    <u-tag
      :text="toStr ? toStr : '结束时间'"
      type="warning"
      borderColor="transparent"
      color="#444"
      bgColor="#eee"
      @click="show1 = true"
    />

    <u-datetime-picker
      :show="show"
      v-model="from"
      mode="datetime"
      @confirm="confirmFrom"
      @cancel="show = false"
      :formatter="formatter"
    />
    <u-datetime-picker
      :show="show1"
      v-model="to"
      mode="datetime"
      @confirm="confirmTo"
      @cancel="show1 = false"
      :formatter="formatter"
    />
  </view>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import dayjs from "dayjs";

export default Vue.extend({
  data() {
    return {
      show: false,
      show1: false,
      from: dayjs().format(),
      fromStr: "",
      to: dayjs().format(),
      toStr: "",
    };
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
    onConfirm({ value }: { value: number }, type: "fromStr" | "toStr") {
      this[type] = dayjs(value).format("YYYY-MM-DD HH:ss");
      this.show = false;
      this.show1 = false;
    },

    confirmFrom({ value }: { value: number }) {
      this.onConfirm({ value }, "fromStr");
    },
    confirmTo({ value }: { value: number }) {
      this.onConfirm({ value }, "toStr");
    },

    formatter(type: string, value: any) {
      if (type === "year") {
        return `${value}年`;
      }
      if (type === "month") {
        return `${value}月`;
      }
      if (type === "day") {
        return `${value}日`;
      }
      return value;
    },
  },
});
</script>

<style lang="scss">
.tag_wrap {
  display: flex;
  align-items: center;
}
.tag_wrap ::v-deep text {
  width: 200rpx;
  text-align: center;
}

.split_line {
  margin: 0 10rpx;
}
</style>
