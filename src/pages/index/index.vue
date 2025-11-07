<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-content">
        <text class="navbar-title">游戏王猜谜</text>
        <view class="navbar-actions">
          <u-icon name="question-circle" color="#fff" size="20" @click="showTipModal = true"></u-icon>
          <text class="nav-icon" @click="startDailyChallenge">🔄</text>
          <text class="nav-icon" @click="showSettings">⚙️</text>
        </view>
      </view>
    </view>

    <!-- 顶部按钮组 -->
    <view class="top-actions">
      <u-button type="primary" @click="showStats" shape="circle" size="medium">统计</u-button>
      <u-button type="warning" @click="showHint" shape="circle" size="medium">提示</u-button>
      <u-button type="error" @click="surrender" shape="circle" size="medium">投降</u-button>
    </view>

    <!-- 剩余次数卡片 -->
    <view class="card attempts-card">
      <view class="card-header">
        <text class="card-icon">⏰</text>
        <text class="card-title">剩余次数</text>
      </view>
      <view class="attempts-info">
        <text class="attempts-number">{{ remainingAttempts }}</text>
        <text class="attempts-total">/ {{ maxAttempts }}</text>
      </view>
    </view>
    <!-- 输入区域 -->
    <view class="card input-card">
      <view class="input-wrapper">
        <u-search v-model="guessInput" placeholder="请输入游戏王卡片名称..." :show-action="false" shape="round"
          @change="handleSearchChange"></u-search>

        <!-- 搜索建议列表 -->
        <view v-if="showSuggestions && filteredPokemonList.length > 0" class="suggestions-list">
          <view v-for="(pokemon, index) in filteredPokemonList" :key="index" class="suggestion-item"
            @click="selectPokemon(pokemon)">
            <text class="suggestion-name" @click="selectCard">{{ pokemon.cardName }}</text>
            <!-- <view class="suggestion-tags">
              <u-tag v-for="(type, i) in pokemon.speciesName" :key="i" :text="type" size="mini" type="info"
                plain></u-tag>
            </view> -->
          </view>
        </view>

        <u-button type="primary" :custom-style="{ marginTop: '20rpx' }" @click="submitGuess" size="large"
          shape="circle">
          确定该卡片
        </u-button>
      </view>
    </view>
    <!-- 猜测历史 -->
    <view class="history-section">
      <view class="section-title">
        <text class="title-icon">📝</text>
        <text class="title-text">猜测历史</text>
      </view>

      <view v-if="guessRecords.length === 0" class="empty-state">
        <text class="empty-icon">📋</text>
        <text class="empty-text">还没有猜测记录，快来试试吧！</text>
      </view>

      <view class="history-card" v-for="(record, index) in guessRecords" :key="index">
        <view class="card">
          <view class="pokemon-header">
            <text class="pokemon-name">{{ record.pokemon.cardName }}</text>
            <u-tag :text="`第${guessRecords.length - index}次`" type="primary" plain size="mini"></u-tag>
          </view>

          <view class="pokemon-details">
            <!-- 属性 -->
            <view class="detail-row">
              <text class="detail-label">属性：</text>
              <u-tag :text="record.pokemon.attributeName" :type="getTagType(record.matches.attributeName)"
                size="default"></u-tag>
            </view>

            <!-- 种族 -->
            <view class="detail-row" v-if="record.pokemon.speciesName && record.pokemon.speciesName.length > 0">
              <text class="detail-label">种族：</text>
              <view class="tags-group">
                <u-tag v-for="(species, i) in record.pokemon.speciesName" :key="i" :text="species"
                  :type="getTagType(record.matches.speciesName)" size="default"></u-tag>
              </view>
            </view>

            <!-- 星级 -->
            <view class="detail-row" v-if="record.pokemon.starchip != null">
              <text class="detail-label">星级：</text>
              <u-tag :text="`${record.pokemon.starchip}星`" :type="getTagType(record.matches.starchip)"
                size="default"></u-tag>
            </view>

            <!-- 攻击力 -->
            <view class="detail-row" v-if="record.pokemon.atk != null">
              <text class="detail-label">攻击力：</text>
              <u-tag :text="String(record.pokemon.atk)" :type="getTagType(record.matches.atk)"
                size="default"></u-tag>
            </view>

            <!-- 防御力 -->
            <view class="detail-row" v-if="record.pokemon.def != null">
              <text class="detail-label">防御力：</text>
              <u-tag :text="String(record.pokemon.def)" :type="getTagType(record.matches.def)"
                size="default"></u-tag>
            </view>

            <!-- 卡片类型 -->
            <view class="detail-row" v-if="record.pokemon.otherItemNameList && record.pokemon.otherItemNameList.length > 0">
              <text class="detail-label">类型：</text>
              <view class="tags-group">
                <u-tag v-for="(type, i) in record.pokemon.otherItemNameList" :key="i" :text="type"
                  :type="getTagType(record.matches.otherItemNameList)" size="mini"></u-tag>
              </view>
            </view>

            <!-- 灵摆刻度 -->
            <view class="detail-row" v-if="record.pokemon.penScale != null">
              <text class="detail-label">灵摆：</text>
              <u-tag :text="`刻度${record.pokemon.penScale}`" :type="getTagType(record.matches.penScale)"
                size="default"></u-tag>
            </view>

            <!-- Link数量 -->
            <view class="detail-row" v-if="record.pokemon.linkMarkerCount != null">
              <text class="detail-label">Link：</text>
              <u-tag :text="`Link-${record.pokemon.linkMarkerCount}`" :type="getTagType(record.matches.linkMarkerCount)"
                size="default"></u-tag>
            </view>
          </view>
        </view>
      </view>
    </view>
    <u-modal v-model="showTipModal" :show-cancel-button="false" :show-confirm-button="false">
      <view class="modal-content">
        <view class="tip-title">游戏提示:</view>
        <view class="tip-text">通过输入游戏王卡片名称进行猜测，找出目标卡片。每次猜测后，你将获得输入卡片的相关信息，帮助你逐步接近答案。</view>

        <view class="tip-title">提示颜色说明:</view>
        <view class="tip-item">✅ 正确：完全匹配</view>
        <view class="tip-item">⚠️ 接近：部分匹配</view>
        <view class="tip-item">❌ 错误：不匹配</view>

        <view class="tip-title">"接近"的触发条件:</view>
        <view class="tip-text">• 攻击力/防御力：与目标卡片的差值≤500</view>
        <view class="tip-text">• 星级：与目标星级的差值≤2</view>
        <view class="tip-text">• 种族/类型：部分匹配</view>
      </view>
    </u-modal>
    <!-- 成功弹窗 -->
    <u-modal v-model="showSuccessModal" :show-cancel-button="false" :show-confirm-button="false">
      <view class="modal-content">
        <view class="modal-icon success">✅</view>
        <view class="modal-title">你获得了胜利！</view>
        <view class="modal-subtitle" v-if="answer">{{ answer.cardName }}</view>

        <view class="answer-details" v-if="answer">
          <view class="answer-row">
            <u-tag :text="answer.attributeName" type="success"></u-tag>
            <u-tag v-for="(species, i) in answer.speciesName" :key="i" :text="species" type="success"></u-tag>
          </view>
          <view class="answer-text" v-if="answer.starchip != null">
            星级：{{ answer.starchip }}星
          </view>
          <view class="answer-text" v-if="answer.atk != null || answer.def != null">
            攻击力：{{ answer.atk != null ? answer.atk : '?' }} / 防御力：{{ answer.def != null ? answer.def : '?' }}
          </view>
          <view class="answer-text" v-if="answer.otherItemNameList && answer.otherItemNameList.length > 0">
            类型：{{ answer.otherItemNameList.join("、") }}
          </view>
          <view class="answer-text" v-if="answer.penScale != null">
            灵摆刻度：{{ answer.penScale }}
          </view>
          <view class="answer-text" v-if="answer.linkMarkerCount != null">
            Link-{{ answer.linkMarkerCount }}
          </view>
        </view>

        <view class="modal-actions">
          <u-button type="info" size="medium" @click="shareResult" plain>
            <u-icon name="share" size="28"></u-icon>
            <text style="margin-left: 10rpx;">分享</text>
          </u-button>
          <u-button type="info" size="medium" @click="generateImage" plain>
            <u-icon name="photo" size="28"></u-icon>
            <text style="margin-left: 10rpx;">生成长图</text>
          </u-button>
          <u-button type="primary" size="medium" @click="playAgain">
            <u-icon name="reload" size="28"></u-icon>
            <text style="margin-left: 10rpx;">再来一次</text>
          </u-button>
        </view>
      </view>
    </u-modal>

    <!-- 失败弹窗 -->
    <u-modal :show="showFailModal" :show-cancel-button="false" :show-confirm-button="false">
      <view class="modal-content">
        <view class="modal-icon fail">❌</view>
        <view class="modal-title">很遗憾，挑战失败！</view>
        <view class="modal-subtitle" v-if="answer">正确答案是：{{ answer.cardName }}</view>

        <view class="answer-details" v-if="answer">
          <view class="answer-row">
            <u-tag :text="answer.attributeName" type="success"></u-tag>
            <u-tag v-for="(species, i) in answer.speciesName" :key="i" :text="species" type="success"></u-tag>
          </view>
          <view class="answer-text" v-if="answer.atk != null || answer.def != null">
            攻击力：{{ answer.atk != null ? answer.atk : '?' }} / 防御力：{{ answer.def != null ? answer.def : '?' }}
          </view>
        </view>

        <view class="modal-actions">
          <u-button type="primary" size="medium" @click="playAgain" block>
            <u-icon name="reload" size="28"></u-icon>
            <text style="margin-left: 10rpx;">再来一次</text>
          </u-button>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { Pokemon, GuessRecord, MatchType } from "./data";
import { getRandomPokemon, searchPokemonByName, pokemonDatabase } from "./server";
import service from "@/api/index";
import { CardInput } from "@/api/data";
export default Vue.extend({
  data() {
    return {
      answer: {} as Pokemon,
      guessInput: "",
      guessRecords: [] as GuessRecord[],
      remainingAttempts: 10,
      maxAttempts: 10,
      showTipModal: false,
      showSuccessModal: false,
      showFailModal: false,
      showSuggestions: false,
      filteredPokemonList: [] as Pokemon[],
      lock: false,
      currentCard: {} as any,
      callbackIndex: 0,
    };
  },
  async onLoad() {
    this.getStatistics();
    // this.queryCards();
    this.initGame();
  },
  methods: {
    async queryCards(keyword = '') {
      try {
        const input: CardInput = {
          params: {
            page: 1,
            pageSize: 10,
            lang: 'cn',
            keyword
          },
        }
        const res: any = await service.getCard(input);
        if (res.result.code === 200 && res.response.cardList && res.response.cardList.length > 0) {
          this.filteredPokemonList = res.response.cardList;
        }
      } catch (error) {
        console.error('查询卡片失败:', error);
      } finally {
        this.lock = false;
        this.showSuggestions = this.filteredPokemonList.length > 0; // 根据过滤后的列表是否为空来决定是否显示建议列表
      }
    },
    //获取统计数据
    async getStatistics() {
      try {
        const res: any = await service.getStatistics();
        if (res.code === 200) {
          let totalNum = res.response.total;
          this.queryCardById(totalNum)
        }
      } catch (error) {
        console.error('获取统计数据失败:', error);
      } finally {
      }
    },
    //用卡名查询
    async queryCardById(max: number) {
      try {
        //id从1-max随机取一个
        const id = Math.floor(Math.random() * max) + 1;
        const res: any = await service.getCardById(id);
        if (res.code === 200) {
          if (res.response.card.id)
            this.answer = res.response.card;
          else {
            this.callbackIndex++
            if (this.callbackIndex < 6) {
              this.callbackIndex++
              this.queryCardById(max)
            } else uni.showToast({
              title: "查询失败,手机即将爆炸！！！",
              icon: "none",
            })
          }
        }

        // if (res.result.code === 200 && res.response.cardList && res.response.cardList.length > 0) {
        //   this.filteredPokemonList = res.response.cardList;
        // }
      } catch (error) {
        console.error('查询卡片失败:', error);
      } finally {
      }
    },
    initGame() {
      this.answer = getRandomPokemon();
      this.guessRecords = [];
      this.remainingAttempts = this.maxAttempts;
      this.guessInput = "";
      this.showSuccessModal = false;
      this.showFailModal = false;
      this.showSuggestions = false;
      this.filteredPokemonList = [];
      console.log("答案是：", this.answer.name);
    },

    // 处理搜索输入变化
    handleSearchChange(value: string) {
      if (this.lock) return;
      if (!value || value.trim() === "") {
        this.showSuggestions = false;
        this.filteredPokemonList = [];
        return;
      }

      // 过滤宝可梦列表，查找包含输入文本的名称
      const searchTerm = value.toLowerCase();
      const timer = setTimeout(() => {
        this.lock = true;
        this.queryCards(searchTerm);
        clearTimeout(timer);
      }, 300)

    },

    // 选择建议的游戏王卡片
    selectPokemon(pokemon: Pokemon) {
      this.guessInput = pokemon.cardName;
      this.currentCard = pokemon;
      this.showSuggestions = false;
      this.filteredPokemonList = [];
    },
    selectCard(info: any) {
      this.currentCard = info;
    },
    submitGuess() {
      if (!this.guessInput.trim()) {
        uni.showToast({
          title: "请输入游戏王卡片名称",
          icon: "none",
        });
        return;
      }

      if (!this.currentCard || !this.currentCard.cardName) {
        uni.showToast({
          title: "请先选择一张卡片",
          icon: "none",
        });
        return;
      }

      // 检查是否正确
      if (this.currentCard.cardName === this.answer.cardName) {
        setTimeout(() => {
          this.showSuccessModal = true;
        }, 500);
        return;
      }

      // 错误的情况，添加到猜测记录并减少次数
      const matches = this.compareAttributes(this.currentCard, this.answer);
      this.guessRecords.push({
        pokemon: this.currentCard,
        matches: matches
      });

      this.remainingAttempts--;
      this.guessInput = "";
      this.currentCard = {};
      this.showSuggestions = false;

      // 检查是否用完次数
      if (this.remainingAttempts <= 0) {
        setTimeout(() => {
          this.showFailModal = true;
        }, 500);
      }
    },

    compareAttributes(guess: Pokemon, answer: Pokemon) {
      return {
        attributeName: this.compareExact(guess.attributeName, answer.attributeName),
        speciesName: this.compareArray(guess.speciesName, answer.speciesName),
        starchip: this.compareStarchip(guess.starchip, answer.starchip),
        atk: this.compareNumber(guess.atk, answer.atk, 500),
        def: this.compareNumber(guess.def, answer.def, 500),
        otherItemNameList: this.compareArray(guess.otherItemNameList, answer.otherItemNameList),
        penScale: this.compareExact(guess.penScale, answer.penScale),
        linkMarkerCount: this.compareExact(guess.linkMarkerCount, answer.linkMarkerCount),
      };
    },

    compareExact(guess: any, answer: any): MatchType {
      if (guess === answer) return "exact";
      // 处理 null/undefined 情况
      if (guess == null && answer == null) return "exact";
      if (guess == null || answer == null) return "none";
      return "none";
    },

    compareArray(guessArray: any[], answerArray: any[]): MatchType {
      if (!guessArray || !answerArray) return "none";
      if (guessArray.length === 0 || answerArray.length === 0) return "none";

      const hasExactMatch = guessArray.some((item) =>
        answerArray.includes(item)
      );
      const isExactSame =
        guessArray.length === answerArray.length &&
        guessArray.every((item) => answerArray.includes(item));

      if (isExactSame) return "exact";
      if (hasExactMatch) return "partial";
      return "none";
    },

    compareNumber(guess: number, answer: number, threshold: number = 500): MatchType {
      if (guess == null || answer == null) return "none";
      if (guess === answer) return "exact";
      if (Math.abs(guess - answer) <= threshold) return "partial";
      return "none";
    },

    compareStarchip(guess: number, answer: number): MatchType {
      if (guess == null || answer == null) return "none";
      if (guess === answer) return "exact";
      if (Math.abs(guess - answer) <= 2) return "partial";
      return "none";
    },

    getMatchClass(matchType: MatchType): string {
      if (matchType === "exact") return "match-exact";
      if (matchType === "partial") return "match-partial";
      return "match-none";
    },

    // 根据匹配类型返回 u-tag 的类型
    getTagType(matchType: MatchType): string {
      if (matchType === "exact") return "success";
      if (matchType === "partial") return "warning";
      return "info";
    },

    playAgain() {
      this.initGame();
    },

    startDailyChallenge() {
      this.initGame();
      uni.showToast({
        title: "每日挑战已开始",
        icon: "success",
      });
    },

    showStats() {
      uni.showToast({
        title: "统计功能开发中",
        icon: "none",
      });
    },

    showHint() {
      if (this.answer) {
        uni.showToast({
          title: `提示：属性是${this.answer.attributeName}`,
          icon: "none",
          duration: 2000,
        });
      }
    },

    surrender() {
      uni.showModal({
        title: "确认投降？",
        content: "投降后将显示正确答案",
        success: (res) => {
          if (res.confirm) {
            this.showFailModal = true;
          }
        },
      });
    },

    showSettings() {
      uni.showToast({
        title: "设置功能开发中",
        icon: "none",
      });
    },

    shareResult() {
      uni.showToast({
        title: "分享功能开发中",
        icon: "none",
      });
    },

    generateImage() {
      uni.showToast({
        title: "生成长图功能开发中",
        icon: "none",
      });
    },
  },
});
</script>

<style lang="scss">
page {
  background-color: #f5f7fa;
}
</style>

<style lang="scss" scoped>
.container {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 40rpx;
}

// 自定义导航栏
.custom-navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20rpx 30rpx;
  // padding-top: calc(20rpx + var(--status-bar-height));

  .navbar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 88rpx;

    .navbar-title {
      font-size: 40rpx;
      font-weight: bold;
      color: #ffffff;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 30rpx;

      .nav-icon {
        font-size: 44rpx;
      }
    }
  }
}

// 顶部按钮组
.top-actions {
  display: flex;
  justify-content: space-around;
  padding: 30rpx;
  gap: 20rpx;
}

// 卡片基础样式
.card {
  background: white;
  border-radius: 24rpx;
  padding: 30rpx;
  margin: 0 30rpx 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.08);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
}

// 卡片头部
.card-header {
  display: flex;
  align-items: center;
  gap: 15rpx;
  // margin-bottom: 20rpx;

  .card-icon {
    font-size: 36rpx;
  }

  .card-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
}

// 剩余次数卡片
.attempts-card {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border: 2rpx solid #667eea20;
}

// 剩余次数
.attempts-info {
  display: flex;
  align-items: baseline;
  justify-content: center;
  // padding: 20rpx 0;

  .attempts-number {
    font-size: 80rpx;
    font-weight: bold;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .attempts-total {
    font-size: 40rpx;
    color: #999;
    margin-left: 10rpx;
  }
}

// 输入卡片
.input-card {
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.12);
}

// 输入区域
.input-wrapper {
  position: relative;
}

// 搜索建议列表
.suggestions-list {
  position: absolute;
  top: 90rpx;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
  max-height: 500rpx;
  overflow-y: auto;
  z-index: 100;
  margin-top: 10rpx;
  border: 1rpx solid #f0f0f0;

  .suggestion-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 30rpx;
    border-bottom: 1px solid #f5f5f5;
    transition: all 0.3s ease;

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background: linear-gradient(to right, #f5f7ff, #ffffff);
      transform: translateX(4rpx);
    }

    .suggestion-name {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }

    .suggestion-tags {
      display: flex;
      gap: 8rpx;
    }
  }
}

// 历史区域
.history-section {
  padding: 20rpx 30rpx;

  .section-title {
    display: flex;
    align-items: center;
    gap: 15rpx;
    margin-bottom: 20rpx;

    .title-icon {
      font-size: 36rpx;
    }

    .title-text {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .empty-state {
    text-align: center;
    padding: 80rpx 0;

    .empty-icon {
      font-size: 80rpx;
      display: block;
      margin-bottom: 20rpx;
    }

    .empty-text {
      font-size: 28rpx;
      color: #999;
    }
  }

  .history-card {
    margin-bottom: 20rpx;

    .card {
      margin: 0;
      background: linear-gradient(to bottom right, #ffffff, #fafbff);
      border-left: 4rpx solid #667eea;
      box-shadow: 0 6rpx 20rpx rgba(102, 126, 234, 0.1);

      &:hover {
        box-shadow: 0 8rpx 28rpx rgba(102, 126, 234, 0.15);
      }
    }

    .pokemon-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25rpx;
      padding-bottom: 20rpx;
      border-bottom: 2rpx solid #f0f0f0;

      .pokemon-name {
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    .pokemon-details {
      .detail-row {
        display: flex;
        align-items: flex-start;
        margin-bottom: 20rpx;
        flex-wrap: wrap;

        .detail-label {
          font-size: 28rpx;
          color: #666;
          min-width: 120rpx;
          line-height: 56rpx;
          font-weight: 500;
        }

        .tags-group {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 10rpx;
        }
      }
    }
  }
}

// 弹窗内容
.modal-content {
  padding: 30rpx 20rpx;

  .modal-icon {
    text-align: center;
    font-size: 120rpx;
    margin-bottom: 20rpx;
    animation: bounce 0.6s ease;
  }

  .modal-title {
    font-size: 40rpx;
    font-weight: bold;
    text-align: center;
    color: #333;
    margin-bottom: 15rpx;
  }

  .modal-subtitle {
    font-size: 32rpx;
    font-weight: bold;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 30rpx;
  }

  .answer-details {
    background: linear-gradient(135deg, #f5f7fa 0%, #fafbff 100%);
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    border: 1rpx solid #e8ecf5;

    .answer-row {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 10rpx;
      margin-bottom: 20rpx;
    }

    .answer-text {
      font-size: 26rpx;
      color: #666;
      line-height: 50rpx;
      text-align: left;
    }
  }

  .modal-actions {
    display: flex;
    flex-direction: column;
    gap: 15rpx;
  }
}

// 弹窗动画
@keyframes bounce {

  0%,
  100% {
    transform: scale(0.8);
    opacity: 0;
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

// 提示弹窗样式
.tip-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-top: 20rpx;
  margin-bottom: 10rpx;

  &:first-child {
    margin-top: 0;
  }
}

.tip-text,
.tip-item {
  font-size: 26rpx;
  color: #666;
  line-height: 48rpx;
  margin-bottom: 8rpx;
}

.tip-item {
  padding-left: 10rpx;
}
</style>
