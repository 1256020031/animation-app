<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { showToast } from 'vant';
import { useRouter } from 'vue-router';

// --- 1. 类型定义升级 ---
interface AnimeItem {
  id: number;
  title: string;
  cover: string;
  channel: string; // 频道：日韩动漫 / 国产动漫
  area: string;    // 地区：日本 / 国产 / 欧美
  year: string;    // 年份
  score: number;
  views: number;   // 播放量(数字用于排序)
  viewsText: string; // 展示文本
  episodes: string;
  updatedAt: number; // 时间戳
}

// 筛选组的配置接口
interface FilterGroup {
  key: 'channel' | 'area' | 'year' | 'sort';
  label: string;
  options: string[];
}

// --- 2. 静态配置 (复刻图片内容) ---
const filterGroups: FilterGroup[] = [
  { 
    key: 'channel', 
    label: '频道', 
    options: ['全部', '国产动漫', '日韩动漫', '欧美动漫', '海外动漫', '卡通电影'] 
  },
  { 
    key: 'area', 
    label: '地区', 
    options: ['全部', '国产', '日本', '欧美', '其他'] 
  },
  { 
    key: 'year', 
    label: '年份', 
    options: ['全部', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2010-2012', '更早'] 
  },
  { 
    key: 'sort', 
    label: '排序', 
    options: ['更新', '人气', '评分'] 
  }
];

// --- 3. 模拟总数据池 (扩展属性以支持筛选) ---
const allAnimes: AnimeItem[] = [
  { id: 1, title: '进击的巨人 最终季', cover: 'https://images.unsplash.com/photo-1612487528505-d2338264c821?q=80&w=300', channel: '日韩动漫', area: '日本', year: '2023', score: 9.8, views: 1580000, viewsText: '158.0万', episodes: '已完结', updatedAt: 1690000000 },
  { id: 2, title: '我推的孩子', cover: 'https://images.unsplash.com/photo-1560942485-b2a11cc13456?q=80&w=300', channel: '日韩动漫', area: '日本', year: '2023', score: 9.3, views: 1780000, viewsText: '178.0万', episodes: '已完结', updatedAt: 1680000000 },
  { id: 3, title: '凡人修仙传', cover: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=300', channel: '国产动漫', area: '国产', year: '2022', score: 9.5, views: 2300000, viewsText: '230.0万', episodes: '更新中', updatedAt: 1670000000 },
  { id: 4, title: '间谍过家家', cover: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=300', channel: '日韩动漫', area: '日本', year: '2022', score: 9.2, views: 1650000, viewsText: '165.0万', episodes: '已完结', updatedAt: 1660000000 },
  { id: 5, title: '瑞克和莫蒂', cover: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=300', channel: '欧美动漫', area: '欧美', year: '2021', score: 9.9, views: 800000, viewsText: '80.0万', episodes: '第六季', updatedAt: 1650000000 },
  { id: 6, title: '雾山五行', cover: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=300', channel: '国产动漫', area: '国产', year: '2020', score: 9.9, views: 1200000, viewsText: '120.0万', episodes: '已完结', updatedAt: 1640000000 },
  { id: 7, title: '鬼灭之刃 游郭篇', cover: 'https://images.unsplash.com/photo-1626544827763-d516dce335ca?q=80&w=300', channel: '日韩动漫', area: '日本', year: '2021', score: 9.7, views: 1920000, viewsText: '192.0万', episodes: '已完结', updatedAt: 1655000000 },
  { id: 8, title: '双城之战', cover: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=300', channel: '欧美动漫', area: '欧美', year: '2021', score: 9.6, views: 2500000, viewsText: '2.5亿', episodes: '已完结', updatedAt: 1630000000 },
];

// --- 4. 响应式状态 ---
// 当前选中的筛选条件
const currentFilters = reactive({
  channel: '全部',
  area: '全部',
  year: '全部',
  sort: '更新'
});

const displayList = ref<AnimeItem[]>([]);
const isLoading = ref(false);

// --- 5. 核心筛选逻辑 ---
const filterData = () => {
  isLoading.value = true;
  
  setTimeout(() => {
    let temp = [...allAnimes];

    // A. 频道筛选
    if (currentFilters.channel !== '全部') {
      temp = temp.filter(item => item.channel === currentFilters.channel);
    }
    
    // B. 地区筛选
    if (currentFilters.area !== '全部') {
      temp = temp.filter(item => item.area === currentFilters.area);
    }

    // C. 年份筛选
    if (currentFilters.year !== '全部') {
      if (currentFilters.year === '更早') {
        temp = temp.filter(item => parseInt(item.year) < 2013);
      } else if (currentFilters.year.includes('-')) {
         // 处理区间，如 "2010-2012"
         // 这里简单模拟，实际可能需要更复杂的区间判断
         temp = temp.filter(item => parseInt(item.year) >= 2010 && parseInt(item.year) <= 2012);
      } else {
        temp = temp.filter(item => item.year === currentFilters.year);
      }
    }

    // D. 排序逻辑
    if (currentFilters.sort === '评分') {
      temp.sort((a, b) => b.score - a.score);
    } else if (currentFilters.sort === '更新') {
      temp.sort((a, b) => b.updatedAt - a.updatedAt);
    } else if (currentFilters.sort === '人气') {
      temp.sort((a, b) => b.views - a.views);
    }

    displayList.value = temp;
    isLoading.value = false;
  }, 400);
};

// 监听所有筛选条件的变化
watch(currentFilters, () => {
  filterData();
});

onMounted(() => {
  filterData();
});

// 点击选项
const selectOption = (key: keyof typeof currentFilters, value: string) => {
  currentFilters[key] = value;
};
const router = useRouter()
const onCardClick = (item: AnimeItem) => {
  router.push({ name: 'AnimeDetail', params: { id: item.id } });
};
</script>

<template>
  <div class="category-view">
    
    <!-- 吸顶容器 -->
    <van-sticky>
      <div class="filter-container">
        <!-- 循环渲染 4 行筛选 -->
        <div v-for="group in filterGroups" :key="group.key" class="filter-row">
          <!-- 左侧 Label (频道:) -->
          <span class="row-label">{{ group.label }}:</span>
          
          <!-- 右侧滚动选项 -->
          <div class="row-scroll">
            <div 
              v-for="opt in group.options" 
              :key="opt"
              class="filter-pill"
              :class="{ active: currentFilters[group.key] === opt }"
              @click="selectOption(group.key, opt)"
            >
              {{ opt }}
            </div>
          </div>
        </div>
      </div>
    </van-sticky>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 骨架屏 -->
      <div v-if="isLoading" class="skeleton-grid">
        <div v-for="i in 6" :key="i" class="skeleton-item">
           <van-skeleton title :row="2" />
        </div>
      </div>

      <!-- 数据列表 -->
      <div v-else-if="displayList.length > 0" class="anime-grid">
        <transition-group name="list">
          <div 
            v-for="item in displayList" 
            :key="item.id" 
            class="anime-card"
            @click="onCardClick(item)"
          >
            <div class="cover-wrapper">
              <van-image fit="cover" :src="item.cover" class="cover-img" lazy-load />
              <!-- 角标 -->
              <span class="status-tag" :class="{ done: item.episodes === '已完结' }">
                {{ item.episodes }}
              </span>
            </div>
            
            <div class="info">
              <h3 class="title">{{ item.title }}</h3>
              <p class="sub-info">{{ item.viewsText }}观看</p>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <van-empty description="在这个维度没有找到番剧捏~" />
      </div>

      <div class="bottom-spacer"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 变量 (如果你想要参考图的黄色，可以把 primary-color 改为 #ffda44, text-active 改为 #333)
$primary-color: #ff9a9e; 
$text-main: #333;
$text-sub: #888;
$bg-active: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); // 粉色渐变
// $bg-active: #ffda44; // 黄色纯色 (参考图风格)

.category-view {
  min-height: 100%;
  background-color: #fff;
}

// --- 筛选区域核心样式 ---
.filter-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 10px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  border-bottom: 1px solid #f5f5f5;

  .filter-row {
    display: flex;
    align-items: center;
    padding: 6px 15px; // 行间距
    
    .row-label {
      font-size: 13px;
      color: $text-sub;
      font-weight: bold;
      margin-right: 10px;
      white-space: nowrap; // 防止换行
      min-width: 36px; // 对齐
    }

    .row-scroll {
      flex: 1;
      display: flex;
      overflow-x: auto; // 允许横向滚动
      gap: 8px;
      
      // 隐藏滚动条
      &::-webkit-scrollbar { display: none; }

      .filter-pill {
        flex-shrink: 0; // 防止挤压
        font-size: 13px;
        color: $text-main;
        padding: 4px 12px;
        border-radius: 14px;
        cursor: pointer;
        transition: all 0.2s;

        &:active { opacity: 0.7; }

        // 选中状态
        &.active {
          background: $bg-active; 
          color: #fff; // 如果用黄色背景，这里颜色建议改为 #333
          font-weight: bold;
        }
      }
    }
  }
}

// --- 内容网格 (三列布局，复刻首页风格) ---
.content-area {
  padding: 15px;
}

.anime-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  row-gap: 15px;

  .anime-card {
    display: flex;
    flex-direction: column;
    
    .cover-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 3/4;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 6px;

      .cover-img { width: 100%; height: 100%; }

      .status-tag {
        position: absolute;
        top: 0;
        right: 0;
        background: #409eff; // 蓝色更新中
        color: white;
        font-size: 10px;
        padding: 2px 5px;
        border-bottom-left-radius: 6px;
        
        &.done {
          background: #ff9a9e; // 粉色已完结
        }
      }
    }

    .info {
      .title {
        font-size: 12px;
        color: $text-main;
        margin: 0 0 2px;
        // 限制2行
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        height: 34px; // 保持对齐
      }
      .sub-info {
        font-size: 10px;
        color: $text-sub;
        margin: 0;
      }
    }
  }
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  .skeleton-item {
    height: 180px;
    background: #f9f9f9;
    border-radius: 8px;
  }
}

.bottom-spacer {
  height: 60px;
}

// 动画
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>