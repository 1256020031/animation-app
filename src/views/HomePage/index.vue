<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showLoadingToast, closeToast } from 'vant';
import 'vant/lib/index.css';
import { getBanners, getNewAnime, getHotAnime, getClassicRecommend, getFinishedList } from '@/api/index.js';
import { formatViews } from '@/utils/format';

// --- 类型定义 ---
type AnimeStatus = '已完结' | '更新中';

interface AnimeCard {
  id: number;
  title: string;
  cover: string;
  status: AnimeStatus;
  episode: string; // e.g. "第28集"
  score: number;
  views: string; // e.g. "158.0万"
}
interface Banner {
  id: number;
  image_url: string;
  title: string;
  sort: number;
}

// --- 1. 轮播图数据 ---
const banners = ref<Banner[]>([]);
const queryBanners = async () => {
  try {
    const res = await getBanners()
    banners.value = res.data.data as Banner[];
  } catch (err) {
    console.error(err)
  }
};

// --- 3. 四大板块数据 ---
// 使用 ref 定义各个板块的数据
const newList = ref<AnimeCard[]>([]);
const hotList = ref<AnimeCard[]>([]);
const recommendList = ref<AnimeCard[]>([]);
const finishedList = ref<AnimeCard[]>([]);

// sections 使用计算属性，自动响应数据变化
const sections = computed(() => [
  { key: 'new', title: '新番连载', icon: 'fire-o', list: newList.value },
  { key: 'hot', title: '热门追番', icon: 'clock-o', list: hotList.value },
  { key: 'recommend', title: '经典推荐', icon: 'chart-trending-o', list: recommendList.value },
  { key: 'finished', title: '完结佳作', icon: 'star-o', list: finishedList.value },
]);
// 查询新番数据
const queryNewAnime = async () => {
  try {
    const res = await getNewAnime()
    newList.value = res.data.data as AnimeCard[];
  } catch (err) {
    console.error(err)
  }
};
// 查询热门数据
const queryHotAnime = async () => {
  try {
    const res = await getHotAnime()
    hotList.value = res.data.data as AnimeCard[];
  } catch (err) {
    console.error(err)
  }
};
// 查询经典推荐数据
const queryClassicRecommend = async () => {
  try {
    const res = await getClassicRecommend()
    recommendList.value = res.data.data as AnimeCard[];
  } catch (err) {
    console.error(err)
  }
};
// 查询完结列表数据
const queryFinishedList = async () => {
  try {
    const res = await getFinishedList()
    finishedList.value = res.data.data as AnimeCard[];
  } catch (err) {
    console.error(err)
  }
};

// --- 交互 ---
const onMoreClick = (sectionTitle: string) => {
  showToast(`查看更多: ${sectionTitle}`);
};
const router = useRouter();

const onItemClick = (item: AnimeCard) => {
  router.push({ name: 'AnimeDetail', params: { id: item.id } });
};



onMounted(async () => {
  await queryBanners()
  await queryNewAnime()
  await queryHotAnime()
  await queryClassicRecommend()
  await queryFinishedList()
})
</script>

<template>
  <div class="home-container">
    
    <!-- 顶部 Header (简单示例) -->
    <div class="main-header">
       <div class="logo-text">Anime App</div>
       <van-icon name="search" size="22" />
    </div>

    <!-- 轮播图 Banner -->
    <div class="banner-wrapper">
      <van-swipe :autoplay="4000" indicator-color="#fff">
        <van-swipe-item v-for="(img, idx) in banners" :key="idx">
          <img :src="img.image_url" class="banner-img" />
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 循环渲染 4 个板块 -->
    <div class="section-wrapper" v-for="sec in sections" :key="sec.key">
      
      <!-- 板块标题栏 -->
      <div class="section-header">
        <div class="left">
          <van-icon :name="sec.icon" class="sec-icon" />
          <span class="title-text">{{ sec.title }}</span>
        </div>
        <div class="right" @click="onMoreClick(sec.title)">
          <span>更多</span>
          <van-icon name="arrow" />
        </div>
      </div>

      <!-- 三列布局网格 -->
      <div class="anime-grid">
        <div 
          v-for="item in sec.list" 
          :key="item.id" 
          class="anime-card"
          @click="onItemClick(item)"
        >
          <!-- 封面图区域 -->
          <div class="cover-box">
            <img :src="item.cover" loading="lazy" />
            
            <!-- 右上角：状态角标 -->
            <span class="status-badge" :class="{ 'updating': item.status === '更新中' }">
              {{ item.status }}
            </span>

            <!-- 底部遮罩层：集数与评分 -->
            <div class="bottom-overlay">
              <div class="overlay-row">
                <div class="ep-info">
                  <van-icon name="play-circle-o" />
                  <span>{{ item.episode }}</span>
                </div>
              </div>
              <div class="overlay-row">
                <div class="score-info">
                  <van-icon name="star" color="#ffb400" />
                  <span>{{ item.score }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部文字信息 -->
          <div class="info-box">
            <h3 class="anime-title">{{ item.title }}</h3>
            <p class="views-text">{{ formatViews(item.views) }}观看</p>
          </div>
        </div>
      </div>

    </div>
    
    <!-- 底部垫高 -->
    <div class="footer-spacer"></div>

  </div>
</template>

<style lang="scss" scoped>
// 变量定义
$primary-color: #ff9a9e;
$blue-tag: #409eff;  // 参考图片中的蓝色
$update-tag: #409eff; // 更新中也是蓝色，也可以改成 #ff4757
$text-main: #333;
$text-sub: #999;

.home-container {
  background-color: #fff; // 首页通常用白底显得干净
  height: 100%;
  padding-bottom: 20px;
  overflow: auto;
}

// 顶部
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  .logo-text { font-weight: bold; font-size: 18px; color: $primary-color; font-family: 'M PLUS Rounded 1c', sans-serif; }
}

// 轮播图
.banner-wrapper {
  padding: 0 15px;
  margin-bottom: 20px;
  .banner-img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    border-radius: 12px;
  }
}

// 板块通用样式
.section-wrapper {
  margin-bottom: 25px;
  padding: 0 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; // 底部对齐
  margin-bottom: 12px;

  .left {
    display: flex;
    align-items: center;
    .sec-icon { font-size: 18px; color: #ff6b6b; margin-right: 6px; } // 火焰色
    .title-text { font-size: 16px; font-weight: bold; color: $text-main; }
  }

  .right {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: $text-sub;
    cursor: pointer;
  }
}

// --- 核心：三列 Grid 布局 ---
.anime-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); // 强制 3 列
  gap: 10px; // 列间距和行间距
}

.anime-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;

  // 封面区域
  .cover-box {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 4; // 保持 3:4 的封面比例，非常适合动漫海报
    border-radius: 8px;
    overflow: hidden;
    background: #f0f0f0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    // 状态角标 (右上角)
    .status-badge {
      position: absolute;
      top: 0;
      right: 0;
      background: $blue-tag;
      color: #fff;
      font-size: 10px;
      padding: 2px 6px;
      border-bottom-left-radius: 8px;
      
      &.updating {
        background: #409eff; // 如果想区分颜色可以在这里改
      }
    }

    // 底部渐变遮罩 (承载集数和评分)
    .bottom-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      // 黑色透明渐变，保证白字清晰
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
      padding: 20px 6px 4px; // 上方的 padding 是为了留出渐变空间
      color: #fff;
      font-size: 10px;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      
      .overlay-row {
        display: flex;
        align-items: center;
        margin-top: 2px;
        
        .ep-info, .score-info {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        
        .score-info {
          color: #ffb400; // 金色星星和分数
          font-weight: bold;
        }
      }
    }
  }

  // 底部信息区域
  .info-box {
    margin-top: 6px;

    .anime-title {
      font-size: 13px;
      color: $text-main;
      line-height: 1.4;
      margin: 0 0 2px 0;
      
      // 限制显示两行，超出省略
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      min-height: 36px; // 保持高度对齐
    }

    .views-text {
      font-size: 10px;
      color: $text-sub;
      margin: 0;
    }
  }
}

.footer-spacer {
  height: 60px;
}
</style>