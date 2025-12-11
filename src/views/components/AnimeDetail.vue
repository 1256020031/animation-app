<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast } from 'vant';
import 'vant/lib/index.css';
import { getAnimeDetail } from '@/api/index.js';

const route = useRoute();
const router = useRouter();

// --- 类型定义 ---
interface Episode {
  num: number;
  title: string;
  isVip?: boolean;
  duration: string;
}

interface AnimeDetail {
  id: string;
  title: string;
  cover: string;
  score: number;
  views: string;
  tags: string[];
  desc: string;
  status: string;
  episodes: Episode[];
}

// --- 模拟数据 ---
let animeData = reactive<AnimeDetail>({
  id: '1',
  title: '鬼灭之刃 刀匠村篇',
  cover: 'https://images.unsplash.com/photo-1612487528505-d2338264c821?q=80&w=800', // 这里的封面通常是横图
  score: 9.8,
  views: '1.2亿',
  tags: ['热血', '奇幻', '战斗', '神作'],
  status: '已完结',
  desc: '《鬼灭之刃》的故事舞台是日本大正时代。名叫灶门炭治郎的平凡农村少年，靠着卖炭来维持一家的生计。某天他下山去卖炭，回家时天色已暗，好心的三郎爷爷变留他住了一晚。隔天他回到家却发现家人全都遭到残杀，只剩妹妹祢豆子身体还有余温...',
  episodes: Array.from({ length: 12 }).map((_, i) => ({
    num: i + 1,
    title: `第${i + 1}话`,
    isVip: i > 2, // 前3集免费
    duration: '24:10'
  }))
});

// 猜你喜欢模拟数据
const recommendList = [
  { id: 101, title: '咒术回战', cover: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=300', score: 9.5 },
  { id: 102, title: '电锯人', cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=300', score: 9.2 },
  { id: 103, title: '死神 千年血战', cover: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=300', score: 9.7 },
];

// --- 状态管理 ---
const activeTab = ref(0);
const currentEp = ref(1); // 当前播放集数
const isDescExpanded = ref(false); // 简介是否展开
const isPlaying = ref(false); // 是否正在播放视频

// --- 交互逻辑 ---
const onBack = () => router.back();

const toggleDesc = () => {
  isDescExpanded.value = !isDescExpanded.value;
};

const changeEpisode = (num: number) => {
  currentEp.value = num;
  isPlaying.value = true; // 切换集数自动播放
  showToast(`开始播放第 ${num} 话`);
};

const handlePlayClick = () => {
  isPlaying.value = true;
  showToast('加载视频资源...');
};

const toggleFavorite = () => {
  showToast({ message: '已加入追番列表 ❤️', icon: 'like' });
};
  const { id } = route.params;
  const loadDetail = async () => {
    const res = await getAnimeDetail(id)
    // animeData = res.data
  }
  onMounted(() => {
    loadDetail()

  });

</script>

<template>
  <div class="detail-container">
    
    <!-- 1. 顶部导航栏 (绝对定位悬浮在视频上) -->
    <div class="nav-header" :class="{ 'dark-bg': isPlaying }">
      <van-icon name="arrow-left" class="nav-icon" @click="onBack" />
      <div class="nav-right">
        <van-icon name="tv-o" class="nav-icon" />
        <van-icon name="ellipsis" class="nav-icon" />
      </div>
    </div>

    <!-- 2. 视频播放区域 -->
    <div class="video-wrapper">
      <!-- 播放状态 -->
      <div v-if="isPlaying" class="player-placeholder">
        <div class="player-ui">
          <span class="loading-text">假装正在播放第 {{ currentEp }} 话...</span>
          <div class="progress-bar"><div class="current" style="width: 30%"></div></div>
        </div>
      </div>
      
      <!-- 封面状态 (未播放) -->
      <div v-else class="cover-overlay" :style="{ backgroundImage: `url(${animeData.cover})` }">
        <div class="play-btn" @click="handlePlayClick">
          <van-icon name="play" />
        </div>
      </div>
    </div>

    <!-- 3. 内容区域 (Tab 页切换) -->
    <div class="content-body">
      <van-tabs v-model:active="activeTab" sticky offset-top="0" color="#ff9a9e" shrink>
        
        <!-- Tab 1: 简介 & 选集 -->
        <van-tab title="简介">
          <div class="tab-content">
            
            <!-- 标题信息 -->
            <div class="info-header">
              <div class="title-row">
                <h1>{{ animeData.title }}</h1>
                <div class="score-box">
                  <span class="score">{{ animeData.score }}</span>
                  <span class="unit">分</span>
                </div>
              </div>
              
              <div class="stat-row">
                <span class="views">{{ animeData.views }}播放</span>
                <span class="dot">·</span>
                <span class="tags">
                  <span v-for="t in animeData.tags" :key="t" class="tag">#{{ t }}</span>
                </span>
              </div>

              <!-- 简介 (带展开收起) -->
              <div class="desc-box" :class="{ expanded: isDescExpanded }" @click="toggleDesc">
                <p>{{ animeData.desc }}</p>
                <van-icon :name="isDescExpanded ? 'arrow-up' : 'arrow-down'" class="expand-icon" />
              </div>

              <!-- 交互按钮组 -->
              <div class="action-bar">
                <div class="action-btn" @click="toggleFavorite">
                  <van-icon name="like-o" />
                  <span>追番</span>
                </div>
                <div class="action-btn">
                  <van-icon name="down" />
                  <span>缓存</span>
                </div>
                <div class="action-btn">
                  <van-icon name="share-o" />
                  <span>分享</span>
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <!-- 选集区域 -->
            <div class="episode-section">
              <div class="sec-header">
                <h3>选集</h3>
                <span class="sub-text">{{ animeData.status }} / 共 {{ animeData.episodes.length }} 话</span>
              </div>
              
              <!-- 剧集网格 -->
              <div class="ep-grid">
                <div 
                  v-for="ep in animeData.episodes" 
                  :key="ep.num"
                  class="ep-item"
                  :class="{ active: currentEp === ep.num }"
                  @click="changeEpisode(ep.num)"
                >
                  <span class="num">{{ ep.num }}</span>
                  <span v-if="ep.isVip" class="vip-tag">VIP</span>
                  <div v-if="currentEp === ep.num" class="playing-anim">
                    <i></i><i></i><i></i>
                  </div>
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <!-- 猜你喜欢 -->
            <div class="recommend-section">
              <h3>猜你喜欢</h3>
              <div class="rec-list">
                <div v-for="item in recommendList" :key="item.id" class="rec-card">
                  <div class="cover">
                    <img :src="item.cover" />
                    <span class="score">{{ item.score }}</span>
                  </div>
                  <p class="title">{{ item.title }}</p>
                </div>
              </div>
            </div>

          </div>
        </van-tab>

        <!-- Tab 2: 评论 (简单占位) -->
        <van-tab title="评论 (2333)">
          <div class="empty-comment">
            <van-empty description="还没有人发弹幕，快来抢沙发~" />
          </div>
        </van-tab>

      </van-tabs>
    </div>

    <!-- 底部投币/观看按钮 (可选，这里做了吸底的输入框模拟) -->
    <div class="bottom-input-bar">
      <div class="input-fake">发个弹幕见证当下...</div>
      <div class="icons">
        <van-icon name="good-job-o" badge="1k" />
        <van-icon name="star-o" badge="520" />
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
$primary-pink: #ff9a9e;
$primary-blue: #409eff;
$text-main: #333;
$text-gray: #999;

.detail-container {
  background: #fff;
  padding-bottom: 60px; // 留出底部输入栏空间
}

// 1. 顶部导航
.nav-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.4), transparent);
  transition: background 0.3s;

  &.dark-bg {
    background: #000;
  }

  .nav-icon {
    color: #fff;
    font-size: 24px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    cursor: pointer;
  }
  .nav-right {
    display: flex;
    gap: 15px;
  }
}

// 2. 视频区域
.video-wrapper {
  width: 100%;
  height: 220px; // 经典的 16:9 比例左右
  background: #000;
  position: relative;

  .cover-overlay {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .play-btn {
      width: 60px;
      height: 60px;
      background: rgba(255, 154, 158, 0.9); // 粉色播放键
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 28px;
      box-shadow: 0 0 20px rgba(255, 154, 158, 0.5);
      animation: pulse 2s infinite;
    }
  }

  .player-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    flex-direction: column;
    
    .progress-bar {
      width: 80%;
      height: 4px;
      background: #444;
      margin-top: 20px;
      border-radius: 2px;
      .current { height: 100%; background: $primary-pink; }
    }
  }
}

// 3. 内容区域
.tab-content {
  padding: 15px;
}

.info-header {
  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    h1 { margin: 0; font-size: 20px; color: $text-main; flex: 1; line-height: 1.4; }
    
    .score-box {
      color: #ffb400;
      margin-left: 10px;
      .score { font-size: 24px; font-weight: bold; font-family: 'Arial'; }
      .unit { font-size: 12px; margin-left: 2px; }
    }
  }

  .stat-row {
    margin-top: 8px;
    font-size: 12px;
    color: $text-gray;
    display: flex;
    align-items: center;

    .dot { margin: 0 6px; }
    .tag {
      color: $primary-blue;
      margin-right: 6px;
    }
  }

  .desc-box {
    margin-top: 12px;
    position: relative;
    
    p {
      font-size: 13px;
      color: #666;
      line-height: 1.6;
      margin: 0;
      // 收起状态样式
      display: -webkit-box;
      -webkit-line-clamp: 1; // 默认只显示一行
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .expand-icon {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 12px;
      color: $text-gray;
      background: #fff; // 遮挡文字
      padding-left: 5px;
    }

    &.expanded {
      p { -webkit-line-clamp: unset; }
      .expand-icon { top: auto; bottom: 0; }
    }
  }

  .action-bar {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    
    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: $text-main;
      font-size: 12px;
      
      .van-icon {
        font-size: 24px;
        margin-bottom: 6px;
        color: #555;
      }
      
      &:active { opacity: 0.6; transform: scale(0.95); }
    }
  }
}

.divider {
  height: 1px;
  background: #f5f5f5;
  margin: 20px 0;
  transform: scaleY(0.5);
}

// 选集样式
.episode-section {
  .sec-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    h3 { margin: 0; font-size: 16px; }
    .sub-text { font-size: 12px; color: $text-gray; }
  }

  .ep-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr); // 4列
    gap: 10px;
    
    .ep-item {
      height: 45px;
      background: #f7f8fa;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #333;
      position: relative;
      cursor: pointer;
      transition: all 0.2s;

      .vip-tag {
        position: absolute;
        top: 0;
        right: 0;
        background: $primary-pink;
        color: white;
        font-size: 8px;
        padding: 0 3px;
        border-top-right-radius: 8px;
        border-bottom-left-radius: 4px;
      }

      &.active {
        background: rgba(255, 154, 158, 0.15);
        color: $primary-pink;
        font-weight: bold;
        border: 1px solid rgba(255, 154, 158, 0.5);
      }
      
      // 播放中小动画
      .playing-anim {
        position: absolute;
        bottom: 4px;
        display: flex;
        gap: 2px;
        i {
          width: 2px;
          height: 4px;
          background: $primary-pink;
          animation: wave 0.8s infinite ease-in-out;
          &:nth-child(1) { animation-delay: 0s; }
          &:nth-child(2) { animation-delay: 0.2s; }
          &:nth-child(3) { animation-delay: 0.4s; }
        }
      }
    }
  }
}

// 猜你喜欢样式
.rec-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
  &::-webkit-scrollbar { display: none; }
  
  .rec-card {
    width: 100px;
    flex-shrink: 0;
    
    .cover {
      width: 100px;
      height: 140px;
      border-radius: 6px;
      overflow: hidden;
      position: relative;
      margin-bottom: 6px;
      
      img { width: 100%; height: 100%; object-fit: cover; }
      .score {
        position: absolute;
        bottom: 4px;
        right: 4px;
        color: #fff;
        font-size: 10px;
        font-weight: bold;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      }
    }
    .title {
      font-size: 12px;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

// 底部输入栏
.bottom-input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: #fff;
  border-top: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  padding: 0 15px;
  z-index: 99;

  .input-fake {
    flex: 1;
    height: 32px;
    background: #f7f8fa;
    border-radius: 16px;
    line-height: 32px;
    padding-left: 15px;
    color: #999;
    font-size: 13px;
    margin-right: 15px;
  }

  .icons {
    display: flex;
    gap: 20px;
    .van-icon { font-size: 22px; color: #555; }
  }
}


@keyframes pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 154, 158, 0.7); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 154, 158, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 154, 158, 0); }
}

@keyframes wave {
  0%, 100% { height: 4px; }
  50% { height: 8px; }
}

.empty-comment { padding: 40px 0; }
</style>