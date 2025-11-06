<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-content">
        <text class="navbar-title">宝可猜谜</text>
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
        <u-search v-model="guessInput" placeholder="请输入宝可梦名称..." :show-action="false" shape="round"
          @search="submitGuess" @change="handleSearchChange"></u-search>

        <!-- 搜索建议列表 -->
        <view v-if="showSuggestions && filteredPokemonList.length > 0" class="suggestions-list">
          <view v-for="(pokemon, index) in filteredPokemonList" :key="index" class="suggestion-item"
            @click="selectPokemon(pokemon)">
            <text class="suggestion-name">{{ pokemon.cardName }}</text>
            <view class="suggestion-tags">
              <u-tag v-for="(type, i) in pokemon.speciesName" :key="i" :text="type" size="mini" type="info"
                plain></u-tag>
            </view>
          </view>
        </view>

        <u-button type="primary" :custom-style="{ marginTop: '20rpx' }" @click="submitGuess" size="large"
          shape="circle">
          确定提交
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
            <text class="pokemon-name">{{ record.pokemon.name }}</text>
            <u-tag :text="`第${guessRecords.length - index}次`" type="primary" plain size="mini"></u-tag>
          </view>

          <view class="pokemon-details">
            <!-- 世代 -->
            <view class="detail-row">
              <text class="detail-label">世代：</text>
              <u-tag :text="record.pokemon.generation" :type="getTagType(record.matches.generation)"
                size="default"></u-tag>
            </view>

            <!-- 属性 -->
            <view class="detail-row">
              <text class="detail-label">属性：</text>
              <view class="tags-group">
                <u-tag v-for="(type, i) in record.pokemon.types" :key="i" :text="type"
                  :type="getTagType(record.matches.types)" size="default"></u-tag>
              </view>
            </view>

            <!-- 特性 -->
            <view class="detail-row">
              <text class="detail-label">特性：</text>
              <view class="tags-group">
                <u-tag v-for="(ability, i) in record.pokemon.abilities" :key="i" :text="ability"
                  :type="getTagType(record.matches.abilities)" size="mini"></u-tag>
              </view>
            </view>

            <!-- 进化阶段 -->
            <view class="detail-row">
              <text class="detail-label">进化：</text>
              <u-tag :text="`${record.pokemon.evolutionStage}阶进化`" :type="getTagType(record.matches.evolutionStage)"
                size="default"></u-tag>
            </view>

            <!-- 进化条件 -->
            <view class="detail-row">
              <text class="detail-label">方式：</text>
              <u-tag :text="record.pokemon.evolutionLevel" :type="getTagType(record.matches.evolutionLevel)"
                size="default"></u-tag>
            </view>

            <!-- 体形 -->
            <view class="detail-row">
              <text class="detail-label">体形：</text>
              <u-tag :text="record.pokemon.bodyShape" :type="getTagType(record.matches.bodyShape)"
                size="default"></u-tag>
            </view>

            <!-- 颜色 -->
            <view class="detail-row">
              <text class="detail-label">颜色：</text>
              <u-tag :text="record.pokemon.color" :type="getTagType(record.matches.color)" size="default"></u-tag>
            </view>

            <!-- 蛋群 -->
            <view class="detail-row">
              <text class="detail-label">蛋群：</text>
              <view class="tags-group">
                <u-tag v-for="(group, i) in record.pokemon.eggGroups" :key="i" :text="group"
                  :type="getTagType(record.matches.eggGroups)" size="mini"></u-tag>
              </view>
            </view>
            <!-- 种族值 -->
            <view class="detail-row">
              <text class="detail-label">种族值：</text>
              <u-tag :text="String(record.pokemon.baseStats)" :type="getTagType(record.matches.baseStats)"
                size="default"></u-tag>
            </view>
          </view>
        </view>
      </view>
    </view>
    <u-modal v-model="showTipModal" :show-cancel-button="false" :show-confirm-button="false">
      <view class="modal-content">
        游戏提示:
        通过输入宝可梦名称进行猜测，找出目标宝可梦。每次猜测后，你将获得输入宝可梦的相关信息，帮助你逐步接近答案
        提示颜色说明:
        正确
        ■接近■错误
        的触发条件:
        賎蔹圖兆芽餾恃族值总和:与目标宝可梦的差值≤50单项种族值:与目标宝可梦的差值≤10世代:与目标世代相邻
        进化方式:不完全相同但属于相似进化方式(例如同为等级进化、道具进化、亲密度进化等)
        形态标签:两只宝可梦都有地区形态或特殊形态，但具体类型溸月人同
        上下箭头的作用:
        在种族值总和、单项种族值、世代等数值类信息中，箭头提示你猜测的方向是否正确:
        表示你输入的宝可梦的该数值低于目标宝可梦个:
        〗蘗媂害:表示你输入的宝可梦的该数值高于目标宝可梦

      </view>
    </u-modal>
    <!-- 成功弹窗 -->
    <u-modal v-model="showSuccessModal" :show-cancel-button="false" :show-confirm-button="false">
      <view class="modal-content">
        <view class="modal-icon success">✅</view>
        <view class="modal-title">你获得了胜利！</view>
        <view class="modal-subtitle" v-if="answer">{{ answer.name }}</view>

        <view class="answer-details" v-if="answer">
          <view class="answer-row">
            <u-tag :text="answer.generation" type="success"></u-tag>
            <u-tag v-for="(type, i) in answer.types" :key="i" :text="type" type="success"></u-tag>
          </view>
          <view class="answer-text">
            {{ answer.evolutionStage }}阶进化 · {{ answer.evolutionLevel }}
          </view>
          <view class="answer-text">
            特性：{{ answer.abilities.join("、") }}
          </view>
          <view class="answer-text">
            体形：{{ answer.bodyShape }} · 颜色：{{ answer.color }}
          </view>
          <view class="answer-text">
            蛋群：{{ answer.eggGroups.join("、") }} · 种族值：{{ answer.baseStats }}
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
        <view class="modal-subtitle" v-if="answer">正确答案是：{{ answer.name }}</view>

        <view class="answer-details" v-if="answer">
          <view class="answer-row">
            <u-tag :text="answer.generation" type="success"></u-tag>
            <u-tag v-for="(type, i) in answer.types" :key="i" :text="type" type="success"></u-tag>
          </view>
          <view class="answer-text">
            种族值：{{ answer.baseStats }}
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
      answer: null as Pokemon | null,
      guessInput: "",
      guessRecords: [] as GuessRecord[],
      remainingAttempts: 10,
      maxAttempts: 10,
      showTipModal: false,
      showSuccessModal: false,
      showFailModal: false,
      showSuggestions: false,
      filteredPokemonList: [] as Pokemon[],
      lock: false
    };
  },
  async onLoad() {
    this.queryCards();

    this.initGame();
  },
  methods: {
    async queryCards(keyword = '') {
      try {
        const input: CardInput = {
          params: {
            page: 1,
            pageSize: 10,
            keyword
            // speciesList: [14],
          },
        }
        const res: any = await service.getCard(input);
        if (res.result.code === 200000 && res.response.cardList && res.response.cardList.length > 0) {
          this.filteredPokemonList = res.response.cardList;
        }
      } catch (error) {
        console.error('查询卡片失败:', error);
      } finally {
        this.lock = false;
        this.showSuggestions = this.filteredPokemonList.length > 0; // 根据过滤后的列表是否为空来决定是否显示建议列表
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

    // 选择建议的宝可梦
    selectPokemon(pokemon: Pokemon) {
      this.guessInput = pokemon.name;
      this.showSuggestions = false;
      this.filteredPokemonList = [];
    },

    submitGuess() {
      if (!this.guessInput.trim()) {
        uni.showToast({
          title: "请输入宝可梦名称",
          icon: "none",
        });
        return;
      }

      const guessPokemon = searchPokemonByName(this.guessInput.trim());
      if (!guessPokemon) {
        uni.showToast({
          title: "未找到该宝可梦",
          icon: "none",
        });
        return;
      }

      if (
        this.guessRecords.some((r) => r.pokemon.name === guessPokemon.name)
      ) {
        uni.showToast({
          title: "已经猜过该宝可梦了",
          icon: "none",
        });
        return;
      }

      const matches = this.compareAttributes(guessPokemon, this.answer!);

      this.guessRecords.unshift({
        pokemon: guessPokemon,
        matches: matches,
      });
      console.log(this.guessRecords, '---1-1-');

      this.remainingAttempts--;
      this.guessInput = "";

      if (guessPokemon.name === this.answer!.name) {
        setTimeout(() => {
          this.showSuccessModal = true;
        }, 500);
        return;
      }

      if (this.remainingAttempts <= 0) {
        setTimeout(() => {
          this.showFailModal = true;
        }, 500);
        return;
      }
    },

    compareAttributes(guess: Pokemon, answer: Pokemon) {
      return {
        generation: this.compareExact(guess.generation, answer.generation),
        types: this.compareArray(guess.types, answer.types),
        abilities: this.compareArray(guess.abilities, answer.abilities),
        evolutionStage: this.compareExact(
          guess.evolutionStage,
          answer.evolutionStage
        ),
        evolutionLevel: this.compareExact(
          guess.evolutionLevel,
          answer.evolutionLevel
        ),
        bodyShape: this.compareExact(guess.bodyShape, answer.bodyShape),
        color: this.compareExact(guess.color, answer.color),
        eggGroups: this.compareArray(guess.eggGroups, answer.eggGroups),
        baseStats: this.compareNumber(guess.baseStats, answer.baseStats),
      };
    },

    compareExact(guess: any, answer: any): MatchType {
      return guess === answer ? "exact" : "none";
    },

    compareArray(guessArray: any[], answerArray: any[]): MatchType {
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

    compareNumber(guess: number, answer: number): MatchType {
      if (guess === answer) return "exact";
      if (Math.abs(guess - answer) <= 50) return "partial";
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
          title: `提示：世代是${this.answer.generation}`,
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
</style>
