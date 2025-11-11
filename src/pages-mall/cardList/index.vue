<template>
  <view class="card-list-page">
    <!-- 顶部导航栏 -->
    <view class="header">
      <view class="header-content">
        <u-icon name="arrow-left" color="#fff" size="24" @click="goBack"></u-icon>
        <text class="header-title">卡片列表<text class="header-num">({{ total }})</text></text>
      </view>
    </view>

    <!-- 卡片列表容器 -->
    <view class="card-list-container">
      <!-- 加载状态 -->
      <view v-if="loading && cardList.length === 0" class="loading-container">
        <view class="spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 空状态 -->
      <view v-else-if="cardList.length === 0" class="empty-state">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无卡片数据</text>
      </view>

      <!-- 卡片列表 -->
      <view v-else class="card-list">
        <view v-for="(card, index) in cardList" :key="card.id" class="card-item">
          <view class="card-content">
            <!-- 左侧图片 -->
            <view class="card-left">
              <image class="card-img"
                :src="`https://yxwdbapi.windoent.com/konami/getImageAction?type=1&ciid=1&cid=${card.cardId}&enc=${card.imageKey}&lang=cn`"
                mode="aspectFit" @click="viewCardDetail(card)" />
            </view>

            <!-- 右侧信息 -->
            <view class="card-right">
              <view class="card-name">{{ card.cardName }}</view>

              <!-- 卡片ID -->
              <view class="card-info-row">
                <text class="info-label">ID:</text>
                <text class="info-value">{{ card.cardId }}</text>
              </view>

              <!-- 属性 -->
              <view class="card-info-row" v-if="card.attributeName">
                <text class="info-label">属性:</text>
                <view class="info-tag"
                  :class="{
                    'attr-dark': card.attributeName === '暗属性',
                    'attr-light': card.attributeName === '光属性',
                    'attr-earth': card.attributeName === '地属性',
                    'attr-water': card.attributeName === '水属性',
                    'attr-fire': card.attributeName === '炎属性',
                    'attr-wind': card.attributeName === '风属性',
                    'attr-divine': card.attributeName === '神属性',
                    'attr-spell': card.attributeName === '魔法',
                    'attr-trap': card.attributeName === '陷阱'
                  }">
                  {{ card.attributeName }}
                </view>
              </view>

              <!-- 种族 -->
              <view class="card-info-row" v-if="card.speciesName">
                <text class="info-label">种族:</text>
                <text class="info-value">{{ card.speciesName }}</text>
              </view>

              <!-- 星级/阶级 -->
              <view class="card-info-row" v-if="card.starchip !== null && card.starchip !== undefined">
                <text class="info-label">星级:</text>
                <text class="info-value">{{ card.starchip }}</text>
              </view>

              <!-- 攻击力/守备力 -->
              <view class="card-info-row" v-if="card.atk !== null || card.def !== null">
                <text class="info-label">攻/守:</text>
                <text class="info-value">{{ card.atk !== null ? card.atk : '?' }} / {{
                  card.def !== null ? card.def : '?' }}</text>
              </view>

              <!-- 灵摆刻度 -->
              <view class="card-info-row" v-if="card.penScale !== null && card.penScale !== undefined">
                <text class="info-label">灵摆:</text>
                <text class="info-value">{{ card.penScale }}</text>
              </view>

              <!-- 连接数 -->
              <view class="card-info-row" v-if="card.linkMarkerCount !== null && card.linkMarkerCount !== undefined">
                <text class="info-label">Link:</text>
                <text class="info-value">Link-{{ card.linkMarkerCount }}</text>
              </view>

              <!-- 类型标签 -->
              <view class="card-types" v-if="card.otherItemNameList && card.otherItemNameList.length > 0">
                <view class="type-tag" v-for="(type, i) in card.otherItemNameList" :key="i">
                  {{ type }}
                </view>
              </view>

              <!-- 效果描述 -->
              <view class="card-text" v-if="showCardText[card.id]">
                <view class="card-text-content" v-html="card.cardText"></view>
              </view>
              <view class="toggle-text" @click="toggleCardText(card.id)" v-if="card.cardText">
                {{ showCardText[card.id] ? '收起' : '查看效果' }}
              </view>
            </view>
          </view>
        </view>

        <!-- 加载更多 -->
        <view v-if="hasMore && !loading" class="load-more">
          <text class="load-more-text">上拉加载更多</text>
        </view>

        <view v-if="!hasMore && cardList.length > 0" class="no-more">
          <text class="no-more-text">- 没有更多了 -</text>
        </view>

        <view v-if="loading && cardList.length > 0" class="loading-more">
          <view class="spinner-small"></view>
          <text class="loading-text">加载中...</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import service from "@/api/index";
import { CardInput } from "@/api/data";

export default Vue.extend({
  data() {
    return {
      cardList: [] as any[],
      total: 0,
      page: 1,
      pageSize: 10,
      loading: false,
      hasMore: true,
      searchParams: {} as any,
      showCardText: {} as Record<number, boolean>,
    };
  },
  onLoad(options: any) {
    // 从URL参数获取搜索条件
    if (options.params) {
      try {
        this.searchParams = JSON.parse(decodeURIComponent(options.params));
      } catch (e) {
        console.error('解析参数失败:', e);
      }
    }
    this.loadCardList();
  },
  // 监听页面触底事件
  onReachBottom() {
    this.loadMore();
  },
  methods: {
    async loadCardList(loadMore = false) {
      if (this.loading) return;
      if (loadMore && !this.hasMore) return;

      this.loading = true;
      try {
        const input: CardInput = {
          params: {
            page: loadMore ? this.page + 1 : 1,
            pageSize: this.pageSize,
            lang: 'cn',
            ...this.searchParams
          },
        };

        const res: any = await service.getCard(input);

        if (res.result.code === 200 && res.response.cardList) {
          if (loadMore) {
            this.cardList = [...this.cardList, ...res.response.cardList];
            this.page++;
          } else {
            this.cardList = res.response.cardList;
            this.page = 1;
          }
          console.log(this.cardList, '--1-2-');

          this.total = res.response.total;
          this.hasMore = this.cardList.length < this.total;
        }
      } catch (error) {
        console.error('查询卡片失败:', error);
        uni.showToast({
          title: '查询失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },

    loadMore() {
      if (!this.loading && this.hasMore) {
        this.loadCardList(true);
      }
    },

    toggleCardText(cardId: number) {
      this.$set(this.showCardText, cardId, !this.showCardText[cardId]);
    },

    viewCardDetail(card: any) {
      // 可以跳转到卡片详情页
      console.log('查看卡片详情:', card);
    },

    goBack() {
      uni.navigateBack();
    }
  }
});
</script>

<style lang="scss">
page {
  background: #f5f7fa;
  height: 100%;
}
</style>

<style lang="scss" scoped>
.card-list-page {
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}

// 顶部导航
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20rpx 30rpx;
  padding-top: calc(20rpx + var(--status-bar-height));
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88rpx;

    .header-title {
      flex: 1;
      text-align: center;
      font-size: 36rpx;
      font-weight: bold;
      color: #ffffff;

      .header-num {
        font-size: 24rpx;
        margin-left: 10rpx;
      }
    }
  }
}

// 卡片列表容器
.card-list-container {
  flex: 1;
  padding: 20rpx;
  margin-top: calc(128rpx + var(--status-bar-height));
}

// 加载状态
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;

  .loading-text {
    margin-top: 20rpx;
    color: #999;
    font-size: 28rpx;
  }
}

// 加载动画
.spinner {
  width: 60rpx;
  height: 60rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid #f3f3f3;
  border-top: 4rpx solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;

  .empty-icon {
    font-size: 80rpx;
    margin-bottom: 20rpx;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

// 卡片列表
.card-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding-bottom: 40rpx;
}

.card-item {
  background: white;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.08);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
}

.card-content {
  display: flex;
  padding: 20rpx;
  gap: 20rpx;
}

.card-left {
  flex-shrink: 0;

  .card-img {
    width: 180rpx;
    height: 260rpx;
    border-radius: 8rpx;
    background: #f5f5f5;
  }
}

.card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  min-width: 0;
}

.card-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  word-break: break-all;
}

.card-info-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 26rpx;

  .info-label {
    color: #999;
    flex-shrink: 0;
  }

  .info-value {
    color: #666;
  }

  .info-tag {
    padding: 4rpx 12rpx;
    border-radius: 6rpx;
    color: white;
    font-size: 24rpx;
    font-weight: 500;

    &.attr-dark {
      background: #8b7355;
    }

    &.attr-light {
      background: #ffd700;
      color: #333;
    }

    &.attr-earth {
      background: #8b4513;
    }

    &.attr-water {
      background: #4169e1;
    }

    &.attr-fire {
      background: #ff4500;
    }

    &.attr-wind {
      background: #00ced1;
    }

    &.attr-divine {
      background: #ffd700;
      color: #333;
    }

    &.attr-spell {
      background: #3cb371;
    }

    &.attr-trap {
      background: #dc143c;
    }
  }
}

.card-types {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;

  .type-tag {
    padding: 4rpx 12rpx;
    background: #e8ecf5;
    color: #667eea;
    border-radius: 6rpx;
    font-size: 22rpx;
  }
}

.card-text {
  margin-top: 8rpx;
  padding: 16rpx;
  background: #f8f9fa;
  border-radius: 8rpx;

  .card-text-content {
    font-size: 24rpx;
    line-height: 1.6;
    color: #666;
  }
}

.toggle-text {
  color: #667eea;
  font-size: 24rpx;
  text-align: center;
  padding: 8rpx 0;
  cursor: pointer;
}

// 加载更多
.load-more,
.no-more,
.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx 0;
  gap: 10rpx;

  .load-more-text,
  .no-more-text,
  .loading-text {
    font-size: 26rpx;
    color: #999;
  }
}
</style>
