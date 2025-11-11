<template>
  <view class="query-page">
    <!-- 顶部搜索区 -->
    <view class="search-header">
      <view class="search-title">卡片查询</view>

      <!-- 关键词搜索 -->
      <view class="search-box">
        <u-input v-model="searchKeyword" placeholder="请输入卡片名称关键词..." :clearable="true" :border="true" shape="circle">
        </u-input>
      </view>

      <u-button type="primary" size="large" @click="handleSearch" shape="circle" :custom-style="{ marginTop: '20rpx' }">
        <u-icon name="search" size="28" color="#fff"></u-icon>
        <text style="margin-left: 10rpx;">搜索</text>
      </u-button>
    </view>

    <!-- 筛选条件区域 -->
    <scroll-view class="filter-container" scroll-y>
      <!-- 卡片类型 -->
      <view class="filter-section">
        <view class="filter-header">
          <text class="filter-label">卡片类型</text>
          <text class="clear-btn" @click="clearCardType">清除</text>
        </view>
        <view class="filter-options">
          <view v-for="(type, index) in cardTypes" :key="index"
            :class="['option-btn', { 'selected': selectedCardType === type }]" @click="selectedCardType = type">
            {{ type }}
          </view>
        </view>
      </view>

      <!-- 属性筛选（怪兽卡时显示） -->
      <view class="filter-section" v-if="selectedCardType === '怪兽'">
        <view class="filter-header">
          <text class="filter-label">属性</text>
          <text class="clear-btn" @click="clearAttribute">清除</text>
        </view>
        <view class="filter-options">
          <view v-for="(attr, index) in attributes" :key="index"
            :class="['option-btn', { 'selected': selectedAttribute === attr }]" @click="selectedAttribute = attr">
            {{ attr }}
          </view>
        </view>
      </view>

      <!-- 种族筛选（怪兽卡时显示） -->
      <view class="filter-section" v-if="selectedCardType === '怪兽'">
        <view class="filter-header">
          <text class="filter-label">种族</text>
          <text class="clear-btn" @click="clearSpecies">清除</text>
        </view>
        <view class="filter-options species-grid">
          <view v-for="(species, index) in speciesList" :key="index"
            :class="['option-btn', { 'selected': selectedSpecies === species }]" @click="selectedSpecies = species">
            {{ species }}
          </view>
        </view>
      </view>

      <!-- 怪兽类型筛选（怪兽卡时显示） -->
      <view class="filter-section" v-if="selectedCardType === '怪兽'">
        <view class="filter-header">
          <text class="filter-label">怪兽类型</text>
          <text class="clear-btn" @click="clearMonsterType">清除</text>
        </view>
        <view class="filter-options">
          <view v-for="(type, index) in monsterTypes" :key="index"
            :class="['option-btn', { 'selected': selectedMonsterTypes.includes(type) }]"
            @click="toggleMonsterType(type)">
            {{ type }}
          </view>
        </view>
      </view>

      <!-- 魔法类型筛选（魔法卡时显示） -->
      <view class="filter-section" v-if="selectedCardType === '魔法'">
        <view class="filter-header">
          <text class="filter-label">魔法类型</text>
          <text class="clear-btn" @click="clearSpellType">清除</text>
        </view>
        <view class="filter-options">
          <view v-for="(type, index) in spellTypes" :key="index"
            :class="['option-btn', { 'selected': selectedSpellType === type }]" @click="selectedSpellType = type">
            {{ type }}
          </view>
        </view>
      </view>

      <!-- 陷阱类型筛选（陷阱卡时显示） -->
      <view class="filter-section" v-if="selectedCardType === '陷阱'">
        <view class="filter-header">
          <text class="filter-label">陷阱类型</text>
          <text class="clear-btn" @click="clearTrapType">清除</text>
        </view>
        <view class="filter-options">
          <view v-for="(type, index) in trapTypes" :key="index"
            :class="['option-btn', { 'selected': selectedTrapType === type }]" @click="selectedTrapType = type">
            {{ type }}
          </view>
        </view>
      </view>

      <!-- 星级/阶级筛选（怪兽卡时显示） -->
      <view class="filter-section" v-if="selectedCardType === '怪兽'">
        <view class="filter-header">
          <text class="filter-label">星级/阶级</text>
          <text class="clear-btn" @click="clearStars">清除</text>
        </view>
        <view class="number-options">
          <view v-for="num in 13" :key="num" :class="['number-btn', { 'selected': selectedStar === num }]"
            @click="selectedStar = num">
            {{ num }}
          </view>
        </view>
      </view>

      <!-- 攻击力筛选（怪兽卡时显示） -->
      <view class="filter-section" v-if="selectedCardType === '怪兽'">
        <view class="filter-header">
          <text class="filter-label">攻击力范围</text>
        </view>
        <view class="range-inputs">
          <u-input v-model="atkMin" type="number" placeholder="最小值" :border="true"></u-input>
          <text class="range-separator">~</text>
          <u-input v-model="atkMax" type="number" placeholder="最大值" :border="true"></u-input>
        </view>
      </view>

      <!-- 守备力筛选（怪兽卡时显示） -->
      <view class="filter-section" v-if="selectedCardType === '怪兽'">
        <view class="filter-header">
          <text class="filter-label">守备力范围</text>
        </view>
        <view class="range-inputs">
          <u-input v-model="defMin" type="number" placeholder="最小值" :border="true"></u-input>
          <text class="range-separator">~</text>
          <u-input v-model="defMax" type="number" placeholder="最大值" :border="true"></u-input>
        </view>
      </view>

      <!-- 底部占位 -->
      <view style="height: 100rpx;"></view>
    </scroll-view>

    <!-- 底部按钮组 -->
    <view class="bottom-actions">
      <u-button type="info" size="large" @click="resetAll" shape="circle" plain>
        重置
      </u-button>
      <u-button type="warning" size="large" @click="handleSearch" shape="circle">
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
      // 关键词搜索
      searchKeyword: '',

      // 卡片类型
      cardTypes: ['全部', '怪兽', '魔法', '陷阱'],
      selectedCardType: '全部',

      // 属性
      attributes: ['暗属性', '光属性', '地属性', '水属性', '炎属性', '风属性', '神属性'],
      selectedAttribute: '',

      // 种族
      speciesList: [
        '魔法师族', '龙族', '不死族', '战士族', '兽战士族', '兽族', '鸟兽族',
        '恶魔族', '天使族', '昆虫族', '岩石族', '机械族', '恐龙族',
        '水族', '炎族', '雷族', '植物族', '电子界族', '幻龙族',
        '幻神兽族', '创造神族', '恐动力族'
      ],
      selectedSpecies: '',

      // 怪兽类型
      monsterTypes: ['通常', '效果', '仪式', '融合', '同步', '超量', '灵摆', '连接'],
      selectedMonsterTypes: [] as string[],

      // 魔法类型
      spellTypes: ['通常', '速攻', '永续', '装备', '场地', '仪式'],
      selectedSpellType: '',

      // 陷阱类型
      trapTypes: ['通常', '永续', '反击'],
      selectedTrapType: '',

      // 星级
      selectedStar: 0,

      // 攻守
      atkMin: '',
      atkMax: '',
      defMin: '',
      defMax: '',
    };
  },
  methods: {
    // 切换怪兽类型（多选）
    toggleMonsterType(type: string) {
      const index = this.selectedMonsterTypes.indexOf(type);
      if (index > -1) {
        this.selectedMonsterTypes.splice(index, 1);
      } else {
        this.selectedMonsterTypes.push(type);
      }
    },

    // 清除方法
    clearCardType() {
      this.selectedCardType = '全部';
    },
    clearAttribute() {
      this.selectedAttribute = '';
    },
    clearSpecies() {
      this.selectedSpecies = '';
    },
    clearMonsterType() {
      this.selectedMonsterTypes = [];
    },
    clearSpellType() {
      this.selectedSpellType = '';
    },
    clearTrapType() {
      this.selectedTrapType = '';
    },
    clearStars() {
      this.selectedStar = 0;
    },

    // 重置所有筛选条件
    resetAll() {
      this.searchKeyword = '';
      this.selectedCardType = '全部';
      this.selectedAttribute = '';
      this.selectedSpecies = '';
      this.selectedMonsterTypes = [];
      this.selectedSpellType = '';
      this.selectedTrapType = '';
      this.selectedStar = 0;
      this.atkMin = '';
      this.atkMax = '';
      this.defMin = '';
      this.defMax = '';

      uni.showToast({
        title: '已重置',
        icon: 'success'
      });
    },

    // 搜索
    handleSearch() {
      // 构建搜索参数
      const params: any = {
        keyword: this.searchKeyword || undefined,
      };

      // 根据卡片类型添加条件
      if (this.selectedCardType !== '全部') {
        if (this.selectedCardType === '怪兽') {
          // 怪兽卡筛选
          if (this.selectedAttribute) {
            params.attributeName = this.selectedAttribute;
          }
          if (this.selectedSpecies) {
            params.speciesName = this.selectedSpecies;
          }
          if (this.selectedMonsterTypes.length > 0) {
            params.otherItemName = this.selectedMonsterTypes.join(',');
          }
          if (this.selectedStar > 0) {
            params.starchip = this.selectedStar;
          }
          if (this.atkMin) {
            params.atkMin = this.atkMin;
          }
          if (this.atkMax) {
            params.atkMax = this.atkMax;
          }
          if (this.defMin) {
            params.defMin = this.defMin;
          }
          if (this.defMax) {
            params.defMax = this.defMax;
          }
        } else if (this.selectedCardType === '魔法') {
          params.attributeName = '魔法';
          if (this.selectedSpellType) {
            params.effectName = this.selectedSpellType;
          }
        } else if (this.selectedCardType === '陷阱') {
          params.attributeName = '陷阱';
          if (this.selectedTrapType) {
            params.effectName = this.selectedTrapType;
          }
        }
      }

      // 跳转到列表页
      uni.navigateTo({
        url: `/pages-mall/cardList/index?params=${encodeURIComponent(JSON.stringify(params))}`
      });
    }
  }
});
</script>

<style lang="scss">
page {
  background: #f5f7fa;
}
</style>

<style lang="scss" scoped>
.query-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  padding-bottom: 140rpx;
}

// 顶部搜索区
.search-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 30rpx;
  padding-top: calc(40rpx + var(--status-bar-height));

  .search-title {
    font-size: 40rpx;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 30rpx;
    text-align: center;
  }

  .search-box {
    margin-bottom: 20rpx;
  }
}

// 筛选容器
.filter-container {
  flex: 1;
  padding: 20rpx;
}

// 筛选区块
.filter-section {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;

  .filter-label {
    font-size: 30rpx;
    font-weight: bold;
    color: #333333;
  }

  .clear-btn {
    font-size: 26rpx;
    color: #667eea;
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
  background: #f5f7fa;
  border: 2rpx solid transparent;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #333333;
  transition: all 0.3s;

  &.selected {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
}

// 种族网格
.species-grid {
  .option-btn {
    min-width: 140rpx;
    text-align: center;
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
  background: #667eea;
  color: #ffffff;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
  transition: all 0.3s;

  &.selected {
    background: linear-gradient(135deg, #fa8c16 0%, #ff6b35 100%);
    transform: scale(1.05);
    box-shadow: 0 4rpx 12rpx rgba(255, 153, 0, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }
}

// 范围输入
.range-inputs {
  display: flex;
  align-items: center;
  gap: 20rpx;

  .range-separator {
    font-size: 28rpx;
    color: #999;
  }
}

// 底部按钮组
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  background: #ffffff;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.08);
  z-index: 100;
}
</style>
