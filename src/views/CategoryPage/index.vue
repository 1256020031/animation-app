<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCategoryOptions, getAnimesByCategory } from '@/api/index';
import { formatNumber } from '@/utils/format'


// --- 1. 类型定义升级 ---
interface AnimeItem {
  id: number;
  title: string;
  cover: string;
  area: string;    // 地区：日本 / 国产 / 欧美
  year: string;    // 年份
  score: number;
  views: number;   // 播放量(数字用于排序)
  status: string;
}

// 筛选组的配置接口
interface FilterGroup {
  key: keyof typeof currentFilters;  // 限定为 currentFilters 的键类型
  label: string;
  options: FilterOption[];
}

interface FilterOption {
  label: string;
  value: string;
}

// --- 4. 响应式状态 ---
// 当前选中的筛选条件
const currentFilters = reactive({
  area: 'all',
  year: 'all',
  tag: 'all',
  sort: 'update'
});

const displayList = ref<AnimeItem[]>([]);
const isLoading = ref(false);

// 查询所有分类选项
let filterGroups = ref<FilterGroup[]>([]);
const queryCategoryOptions = async () => {
  try {
    const res = await getCategoryOptions();
    filterGroups.value = res.data.data;
  } catch (error) {
    console.log('object', error);
  }
};
const queryAnimesByCategory = async() => {
  try {
    isLoading.value = true;
    const res = await getAnimesByCategory({
      area: currentFilters.area,
      year: currentFilters.year,
      tag: currentFilters.tag,
      sort: currentFilters.sort
    });
    displayList.value = res.data.data;
    isLoading.value = false;
  } catch (error) {
    console.log('查询分类动画失败:', error);
    isLoading.value = false;
  }
};
onMounted(() => {
  // filterData();
  queryCategoryOptions()
  queryAnimesByCategory()
});

// 点击选项
const selectOption = (key: keyof typeof currentFilters, value: string) => {
  currentFilters[key] = value;
  queryAnimesByCategory()
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
              :key="opt.value"
              class="filter-pill"
              :class="{ active: currentFilters[group.key] === opt.value }"
              @click="selectOption(group.key, opt.value)"
            >
              {{ opt.label }}
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
              <img :src="item.cover" loading="lazy" />
              <!-- 角标 -->
              <span class="status-tag" :class="{ done: item.status === '已完结' }">
                {{ item.status }}
              </span>
            </div>
            
            <div class="info">
              <h3 class="title">{{ item.title }}</h3>
              <p class="sub-info">{{ formatNumber(item.views) }}观看</p>
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

       img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

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