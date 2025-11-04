<template>
  <view class="tag_wrap">
    <u-upload
      accept="image"
      :fileList="value ? [{ url: value }] : []"
      @afterRead="afterRead"
      @delete="deletePic"
      :maxCount="1"
      :width="width"
      :height="height"
    />
  </view>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { aliossToken } from "./service";

export default Vue.extend({
  data() {
    return {};
  },
  props: {
    value: String as PropType<string | undefined>,
    width: Number as PropType<number | undefined>,
    height: Number as PropType<number | undefined>,
  },
  mounted() {
    console.log("this.value", this.value);
  },
  computed: {},
  methods: {
    async afterRead(event: any) {
      console.log(
        "%cuploadImage.vue line:34 点了吗",
        "color: #007acc;",
        "点了吗"
      );
      const {
        file: { url: filePath },
      } = event;

      try {
        const fileName = filePath
          .replace("wxfile://tmp_", "")
          .replace("http://tmp/", "");

        uni.showLoading({ title: "上传中" });
        const res = await aliossToken();
        const info: any = res.aliossToken;
        console.log("%cuploadImage.vue line:46 info", "color: #007acc;", info);
        uni.uploadFile({
          url: info.host as string, // 开发者服务器的URL。
          filePath,
          name: "file", // 必须填file。
          formData: {
            key: `${info.dir}${fileName}`,
            policy: info.policy,
            OSSAccessKeyId: info.accessId,
            signature: info.signature,
          },
          success: async (res) => {
            // console.log("res", res);
            // console.log(`${downloadHost}/${dir}${fileName}`);
            // if (res.statusCode === 204) {
            //   console.log("上传成功");
            // }
            const url = `${info.downloadHost}/${info.dir}${fileName}`;
            console.log(
              "%cuploadImage.vue line:63 url",
              "color: #007acc;",
              url
            );
            this.$emit("input", url);

            uni.hideLoading();
          },
          fail: (err) => {
            uni.hideLoading();
            uni.showToast({ title: "上传失败" });
            console.log(
              "%cuploadImage.vue line:71 err",
              "color: #007acc;",
              err
            );
          },
        });
      } catch (error) {
        console.error(error);
      }
    },

    deletePic() {
      uni.showModal({
        title: "确认删除此照片",
        success: (res) => {
          console.log(res);
          const { confirm } = res;
          if (confirm) {
            this.$emit("input", undefined);
          }
        },
      });
    },
  },
});
</script>

<style lang="scss">
.tag_wrap {
  width: 100%;
  margin-left: 8px;
  .img {
    margin: 0;
  }
  view {
    margin: 0;
  }
}
</style>
