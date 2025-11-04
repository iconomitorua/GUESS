<template>
  <view class="guess-image">
    <!-- 顶部导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-content">
        <text class="navbar-title">图片猜谜</text>
        <view class="navbar-actions">
          <text class="nav-icon" @click="resetGame">🔄</text>
        </view>
      </view>
    </view>

    <!-- 模式切换 -->
    <view class="mode-switch">
      <view class="switch-buttons">
        <view class="switch-btn" :class="{ active: gameMode === 'mosaic' }" @click="switchMode('mosaic')">
          <text class="btn-icon">🎨</text>
          <text class="btn-text">马赛克模式</text>
        </view>
        <view class="switch-btn" :class="{ active: gameMode === 'partial' }" @click="switchMode('partial')">
          <text class="btn-icon">🔍</text>
          <text class="btn-text">局部显示模式</text>
        </view>
      </view>
    </view>

    <!-- 信息卡片 -->
    <view class="info-cards">
      <view class="info-card">
        <text class="info-label">剩余次数</text>
        <text class="info-value">{{ remainingAttempts }}</text>
      </view>
      <view class="info-card">
        <text class="info-label">已猜次数</text>
        <text class="info-value">{{ guessCount }}</text>
      </view>
    </view>

    <!-- 难度调整 -->
    <view class="card difficulty-card">
      <view class="card-header">
        <text class="card-icon">⚙️</text>
        <text class="card-title">{{ gameMode === 'mosaic' ? '马赛克程度' : '显示块大小' }}</text>
      </view>
      <view class="slider-container">
        <slider v-if="gameMode === 'mosaic'" :value="mosaicLevel" :min="5" :max="30" :step="1" @change="onMosaicChange"
          activeColor="#667eea" block-size="20" />
        <slider v-else :value="blockSize" :min="30" :max="120" :step="10" @change="onBlockSizeChange"
          activeColor="#667eea" block-size="20" />
        <text class="slider-value">{{ gameMode === 'mosaic' ? mosaicLevel : blockSize }}</text>
      </view>
    </view>

    <!-- 图片显示区域 -->
    <view class="card image-card">
      <view class="image-container">
        <!-- Canvas 绘制原图 -->
        <canvas canvas-id="pokemonCanvas" class="pokemon-canvas"
          :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"></canvas>

        <!-- 隐藏的图片用于加载 -->
        <image :src="currentPokemon.imageUrl" class="hidden-image" @load="onImageLoad" @error="onImageError"
          mode="aspectFit" />
      </view>
      <!-- 调试按钮 -->
      <view class="debug-buttons">
        <u-button type="warning" size="small" @click="showAnswer" plain>查看答案（测试）</u-button>
        <u-button type="info" size="small" @click="redrawImage" plain>重新绘制</u-button>
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
            <text class="suggestion-name">{{ pokemon.name }}</text>
          </view>
        </view>

        <u-button type="primary" :custom-style="{ marginTop: '20rpx' }" @click="submitGuess" size="large"
          shape="circle">
          提交答案
        </u-button>
      </view>
    </view>

    <!-- 提示信息 -->
    <view v-if="gameMode === 'partial' && revealedBlocks.length > 0" class="card hint-card">
      <view class="hint-text">
        已显示 {{ revealedBlocks.length }} 个区域
      </view>
    </view>

    <!-- 成功弹窗 -->
    <u-modal v-model="showSuccessModal" :show-cancel-button="false" :show-confirm-button="false">
      <view class="modal-content">
        <view class="modal-icon success">🎉</view>
        <view class="modal-title">恭喜你猜对了！</view>
        <view class="modal-subtitle">{{ currentPokemon.name }}</view>
        <view class="modal-text">用了 {{ guessCount }} 次猜测</view>

        <view class="modal-actions">
          <u-button type="primary" size="medium" @click="resetGame" block>
            <u-icon name="reload" size="28"></u-icon>
            <text style="margin-left: 10rpx;">再来一次</text>
          </u-button>
        </view>
      </view>
    </u-modal>

    <!-- 失败弹窗 -->
    <u-modal v-model="showFailModal" :show-cancel-button="false" :show-confirm-button="false">
      <view class="modal-content">
        <view class="modal-icon fail">😢</view>
        <view class="modal-title">挑战失败！</view>
        <view class="modal-subtitle">答案是：{{ currentPokemon.name }}</view>

        <view class="modal-actions">
          <u-button type="primary" size="medium" @click="resetGame" block>
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
import { PokemonImage, GameMode } from "./data";
import { getRandomPokemon, searchPokemonByName, pokemonImages } from "./server";

interface RevealedBlock {
  x: number;
  y: number;
}

export default Vue.extend({
  data() {
    return {
      gameMode: 'mosaic' as GameMode,
      currentPokemon: {} as PokemonImage,
      guessInput: "",
      remainingAttempts: 5,
      maxAttempts: 5,
      guessCount: 0,

      // 马赛克模式
      mosaicLevel: 15,

      // 局部显示模式
      blockSize: 60,
      revealedBlocks: [] as RevealedBlock[],

      // Canvas
      canvasWidth: 300,
      canvasHeight: 300,
      imageLoaded: false,

      // 搜索
      showSuggestions: false,
      filteredPokemonList: [] as PokemonImage[],

      // 弹窗
      showSuccessModal: false,
      showFailModal: false,
    };
  },

  onLoad() {
    this.initGame();
  },

  methods: {
    initGame() {
      this.currentPokemon = getRandomPokemon();
      this.guessInput = "";
      this.remainingAttempts = this.maxAttempts;
      this.guessCount = 0;
      this.revealedBlocks = [];
      this.imageLoaded = false;
      this.showSuccessModal = false;
      this.showFailModal = false;
      this.showSuggestions = false;
      this.filteredPokemonList = [];

      console.log("答案是：", this.currentPokemon.name);
    },

    resetGame() {
      this.initGame();
    },

    switchMode(mode: GameMode) {
      this.gameMode = mode;
      this.initGame();
    },

    onImageLoad() {
      console.log("图片加载完成");
      this.imageLoaded = true;
      this.$nextTick(() => {
        this.drawImage();
      });
    },

    onImageError(e: any) {
      console.error("图片加载失败", e);
      uni.showToast({
        title: "图片加载失败",
        icon: "none",
      });
    },

    // 重新绘制图片
    redrawImage() {
      if (this.imageLoaded) {
        this.drawImage();
        uni.showToast({
          title: "已重新绘制",
          icon: "success",
          duration: 1000,
        });
      }
    },

    // 查看答案（测试功能）
    showAnswer() {
      uni.showModal({
        title: "答案",
        content: `当前宝可梦是：${this.currentPokemon.name}`,
        showCancel: false,
      });
    },

    drawImage() {
      const ctx = uni.createCanvasContext('pokemonCanvas', this);

      if (this.gameMode === 'mosaic') {
        this.drawMosaicImage(ctx);
      } else {
        this.drawPartialImage(ctx);
      }

      ctx.draw();
    },

    // 绘制马赛克图片
    drawMosaicImage(ctx: any) {
      const size = this.mosaicLevel;
      const cols = Math.ceil(this.canvasWidth / size);
      const rows = Math.ceil(this.canvasHeight / size);

      // 创建马赛克效果：在每个格子里绘制缩小的图片块，然后覆盖一层半透明色块
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const x = j * size;
          const y = i * size;

          // 绘制该区域的图片片段（会产生模糊效果）
          ctx.drawImage(
            this.currentPokemon.imageUrl,
            x, y, size, size,  // 源图片的裁剪区域
            x, y, size, size   // 目标绘制区域
          );

          // 使用半透明色块覆盖，增强马赛克效果
          const colors = [
            'rgba(100, 100, 120, 0.5)',
            'rgba(120, 120, 140, 0.5)',
            'rgba(140, 140, 160, 0.5)',
            'rgba(80, 80, 100, 0.5)',
          ];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          ctx.setFillStyle(randomColor);
          ctx.fillRect(x, y, size, size);

          // 添加网格线增强马赛克感
          ctx.setStrokeStyle('rgba(200, 200, 200, 0.6)');
          ctx.setLineWidth(1);
          ctx.strokeRect(x, y, size, size);
        }
      }
    },

    // 绘制局部显示图片
    drawPartialImage(ctx: any) {
      // 如果没有显示块，随机显示一个
      if (this.revealedBlocks.length === 0) {
        this.addRevealedBlock();
      }

      // 先绘制完整的原图
      ctx.drawImage(this.currentPokemon.imageUrl, 0, 0, this.canvasWidth, this.canvasHeight);

      // 创建遮罩：通过绘制黑色矩形覆盖非显示区域
      // 使用 globalCompositeOperation 来实现遮罩效果
      ctx.save();

      // 设置合成模式为 destination-out，这样绘制的内容会"挖空"已有内容
      // 先反向操作：我们先创建一个完整的黑色遮罩层，然后在显示块位置挖空
      ctx.setFillStyle('rgba(0, 0, 0, 0.95)');

      // 绘制四个区域来遮罩图片，跳过显示块
      // 这里使用一个简单的方法：遮罩整个画布
      ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      // 使用 destination-out 模式在显示块位置"挖洞"
      ctx.globalCompositeOperation = 'destination-out';

      this.revealedBlocks.forEach(block => {
        ctx.fillRect(block.x, block.y, this.blockSize, this.blockSize);
      });

      ctx.restore();

      // 绘制显示块的边框
      this.revealedBlocks.forEach(block => {
        ctx.setStrokeStyle('#667eea');
        ctx.setLineWidth(3);
        ctx.strokeRect(block.x, block.y, this.blockSize, this.blockSize);

        // 内部浅色边框增强视觉效果
        ctx.setStrokeStyle('rgba(255, 255, 255, 0.3)');
        ctx.setLineWidth(1);
        ctx.strokeRect(block.x + 1, block.y + 1, this.blockSize - 2, this.blockSize - 2);
      });
    },

    // 添加新的显示块
    addRevealedBlock() {
      const maxX = this.canvasWidth - this.blockSize;
      const maxY = this.canvasHeight - this.blockSize;

      // 生成随机位置，确保不重叠
      let newBlock: RevealedBlock;
      let attempts = 0;

      do {
        newBlock = {
          x: Math.floor(Math.random() * maxX / 10) * 10,
          y: Math.floor(Math.random() * maxY / 10) * 10,
        };
        attempts++;
      } while (this.isBlockOverlapping(newBlock) && attempts < 50);

      this.revealedBlocks.push(newBlock);
    },

    // 检查块是否重叠
    isBlockOverlapping(newBlock: RevealedBlock): boolean {
      return this.revealedBlocks.some(block => {
        return Math.abs(block.x - newBlock.x) < this.blockSize &&
          Math.abs(block.y - newBlock.y) < this.blockSize;
      });
    },

    onMosaicChange(e: any) {
      this.mosaicLevel = e.detail.value;
      if (this.imageLoaded) {
        this.drawImage();
      }
    },

    onBlockSizeChange(e: any) {
      this.blockSize = e.detail.value;
      // 清空已显示块，重新开始
      this.revealedBlocks = [];
      if (this.imageLoaded) {
        this.drawImage();
      }
    },

    // 处理搜索输入变化
    handleSearchChange(value: string) {
      if (!value || value.trim() === "") {
        this.showSuggestions = false;
        this.filteredPokemonList = [];
        return;
      }

      const searchTerm = value.toLowerCase();
      this.filteredPokemonList = pokemonImages
        .filter((pokemon) => pokemon.name.toLowerCase().includes(searchTerm))
        .slice(0, 5);

      this.showSuggestions = this.filteredPokemonList.length > 0;
    },

    // 选择建议的宝可梦
    selectPokemon(pokemon: PokemonImage) {
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

      this.guessCount++;
      this.remainingAttempts--;
      this.guessInput = "";
      this.showSuggestions = false;

      // 判断是否猜对
      if (guessPokemon.name === this.currentPokemon.name) {
        setTimeout(() => {
          this.showSuccessModal = true;
        }, 300);
        return;
      }

      // 猜错了
      if (this.remainingAttempts <= 0) {
        setTimeout(() => {
          this.showFailModal = true;
        }, 300);
        return;
      }

      // 局部显示模式：添加新的显示块
      if (this.gameMode === 'partial') {
        this.addRevealedBlock();
        if (this.imageLoaded) {
          this.drawImage();
        }
      } else {
        // 马赛克模式：降低马赛克程度
        this.mosaicLevel = Math.max(5, this.mosaicLevel - 2);
        if (this.imageLoaded) {
          this.drawImage();
        }
      }

      uni.showToast({
        title: "猜错了，再试试！",
        icon: "none",
      });
    },
  },
});
</script>

<style lang="scss">
page {
  background: #f5f7fa;
}
</style>

<style lang="scss" scoped>
.guess-image {
  min-height: 100vh;
  padding-bottom: 40rpx;
}

// 导航栏
.custom-navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20rpx 30rpx;
  padding-top: calc(20rpx + var(--status-bar-height));

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
      .nav-icon {
        font-size: 44rpx;
      }
    }
  }
}

// 模式切换
.mode-switch {
  padding: 30rpx;

  .switch-buttons {
    display: flex;
    gap: 20rpx;

    .switch-btn {
      flex: 1;
      height: 120rpx;
      background: white;
      border-radius: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;

      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transform: scale(1.05);

        .btn-icon,
        .btn-text {
          color: white;
        }
      }

      .btn-icon {
        font-size: 40rpx;
      }

      .btn-text {
        font-size: 24rpx;
        font-weight: 500;
        color: #666;
      }
    }
  }
}

// 信息卡片
.info-cards {
  display: flex;
  gap: 20rpx;
  padding: 0 30rpx 20rpx;

  .info-card {
    flex: 1;
    background: white;
    border-radius: 20rpx;
    padding: 25rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10rpx;

    .info-label {
      font-size: 24rpx;
      color: #999;
    }

    .info-value {
      font-size: 48rpx;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }
}

// 卡片
.card {
  background: white;
  border-radius: 24rpx;
  padding: 30rpx;
  margin: 0 30rpx 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.08);

  .card-header {
    display: flex;
    align-items: center;
    gap: 15rpx;
    margin-bottom: 20rpx;

    .card-icon {
      font-size: 32rpx;
    }

    .card-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }
  }
}

// 难度调整
.difficulty-card {
  .slider-container {
    display: flex;
    align-items: center;
    gap: 20rpx;

    slider {
      flex: 1;
    }

    .slider-value {
      font-size: 28rpx;
      font-weight: bold;
      color: #667eea;
      min-width: 60rpx;
      text-align: right;
    }
  }
}

// 图片区域
.image-card {
  .image-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f5f5f5;
    border-radius: 16rpx;
    overflow: hidden;
    margin-bottom: 20rpx;

    .pokemon-canvas {
      width: 300px;
      height: 300px;
      z-index: 1;
    }

    .hidden-image {
      position: absolute;
      opacity: 1;
      pointer-events: none;
      z-index: 0;
    }
  }

  .debug-buttons {
    display: flex;
    gap: 15rpx;
    justify-content: center;
  }
}

// 输入区域
.input-card {
  .input-wrapper {
    position: relative;
  }
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
  max-height: 400rpx;
  overflow-y: auto;
  z-index: 100;
  margin-top: 10rpx;
  border: 1rpx solid #f0f0f0;

  .suggestion-item {
    padding: 24rpx 30rpx;
    border-bottom: 1px solid #f5f5f5;
    transition: all 0.3s ease;

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background: linear-gradient(to right, #f5f7ff, #ffffff);
    }

    .suggestion-name {
      font-size: 28rpx;
      color: #333;
      font-weight: 500;
    }
  }
}

// 提示卡片
.hint-card {
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  border-left: 4rpx solid #ff9800;

  .hint-text {
    font-size: 26rpx;
    color: #f57c00;
    text-align: center;
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
    margin-bottom: 15rpx;
  }

  .modal-text {
    font-size: 26rpx;
    color: #666;
    text-align: center;
    margin-bottom: 30rpx;
  }

  .modal-actions {
    display: flex;
    flex-direction: column;
    gap: 15rpx;
  }
}

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
