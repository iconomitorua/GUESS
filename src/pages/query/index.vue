<template>
  <view class="query-page">
    <!-- 顶部搜索区 -->
    <view class="search-header">
      <view class="search-row">
        <view class="search-input-wrapper">
          <u-input
            v-model="searchKeyword"
            placeholder="请输入关键字"
            :clearable="true"
            :border="true"
            shape="circle"
          >
            <template #suffix>
              <u-icon name="close-circle-fill" v-if="searchKeyword" @click="searchKeyword = ''" color="#c0c4cc"></u-icon>
            </template>
          </u-input>
        </view>
        <view class="search-selects">
          <u-button
            :type="searchLang === '0' ? 'primary' : 'default'"
            size="small"
            @click="searchLang = '0'"
            shape="circle"
          >
            搜索语言
          </u-button>
          <u-button
            :type="searchType === '1' ? 'primary' : 'default'"
            size="small"
            @click="searchType = '1'"
            shape="circle"
          >
            搜索卡名
          </u-button>
        </view>
        <u-button
          type="warning"
          size="small"
          @click="handleSearch"
          shape="circle"
          icon="search"
        >
          搜索
        </u-button>
      </view>

      <!-- 按精确筛选条件检索 -->
      <view class="filter-tip">
        <text class="tip-text">按精确筛选条件检索</text>
        <u-icon name="arrow-down" size="24"></u-icon>
      </view>
    </view>

    <!-- 标签页 -->
    <view class="tabs-wrapper">
      <view class="tabs">
        <view
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab-item', { 'active': activeTab === index }]"
          @click="activeTab = index"
        >
          {{ tab }}
        </view>
      </view>
    </view>

    <!-- 筛选条件区域 -->
    <scroll-view class="filter-container" scroll-y>
      <!-- 属性 -->
      <view class="filter-section">
        <view class="filter-header">
          <text class="filter-label">属性</text>
          <view class="filter-tools">
            <u-icon name="question-circle" size="32" color="#ff9900"></u-icon>
            <u-icon name="close-circle" size="32" color="#ff0000" @click="clearAttribute"></u-icon>
          </view>
        </view>
        <view class="filter-options">
          <view
            v-for="(attr, index) in attributes"
            :key="index"
            :class="['option-btn', { 'selected': selectedAttributes.includes(attr) }]"
            @click="toggleAttribute(attr)"
          >
            <image v-if="attr.icon" :src="attr.icon" class="attr-icon" mode="aspectFit"></image>
            <text>{{ attr.name }}</text>
          </view>
        </view>
      </view>

      <!-- 效果 -->
      <view class="filter-section">
        <view class="filter-header">
          <text class="filter-label">效果</text>
          <view class="filter-tools">
            <u-icon name="question-circle" size="32" color="#ff9900"></u-icon>
            <u-icon name="close-circle" size="32" color="#ff0000" @click="clearEffects"></u-icon>
          </view>
        </view>
        <view class="filter-options">
          <view
            v-for="(effect, index) in effects"
            :key="index"
            :class="['option-btn', { 'selected': selectedEffects.includes(effect) }]"
            @click="toggleEffect(effect)"
          >
            <image v-if="effect.icon" :src="effect.icon" class="effect-icon" mode="aspectFit"></image>
            <text>{{ effect.name }}</text>
          </view>
        </view>
      </view>

      <!-- 种族 -->
      <view class="filter-section">
        <view class="filter-header">
          <text class="filter-label">种族</text>
          <view class="filter-tools">
            <u-icon name="question-circle" size="32" color="#ff9900"></u-icon>
            <u-icon name="close-circle" size="32" color="#ff0000" @click="clearSpecies"></u-icon>
          </view>
        </view>
        <view class="filter-options species-grid">
          <view
            v-for="(species, index) in speciesList"
            :key="index"
            :class="['option-btn', { 'selected': selectedSpecies.includes(species) }]"
            @click="toggleSpecies(species)"
          >
            {{ species }}
          </view>
        </view>
      </view>

      <!-- 其他项目 -->
      <view class="filter-section">
        <view class="filter-header">
          <text class="filter-label">其他项目</text>
          <view class="filter-tools">
            <u-icon name="question-circle" size="32" color="#ff9900"></u-icon>
            <u-icon name="close-circle" size="32" color="#ff0000" @click="clearOtherItems"></u-icon>
          </view>
        </view>
        <view class="toggle-group">
          <view class="toggle-item">
            <text>and</text>
            <radio :checked="otherCondition === 'and'" @click="otherCondition = 'and'"></radio>
          </view>
          <view class="toggle-item">
            <text>or</text>
            <radio :checked="otherCondition === 'or'" @click="otherCondition = 'or'"></radio>
          </view>
        </view>
        <view class="filter-options">
          <view
            v-for="(item, index) in otherItems"
            :key="index"
            :class="['option-btn', { 'selected': selectedOtherItems.includes(item) }]"
            @click="toggleOtherItem(item)"
          >
            {{ item }}
          </view>
        </view>
      </view>

      <!-- 除外项目 -->
      <view class="filter-section">
        <view class="filter-header">
          <text class="filter-label">除外项目</text>
          <view class="filter-tools">
            <u-icon name="question-circle" size="32" color="#ff9900"></u-icon>
            <u-icon name="close-circle" size="32" color="#ff0000" @click="clearExclusions"></u-icon>
          </view>
        </view>
        <view class="toggle-group">
          <view class="toggle-item">
            <text>and</text>
            <radio :checked="exclusionCondition === 'and'" @click="exclusionCondition = 'and'"></radio>
          </view>
          <view class="toggle-item">
            <text>or</text>
            <radio :checked="exclusionCondition === 'or'" @click="exclusionCondition = 'or'"></radio>
          </view>
        </view>
        <view class="filter-options">
          <view
            v-for="(item, index) in exclusionItems"
            :key="index"
            :class="['option-btn', { 'selected': selectedExclusions.includes(item) }]"
            @click="toggleExclusion(item)"
          >
            {{ item }}
          </view>
        </view>
      </view>

      <!-- 等级/阶级 -->
      <view class="filter-section">
        <view class="filter-header">
          <text class="filter-label">等级/阶级</text>
          <view class="filter-tools">
            <u-icon name="question-circle" size="32" color="#ff9900"></u-icon>
            <u-icon name="close-circle" size="32" color="#ff0000" @click="clearStars"></u-icon>
          </view>
        </view>
        <view class="number-options">
          <view
            v-for="num in 14"
            :key="num - 1"
            :class="['number-btn', { 'selected': selectedStars.includes(num - 1) }]"
            @click="toggleStar(num - 1)"
          >
            {{ num - 1 }}
          </view>
        </view>
      </view>

      <!-- 灵摆刻度 -->
      <view class="filter-section">
        <view class="filter-header">
          <text class="filter-label">灵摆刻度</text>
          <view class="filter-tools">
            <u-icon name="question-circle" size="32" color="#ff9900"></u-icon>
            <u-icon name="close-circle" size="32" color="#ff0000" @click="clearPenScale"></u-icon>
          </view>
        </view>
        <view class="number-options">
          <view
            v-for="num in 14"
            :key="num - 1"
            :class="['number-btn', { 'selected': selectedPenScale.includes(num - 1) }]"
            @click="togglePenScale(num - 1)"
          >
            {{ num - 1 }}
          </view>
        </view>
      </view>

      <!-- 连接 -->
      <view class="filter-section">
        <view class="filter-header">
          <text class="filter-label">连接</text>
          <view class="filter-tools">
            <u-icon name="question-circle" size="32" color="#ff9900"></u-icon>
            <u-icon name="close-circle" size="32" color="#ff0000" @click="clearLinks"></u-icon>
          </view>
        </view>
        <view class="link-container">
          <view class="number-options link-numbers">
            <view
              v-for="num in 6"
              :key="num"
              :class="['number-btn', { 'selected': selectedLinks.includes(num) }]"
              @click="toggleLink(num)"
            >
              {{ num }}
            </view>
          </view>
          <view class="link-direction">
            <view class="direction-grid">
              <!-- 9宫格方向选择 -->
              <view
                v-for="(dir, index) in linkDirections"
                :key="index"
                :class="['direction-btn', { 'selected': selectedDirections.includes(dir.value), 'center': dir.value === 'center' }]"
                @click="toggleDirection(dir.value)"
              >
              </view>
            </view>
            <view class="toggle-group direction-toggle">
              <view class="toggle-item">
                <text>and</text>
                <radio :checked="linkCondition === 'and'" @click="linkCondition = 'and'"></radio>
              </view>
              <view class="toggle-item">
                <text>or</text>
                <radio :checked="linkCondition === 'or'" @click="linkCondition = 'or'"></radio>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 攻击力/守备力 -->
      <view class="filter-section atk-def-section">
        <view class="stat-inputs">
          <view class="stat-group">
            <text class="stat-label">攻击力</text>
            <view class="stat-input-row">
              <u-input
                v-model="atkFrom"
                type="number"
                placeholder=""
                :border="true"
              ></u-input>
            </view>
          </view>
          <view class="stat-group">
            <text class="stat-label">守备力</text>
            <view class="stat-input-row">
              <u-input
                v-model="defFrom"
                type="number"
                placeholder=""
                :border="true"
              ></u-input>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部搜索按钮 -->
    <view class="bottom-search">
      <u-button
        type="warning"
        size="large"
        @click="handleSearch"
        shape="circle"
      >
        搜索
      </u-button>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      // 搜索相关
      searchKeyword: '',
      searchLang: '0',
      searchType: '1',

      // 标签页
      activeTab: 0,
      tabs: ['所有卡', '怪兽卡', '魔法卡', '陷阱卡'],

      // 属性
      attributes: [
        { name: '暗属性', icon: '' },
        { name: '光属性', icon: '' },
        { name: '地属性', icon: '' },
        { name: '水属性', icon: '' },
        { name: '炎属性', icon: '' },
        { name: '风属性', icon: '' },
        { name: '神属性', icon: '' },
      ],
      selectedAttributes: [] as any[],

      // 效果
      effects: [
        { name: '装备', icon: '' },
        { name: '场地', icon: '' },
        { name: '速攻', icon: '' },
        { name: '仪式', icon: '' },
        { name: '永续', icon: '' },
        { name: '反击', icon: '' },
        { name: '通常', icon: '' },
      ],
      selectedEffects: [] as any[],

      // 种族
      speciesList: [
        '魔法师族', '龙族', '不死族', '战士族', '兽战士族', '兽族', '鸟兽族',
        '恶魔族', '天使族', '昆虫族', '岩石族', '机械族', '恐龙族',
        '水族', '炎族', '雷族', '植物族', '电子界族', '幻龙族',
        '幻神兽族', '创造神族', '幻龙族', '电子界族', '恐动力族'
      ],
      selectedSpecies: [] as string[],

      // 其他项目
      otherCondition: 'and',
      otherItems: ['通常', '效果', '仪式', '融合', '同步', '超量', '灵摆', '连接', '卡通', '特殊召唤'],
      selectedOtherItems: [] as string[],

      // 除外项目
      exclusionCondition: 'and',
      exclusionItems: ['通常', '效果', '仪式', '融合', '同步', '超量', '灵摆', '连接', '卡通', '特殊召唤'],
      selectedExclusions: [] as string[],

      // 等级
      selectedStars: [] as number[],

      // 灵摆刻度
      selectedPenScale: [] as number[],

      // 连接
      selectedLinks: [] as number[],
      linkCondition: 'or',
      linkDirections: [
        { value: 'tl' }, { value: 't' }, { value: 'tr' },
        { value: 'l' }, { value: 'center' }, { value: 'r' },
        { value: 'bl' }, { value: 'b' }, { value: 'br' },
      ],
      selectedDirections: [] as string[],

      // 攻守
      atkFrom: '',
      atkTo: '',
      defFrom: '',
      defTo: '',
    };
  },
  methods: {
    // 属性相关
    toggleAttribute(attr: any) {
      const index = this.selectedAttributes.findIndex(a => a.name === attr.name);
      if (index > -1) {
        this.selectedAttributes.splice(index, 1);
      } else {
        this.selectedAttributes.push(attr);
      }
    },
    clearAttribute() {
      this.selectedAttributes = [];
    },

    // 效果相关
    toggleEffect(effect: any) {
      const index = this.selectedEffects.findIndex(e => e.name === effect.name);
      if (index > -1) {
        this.selectedEffects.splice(index, 1);
      } else {
        this.selectedEffects.push(effect);
      }
    },
    clearEffects() {
      this.selectedEffects = [];
    },

    // 种族相关
    toggleSpecies(species: string) {
      const index = this.selectedSpecies.indexOf(species);
      if (index > -1) {
        this.selectedSpecies.splice(index, 1);
      } else {
        this.selectedSpecies.push(species);
      }
    },
    clearSpecies() {
      this.selectedSpecies = [];
    },

    // 其他项目
    toggleOtherItem(item: string) {
      const index = this.selectedOtherItems.indexOf(item);
      if (index > -1) {
        this.selectedOtherItems.splice(index, 1);
      } else {
        this.selectedOtherItems.push(item);
      }
    },
    clearOtherItems() {
      this.selectedOtherItems = [];
    },

    // 除外项目
    toggleExclusion(item: string) {
      const index = this.selectedExclusions.indexOf(item);
      if (index > -1) {
        this.selectedExclusions.splice(index, 1);
      } else {
        this.selectedExclusions.push(item);
      }
    },
    clearExclusions() {
      this.selectedExclusions = [];
    },

    // 等级
    toggleStar(num: number) {
      const index = this.selectedStars.indexOf(num);
      if (index > -1) {
        this.selectedStars.splice(index, 1);
      } else {
        this.selectedStars.push(num);
      }
    },
    clearStars() {
      this.selectedStars = [];
    },

    // 灵摆刻度
    togglePenScale(num: number) {
      const index = this.selectedPenScale.indexOf(num);
      if (index > -1) {
        this.selectedPenScale.splice(index, 1);
      } else {
        this.selectedPenScale.push(num);
      }
    },
    clearPenScale() {
      this.selectedPenScale = [];
    },

    // 连接
    toggleLink(num: number) {
      const index = this.selectedLinks.indexOf(num);
      if (index > -1) {
        this.selectedLinks.splice(index, 1);
      } else {
        this.selectedLinks.push(num);
      }
    },
    toggleDirection(dir: string) {
      if (dir === 'center') return;
      const index = this.selectedDirections.indexOf(dir);
      if (index > -1) {
        this.selectedDirections.splice(index, 1);
      } else {
        this.selectedDirections.push(dir);
      }
    },
    clearLinks() {
      this.selectedLinks = [];
      this.selectedDirections = [];
    },

    // 搜索
    handleSearch() {
      console.log('搜索参数:', {
        keyword: this.searchKeyword,
        attributes: this.selectedAttributes,
        effects: this.selectedEffects,
        species: this.selectedSpecies,
        // ... 其他筛选条件
      });

      uni.showToast({
        title: '搜索功能开发中',
        icon: 'none'
      });
    }
  }
});
</script>

<style lang="scss">
page {
  background: #f7f7f6;
}
</style>

<style lang="scss" scoped>
.query-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7f7f6;
  padding-bottom: 140rpx;
}

// 顶部搜索区
.search-header {
  background: #003366;
  padding: 20rpx 24rpx;
  padding-top: calc(20rpx + var(--status-bar-height));

  .search-row {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 20rpx;
  }

  .search-input-wrapper {
    flex: 1;
    min-width: 0;
  }

  .search-selects {
    display: flex;
    gap: 12rpx;
  }

  .filter-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    padding: 16rpx 0;

    .tip-text {
      color: #ffffff;
      font-size: 28rpx;
    }
  }
}

// 标签页
.tabs-wrapper {
  background: #ffffff;
  border-bottom: 1rpx solid #e5e5e5;
}

.tabs {
  display: flex;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 28rpx 0;
    font-size: 30rpx;
    color: #666666;
    position: relative;
    transition: all 0.3s;

    &.active {
      color: #003366;
      font-weight: bold;
      background: linear-gradient(to bottom, #cccccc, #ffffff);

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 4rpx;
        background: #003366;
      }
    }
  }
}

// 筛选容器
.filter-container {
  flex: 1;
  padding: 0 24rpx;
}

// 筛选区块
.filter-section {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-top: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;

  .filter-label {
    font-size: 30rpx;
    font-weight: bold;
    color: #333333;
  }

  .filter-tools {
    display: flex;
    gap: 24rpx;
  }
}

// 切换组
.toggle-group {
  display: flex;
  gap: 40rpx;
  margin-bottom: 20rpx;
  padding: 16rpx 24rpx;
  background: #f5f5f5;
  border-radius: 12rpx;

  .toggle-item {
    display: flex;
    align-items: center;
    gap: 12rpx;
    font-size: 28rpx;
    color: #666666;
  }
}

// 选项按钮
.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.option-btn {
  padding: 16rpx 28rpx;
  background: #e8eaf0;
  border: 2rpx solid transparent;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #333333;
  display: flex;
  align-items: center;
  gap: 8rpx;
  transition: all 0.3s;

  &.selected {
    background: #003366;
    color: #ffffff;
    border-color: #003366;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }

  .attr-icon,
  .effect-icon {
    width: 32rpx;
    height: 32rpx;
  }
}

// 种族网格
.species-grid {
  .option-btn {
    min-width: 160rpx;
    justify-content: center;
  }
}

// 数字选项
.number-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.number-btn {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #003366;
  color: #ffffff;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
  transition: all 0.3s;

  &.selected {
    background: #ff9900;
    transform: scale(1.05);
    box-shadow: 0 4rpx 12rpx rgba(255, 153, 0, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
}

// 连接容器
.link-container {
  display: flex;
  gap: 32rpx;
  align-items: flex-start;
}

.link-numbers {
  flex: 1;
}

.link-direction {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.direction-grid {
  display: grid;
  grid-template-columns: repeat(3, 100rpx);
  grid-template-rows: repeat(3, 100rpx);
  gap: 8rpx;
  background: #8b7355;
  padding: 16rpx;
  border-radius: 16rpx;
}

.direction-btn {
  background: #f0f0f0;
  border: 3rpx solid #666666;
  border-radius: 8rpx;
  transition: all 0.3s;

  &.center {
    background: #8b7355;
    border-color: #8b7355;
  }

  &.selected {
    background: #003366;
    border-color: #003366;
  }

  &:active:not(.center) {
    transform: scale(0.95);
  }
}

.direction-toggle {
  justify-content: center;
}

// 攻守区域
.atk-def-section {
  .stat-inputs {
    display: flex;
    gap: 32rpx;
  }

  .stat-group {
    flex: 1;

    .stat-label {
      display: block;
      font-size: 28rpx;
      color: #666666;
      margin-bottom: 16rpx;
    }
  }
}

// 底部搜索按钮
.bottom-search {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx;
  background: #ffffff;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.08);
  z-index: 100;
}
</style>
