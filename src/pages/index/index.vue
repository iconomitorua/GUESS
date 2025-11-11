<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-content">
        <text class="navbar-title">游戏王猜谜</text>
        <view class="navbar-actions">
          <u-icon name="reload" color="#fff" size="24" @click="reloadGame"></u-icon>
          <u-icon name="question-circle" color="#fff" size="24" @click="showTipModal = true"></u-icon>
          <u-icon name="setting" color="#fff" size="24" @click="showSettings"></u-icon>
        </view>
      </view>
    </view>

    <!-- 顶部按钮组 -->
    <view class="top-actions">
      <u-button type="primary" @click="showHint" shape="circle" size="small" plain>提示</u-button>
      <u-button type="error" @click="surrender" shape="circle" size="small" plain>投降</u-button>
    </view>

    <!-- 剩余次数显示 -->
    <view class="attempts-display">
      <text class="attempts-label">剩余次数</text>
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
          <view v-for="(cardInfo, index) in filteredPokemonList" :key="index" class="suggestion-item"
            @click="selectPokemon(cardInfo)">
            <text class="suggestion-name" @click="selectCard">{{ cardInfo.cardName }}</text>
            <!-- <view class="suggestion-tags">
              <u-tag v-for="(type, i) in cardInfo.speciesName" :key="i" :text="type" size="mini" type="info"
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
          <view class="cardInfo-header">
            <view class="cardInfo-name">
              <view class="name">{{ record.cardInfo.cardName }}</view>
              <view class="times">第{{ guessRecords.length - index }}次</view>
            </view>
            <view class="cardInfo-box">
              <img class="card-img"
                :src="`https://yxwdbapi.windoent.com/konami/getImageAction?type=1&ciid=1&cid=${record.cardInfo.cardId}&enc=${record.cardInfo.imageKey}&lang=cn`"
                alt="">
              <view class="right">
                <!-- 属性比较 -->
                <view class="compare-item"
                  v-if="record.cardInfo.attributeName !== '魔法' && record.cardInfo.attributeName !== '陷阱'">
                  <text class="compare-label">属性:</text>
                  <view :class="['compare-value', getMatchClass(record.matches.attributeName)]">
                    {{ record.cardInfo.attributeName || '无' }}
                  </view>
                </view>
                <!-- 种族比较 -->
                <view class="compare-item" v-if="record.cardInfo.speciesName">
                  <text class="compare-label">种族:</text>
                  <view :class="['compare-value', getMatchClass(record.matches.speciesName)]">
                    {{ record.cardInfo.speciesName }}
                  </view>
                </view>

                <!-- 星级比较 -->
                <view class="compare-item"
                  v-if="record.cardInfo.starchip !== null && record.cardInfo.starchip !== undefined">
                  <text class="compare-label">星级/阶级:</text>
                  <view :class="['compare-value', getMatchClass(record.matches.starchip)]">
                    {{ record.cardInfo.starchip }}
                    <text v-if="answer.starchip && record.cardInfo.starchip !== answer.starchip"
                      class="arrow-indicator">
                      {{ getAtkDefArrow(record.cardInfo.starchip, answer.starchip) }}
                    </text>
                  </view>
                </view>

                <!-- 攻击力比较 -->
                <view class="compare-item" v-if="record.cardInfo.atk !== null && record.cardInfo.atk !== undefined">
                  <text class="compare-label">攻击:</text>
                  <view :class="['compare-value', getMatchClass(record.matches.atk)]">
                    {{ record.cardInfo.atk < 0 ? 0 : record.cardInfo.atk }} <text
                      v-if="answer.atk !== null && record.cardInfo.atk !== answer.atk" class="arrow-indicator">
                      {{ getAtkDefArrow(record.cardInfo.atk, answer.atk) }}
                      </text>
                  </view>
                </view>

                <!-- 防御力比较 -->
                <view class="compare-item" v-if="record.cardInfo.def !== null && record.cardInfo.def !== undefined">
                  <text class="compare-label">防御:</text>
                  <view :class="['compare-value', getMatchClass(record.matches.def)]">
                    {{ record.cardInfo.def < 0 ? 0 : record.cardInfo.def }} <text
                      v-if="answer.def !== null && record.cardInfo.def !== answer.def" class="arrow-indicator">
                      {{ getAtkDefArrow(record.cardInfo.def, answer.def) }}
                      </text>
                  </view>
                </view>

                <!-- 类型比较 -->
                <view class="compare-item"
                  v-if="record.cardInfo.otherItemNameList && record.cardInfo.otherItemNameList.length > 0">
                  <text class="compare-label">类型:</text>
                  <view :class="['compare-value', getMatchClass(record.matches.otherItemNameList)]">
                    {{ record.cardInfo.otherItemNameList.join('、') }}
                  </view>
                </view>

                <!-- 灵摆刻度比较 -->
                <view class="compare-item"
                  v-if="record.cardInfo.penScale !== null && record.cardInfo.penScale !== undefined">
                  <text class="compare-label">灵摆:</text>
                  <view :class="['compare-value', getMatchClass(record.matches.penScale)]">
                    {{ record.cardInfo.penScale }}
                  </view>
                </view>

                <!-- 连接数比较 -->
                <view class="compare-item"
                  v-if="record.cardInfo.linkMarkerCount !== null && record.cardInfo.linkMarkerCount !== undefined">
                  <text class="compare-label">Link:</text>
                  <view :class="['compare-value', getMatchClass(record.matches.linkMarkerCount)]">
                    {{ record.cardInfo.linkMarkerCount }}
                  </view>
                </view>
                <!-- 连接方位 -->
                <view class="compare-item"
                  v-if="record.cardInfo.linkMarker !== null && record.cardInfo.linkMarker !== undefined">
                  <view class="direction-grid">
                    <!-- 9宫格方向选择 -->
                    <view v-for="(dir, index) in linkDirections" :key="index"
                      :class="['direction-btn', { 'selected': record.cardInfo.linkMarker.includes(dir.value), 'center': dir.value === '5' }]">
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <u-modal :show="showTipModal" :show-cancel-button="false" :show-confirm-button="false" :closeOnClickOverlay="true">
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
    <u-modal :show="showSuccessModal" :show-cancel-button="false" :show-confirm-button="false"
      :closeOnClickOverlay="true">
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
    <u-modal :show="showFailModal" :show-cancel-button="false" :show-confirm-button="false" :closeOnClickOverlay="true">
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

    <!-- 设置弹窗 -->
    <u-modal :show="showSettingsModal" :show-cancel-button="false" :show-confirm-button="false"
      :closeOnClickOverlay="true">
      <view class="settings-content">
        <view class="settings-header">
          <text class="settings-title">设置</text>
        </view>

        <!-- 卡片类型选择 -->
        <view class="setting-section">
          <text class="setting-label">卡片类型</text>
          <view class="card-type-buttons">
            <view v-for="(type, index) in cardTypeOptions" :key="index"
              :class="['type-button', { active: selectedCardType === type }]" @click="selectedCardType = type">
              {{ type }}
            </view>
          </view>
        </view>

        <!-- 怪兽类型选择（仅当选择怪兽时显示） -->
        <view class="setting-section" v-if="selectedCardType === '怪兽'">
          <text class="setting-label">怪兽类型</text>
          <view class="monster-type-grid">
            <view v-for="(type, index) in monsterTypeOptions" :key="index"
              :class="['monster-type-button', { active: selectedMonsterType === type }]"
              @click="selectedMonsterType = type">
              {{ type }}
            </view>
          </view>
        </view>

        <!-- 最大猜测次数 -->
        <view class="setting-section">
          <text class="setting-label">最大猜测次数 (5-20)</text>
          <u-input v-model="maxAttempts" type="number" :min="5" :max="20" placeholder="请输入最大猜测次数"></u-input>
        </view>

        <!-- 按钮组 -->
        <view class="settings-actions">
          <u-button type="info" size="medium" @click="showSettingsModal = false" plain>取消</u-button>
          <u-button type="primary" size="medium" @click="saveSettings">保存</u-button>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import { Pokemon, GuessRecord, MatchType } from "./data";
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
      showSettingsModal: false,
      showSuggestions: false,
      selected: false,
      hasScreening: false,
      filteredPokemonList: [] as Pokemon[],
      lock: false,
      currentCard: {} as any,
      callbackIndex: 0,
      totalNum: 0,
      // 设置项
      selectedCardType: "怪兽", // 魔法、陷阱、怪兽
      selectedMonsterType: "全部", // 全部、效果、通常、特殊召唤等
      cardTypeOptions: ["魔法", "陷阱", "怪兽"],
      monsterTypeOptions: [
        "全部",
        "效果",
        "通常",
        "特殊召唤",
        "协调",
        "反转",
        "灵魂",
        "灵摆",
        "连接",
        "仪式",
        "融合",
        "同步",
        "超量",
      ],
      linkDirections: [
        { value: '7' }, { value: '8' }, { value: '9' },
        { value: '4' }, { value: '5' }, { value: '6' },
        { value: '1' }, { value: '2' }, { value: '3' },
      ],
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
            keyword,

          },
        }
        const res: any = await service.getCard(input);
        if (res.result.code === 200 && res.response.cardList) {
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
          this.totalNum = totalNum;
          this.queryCardById(totalNum)
        }
      } catch (error) {
        console.error('获取统计数据失败:', error);
      } finally {
      }
    },
    //用id查询
    async queryCardById(max: number, hasScreening = false) {
      try {
        //id从1-max随机取一个
        const id = Math.floor(Math.random() * max) + 1;
        const res: any = await service.getCardById(id);
        if (res.code === 200) {
          if (res.response.card.id) {
            if (hasScreening) {
              if (this.selectedCardType === '怪兽') {
                if (res.response.card.attributeName !== '魔法' && res.response.card.attributeName !== '陷阱') {
                  if (this.selectedMonsterType === '全部') { this.answer = res.response.card; }
                  else if (res.response.card.otherItemNameList.includes(this.selectedMonsterType)) { this.answer = res.response.card; }
                  else this.queryCardById(max, hasScreening);
                }
                else this.queryCardById(max, hasScreening);
              } else if (this.selectedCardType === res.response.card.attributeName) { this.answer = res.response.card; }
              else this.queryCardById(max, hasScreening);
              this.showSettingsModal = false;//关闭设置弹窗
            }
            else this.answer = res.response.card;
          }

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
      } catch (error) {
        console.error('查询卡片失败:', error);
      } finally {
      }
    },
    initGame(isTrue = false) {
      if (isTrue) this.queryCardById(this.totalNum, true);
      this.selected = false;
      this.guessRecords = [];
      this.remainingAttempts = this.maxAttempts;
      this.guessInput = "";
      this.showSuccessModal = false;
      this.showFailModal = false;
      this.showSuggestions = false;
      this.filteredPokemonList = [];
      // console.log("答案是：", this.answer.cardName);
    },
    //卡片类型
    switchCardType(type: string) {
      switch (type) {
        case '魔法':
          return '魔法';
        case '陷阱':
          return '陷阱';
        default:
          return '怪兽'
      }
    },
    // 处理搜索输入变化
    handleSearchChange(value: string) {
      if (this.selected) return
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
    selectPokemon(cardInfo: Pokemon) {
      this.selected = true;
      this.guessInput = cardInfo.cardName;
      this.currentCard = cardInfo;
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
      this.guessRecords.unshift({
        cardInfo: this.currentCard,
        matches: matches
      });

      this.remainingAttempts--;
      this.guessInput = "";
      this.currentCard = {};
      this.showSuggestions = false;
      this.selected = false;
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
        speciesName: this.compareExact(guess.speciesName, answer.speciesName),
        starchip: this.compareStarchip(guess.starchip, answer.starchip),
        atk: this.compareNumber(guess.atk, answer.atk, 500),
        def: this.compareNumber(guess.def, answer.def, 500),
        otherItemNameList: this.compareArray(guess.otherItemNameList, answer.otherItemNameList),
        penScale: this.compareExact(guess.penScale, answer.penScale),
        linkMarkerCount: this.compareStarchip(guess.linkMarkerCount, answer.linkMarkerCount),
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

      // 处理字符串情况
      if (typeof guessArray === 'string') {
        return guessArray === answerArray ? "exact" : "none";
      }

      // 检查是否完全匹配
      const isExactSame =
        guessArray.length === answerArray.length &&
        guessArray.every(item => answerArray.includes(item)) &&
        answerArray.every(item => guessArray.includes(item));

      if (isExactSame) return "exact";

      // 检查是否有部分匹配
      const hasPartialMatch = guessArray.some(item => answerArray.includes(item));

      if (hasPartialMatch) return "partial";

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

    // 获取攻防力箭头指示器
    getAtkDefArrow(guessValue: number, answerValue: number): string {
      if (guessValue == null || answerValue == null) return "";
      if (guessValue === answerValue) return "";

      const diff = Math.abs(guessValue - answerValue);
      // 只在差值在500以内且不相等时显示箭头
      if (diff > 0 && diff <= 500) {
        return guessValue < answerValue ? "↑" : "↓";
      }
      // 差值大于500时也显示箭头
      if (diff > 500) {
        return guessValue < answerValue ? "⬆" : "⬇";
      }
      return "";
    },

    playAgain() {
      this.initGame(true);
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
    reloadGame() {
      this.selectedCardType = '怪兽';
      this.selectedMonsterType = '全部'
      this.initGame();
      this.queryCardById(this.totalNum)
    },
    showSettings() {
      this.showSettingsModal = true;
    },

    saveSettings() {
      // 保存设置并重新初始化游戏
      this.hasScreening = true;
      // uni.showLoading({
      //   title: '初始化中...',
      // })
      this.initGame(true);
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
  justify-content: center;
  padding: 20rpx 30rpx;
  gap: 20rpx;
}

// 剩余次数显示
.attempts-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 30rpx 20rpx;
  padding: 20rpx 30rpx;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-radius: 16rpx;
  border: 2rpx solid #667eea20;

  .attempts-label {
    font-size: 28rpx;
    font-weight: 500;
    color: #666;
  }

  .attempts-info {
    display: flex;
    align-items: baseline;

    .attempts-number {
      font-size: 48rpx;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .attempts-total {
      font-size: 28rpx;
      color: #999;
      margin-left: 8rpx;
    }
  }
}

// 卡片基础样式
.card {
  background: white;
  border-radius: 20rpx;
  padding: 25rpx;
  margin: 0 30rpx 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.08);
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

  .card-icon {
    font-size: 36rpx;
  }

  .card-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
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
    gap: 10rpx;
    margin-bottom: 20rpx;

    .title-icon {
      font-size: 28rpx;
    }

    .title-text {
      font-size: 28rpx;
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
    margin-bottom: 15rpx;

    .card {
      margin: 0;
      background: white;
      border-left: 4rpx solid #667eea;
      box-shadow: 0 2rpx 12rpx rgba(102, 126, 234, 0.08);
    }

    .cardInfo-header {
      margin-bottom: 20rpx;
      padding-bottom: 15rpx;
      border-bottom: 1rpx solid #f0f0f0;

      .cardInfo-name {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
        @include flex_between();

        .times {
          color: #08979c;
          background: #e6fffb;
          border: 1rpx solid #87e8de;
          margin-left: 10rpx;
          font-size: 24rpx;
          padding: 0 10rpx;
          border-radius: 8rpx;
        }
      }

      .cardInfo-box {
        display: flex;
        margin-top: 20rpx;

        .card-img {
          width: 192rpx;
          height: 280rpx;
        }

        .right {
          flex: 1;
          margin-left: 20rpx;
          display: flex;
          flex-direction: column;
          gap: 10rpx;

          .compare-item {
            display: flex;
            align-items: center;
            font-size: 26rpx;
            gap: 10rpx;

            .compare-label {
              color: #666;
              font-weight: 500;
              min-width: 80rpx;
            }

            .compare-value {
              flex: 1;
              padding: 8rpx 16rpx;
              border-radius: 8rpx;
              font-weight: 500;
              display: flex;
              align-items: center;
              justify-content: space-between;
              transition: all 0.3s ease;

              .arrow-indicator {
                font-size: 28rpx;
                font-weight: bold;
                margin-left: 8rpx;
              }

              // 完全匹配 - 绿底
              &.match-exact {
                background: #52c41a;
                color: #fff;
              }

              // 部分匹配/相近 - 橙底
              &.match-partial {
                background: #fa8c16;
                color: #fff;
              }

              // 不匹配 - 灰底
              &.match-none {
                background: #d9d9d9;
                color: #595959;
              }

              .direction-grid {
                display: grid;
                grid-template-columns: repeat(3, 60rpx);
                grid-template-rows: repeat(3, 60rpx);
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
            }
          }
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

// 设置弹窗样式
.settings-content {
  padding: 40rpx 30rpx;
  max-height: 80vh;
  overflow-y: auto;

  .settings-header {
    text-align: center;
    margin-bottom: 30rpx;

    .settings-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
    }
  }

  .setting-section {
    margin-bottom: 35rpx;

    .setting-label {
      display: block;
      font-size: 28rpx;
      font-weight: 500;
      color: #666;
      margin-bottom: 15rpx;
    }

    .card-type-buttons {
      display: flex;
      gap: 15rpx;
      justify-content: space-between;

      .type-button {
        flex: 1;
        padding: 20rpx;
        text-align: center;
        background: #f5f7fa;
        border-radius: 12rpx;
        font-size: 28rpx;
        color: #666;
        transition: all 0.3s ease;
        border: 2rpx solid transparent;

        &.active {
          background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
          color: #667eea;
          border-color: #667eea;
          font-weight: bold;
        }

        &:active {
          transform: scale(0.95);
        }
      }
    }

    .monster-type-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12rpx;

      .monster-type-button {
        padding: 16rpx 8rpx;
        text-align: center;
        background: #f5f7fa;
        border-radius: 10rpx;
        font-size: 24rpx;
        color: #666;
        transition: all 0.3s ease;
        border: 2rpx solid transparent;

        &.active {
          background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
          color: #667eea;
          border-color: #667eea;
          font-weight: bold;
        }

        &:active {
          transform: scale(0.95);
        }
      }
    }
  }

  .settings-actions {
    display: flex;
    gap: 20rpx;
    margin-top: 40rpx;
  }
}
</style>
