module.exports = {
  transpileDependencies: ["uview-ui"],
  chainWebpack: (config) => {
    // 移除 fork-ts-checker 插件
    config.plugins.delete("fork-ts-checker");
  },

  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          quietDeps: true, // 忽略依赖警告
          silenceDeprecations: ["import"], // 忽略 @import 弃用警告
        },
      },
    },
  },
};
