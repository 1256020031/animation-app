<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { showToast, showConfirmDialog } from 'vant';

// --- 类型定义 ---
interface HotItem {
  rank: number;
  title: string;
  heat: string; // 热度值
  tag?: 'HOT' | 'NEW' | 'UP'; // 角标
}

interface SearchResult {
  id: number;
  title: string;
  desc: string;
}

// --- 模拟数据 ---
const historyList = ref<string[]>(['鬼灭之刃', '进击的巨人', '原神', '孤独摇滚', 'Lycoris']);

const hotList = reactive<HotItem[]>([
  { rank: 1, title: '咒术回战 涩谷事变', heat: '982w', tag: 'HOT' },
  { rank: 2, title: '葬送的芙莉莲', heat: '850w', tag: 'NEW' },
  { rank: 3, title: '药屋少女的呢喃', heat: '720w', tag: 'UP' },
  { rank: 4, title: '无职转生', heat: '680w' },
  { rank: 5, title: '香格里拉边境', heat: '550w' },
  { rank: 6, title: '不死不幸', heat: '430w' },
  { rank: 7, title: '美好世界', heat: '390w' },
  { rank: 8, title: '想要成为影之实力者', heat: '320w' },
]);

// 模拟数据库用于实时搜索
const mockDb = [
  '鬼灭之刃 第一季', '鬼灭之刃 无限列车篇', '鬼灭之刃 游郭篇',
  '进击的巨人 最终季', '进击的巨人 完结篇',
  '关于我转生变成史莱姆这档事', '转生王女与天才千金',
  '咒术回战', '咒术回战 0',
];

// --- 状态 ---
const keyword = ref('');
const searchResults = ref<SearchResult[]>([]);
const isSearching = ref(false); // 是否正在输入搜索

// --- 交互逻辑 ---

// 1. 执行搜索
const onSearch = (val: string) => {
  if (!val.trim()) return;
  
  showToast(`正在搜索: ${val}`);
  
  // 添加到历史记录 (去重 + 顶置)
  const index = historyList.value.indexOf(val);
  if (index !== -1) historyList.value.splice(index, 1);
  historyList.value.unshift(val);
  
  // 限制历史记录数量
  if (historyList.value.length > 10) historyList.value.pop();
};

// 2. 清空历史
const onClearHistory = () => {
  showConfirmDialog({
    title: '温馨提示',
    message: '确定要清空所有搜索历史吗？无法找回哦~',
    confirmButtonColor: '#ff9a9e',
  })
    .then(() => {
      historyList.value = [];
    })
    .catch(() => {});
};

// 删除单个历史
const onDeleteItem = (index: number) => {
  historyList.value.splice(index, 1);
};

// 点击热搜/历史标签
const onTagClick = (text: string) => {
  keyword.value = text;
  onSearch(text);
};

// 3. 实时搜索监听
watch(keyword, (newVal) => {
  if (!newVal.trim()) {
    isSearching.value = false;
    searchResults.value = [];
    return;
  }
  
  isSearching.value = true;
  // 模拟 API 请求筛选
  const hit = mockDb.filter(item => item.includes(newVal));
  
  searchResults.value = hit.map((item, index) => ({
    id: index,
    title: item,
    desc: '番剧 • 9.8分'
  }));
});

// 关键词高亮处理 HTML
const highlightText = (text: string) => {
  if (!keyword.value) return text;
  const reg = new RegExp(`(${keyword.value})`, 'gi');
  return text.replace(reg, '<span class="highlight">$1</span>');
};
</script>

<template>
  <div class="search-view">
    
    <!-- 顶部搜索栏 (吸顶) -->
    <div class="search-header-box">
      <van-search
        v-model="keyword"
        show-action
        placeholder="搜索番剧、角色、UP主..."
        shape="round"
        background="transparent"
        @search="onSearch"
      >
        <template #action>
          <div class="btn-search" @click="onSearch(keyword)">搜索</div>
        </template>
      </van-search>
    </div>

    <div class="scroll-container">
      
      <!-- 模式 A: 默认显示 (历史 + 热搜) -->
      <transition name="fade">
        <div v-show="!isSearching" class="default-content">
          
          <!-- 1. 搜索历史 -->
          <div class="section-box" v-if="historyList.length > 0">
            <div class="title-row">
              <h3>搜索历史</h3>
              <van-icon name="delete-o" class="trash-icon" @click="onClearHistory" />
            </div>
            <div class="history-tags">
              <transition-group name="list">
                <div 
                  v-for="(item, index) in historyList" 
                  :key="item" 
                  class="tag-pill"
                  @click="onTagClick(item)"
                >
                  {{ item }}
                  <!-- 长按或特殊模式下显示删除叉号，这里简化为始终不显示叉号，靠顶部按钮清空，或者点击交互 -->
                </div>
              </transition-group>
            </div>
          </div>

          <!-- 2. 热门榜单 -->
          <div class="section-box">
            <div class="title-row">
              <h3>🔥 全站热搜</h3>
            </div>
            <div class="hot-grid">
              <div 
                v-for="(item, index) in hotList" 
                :key="index" 
                class="hot-item"
                @click="onTagClick(item.title)"
              >
                <div class="rank-num" :class="`rank-${item.rank}`">{{ item.rank }}</div>
                <div class="hot-info">
                  <div class="name-row">
                    <span class="name">{{ item.title }}</span>
                    <span v-if="item.tag" class="tag-badge" :class="item.tag">{{ item.tag }}</span>
                  </div>
                  <span class="heat-val">{{ item.heat }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- 模式 B: 实时搜索结果 -->
      <transition name="fade">
        <div v-show="isSearching" class="result-content">
          <div v-if="searchResults.length > 0" class="result-list">
            <div 
              v-for="item in searchResults" 
              :key="item.id" 
              class="result-cell"
              @click="onSearch(item.title)"
            >
              <van-icon name="search" class="cell-icon" />
              <div class="cell-text">
                <!-- v-html 用于渲染高亮 -->
                <p class="main-text" v-html="highlightText(item.title)"></p>
                <p class="sub-text">{{ item.desc }}</p>
              </div>
            </div>
          </div>
          
          <!-- 搜不到的情况 -->
          <van-empty 
            v-else 
            image="search" 
            description="什么也没找到呢 ( >﹏< )" 
          />
        </div>
      </transition>

    </div>
  </div>
</template>

<style lang="scss" scoped>
$primary-pink: #ff9a9e;
$text-main: #333;
$text-sub: #999;

.search-view {
  height: 100%;
  background-color: #f8fbfd;
  display: flex;
  flex-direction: column;
}

// --- 顶部搜索栏 ---
.search-header-box {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding-top: 10px; // 状态栏高度占位
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
  z-index: 10;

  .btn-search {
    color: $primary-pink;
    font-weight: bold;
    padding: 0 10px;
    cursor: pointer;
    &:active { opacity: 0.7; }
  }

  :deep(.van-search__content) {
    background-color: #f0f2f5;
  }
}

.scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px 15px 40px 15px;
  box-sizing: border-box;
  position: relative;
}

.section-box {
  margin-bottom: 30px;

  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    h3 { margin: 0; font-size: 16px; color: $text-main; }
    .trash-icon { font-size: 18px; color: $text-sub; padding: 5px; }
  }
}

// --- 搜索历史标签 ---
.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .tag-pill {
    padding: 6px 14px;
    background: #fff;
    border-radius: 20px;
    font-size: 13px;
    color: #666;
    box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    transition: all 0.2s;
    cursor: pointer;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:active {
      transform: scale(0.95);
      background: #f0f0f0;
    }
  }
}

// --- 热门榜单 ---
.hot-grid {
  display: grid;
  gap: 12px;
}

.hot-item {
  height: 100%; 
  display: flex;
  align-items: center;
  background: #fff;
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s;
  box-sizing: border-box;
  
  &:active { transform: scale(0.98); }

  .rank-num {
    width: 24px;
    min-width: 24px; 
    font-size: 18px;
    font-weight: 900;
    width: 24px;
    text-align: center;
    margin-right: 10px;
    color: #ccc; // 默认颜色
    font-style: italic;

    // 前三名颜色
    &.rank-1 { color: #ff4757; }
    &.rank-2 { color: #ff7f50; }
    &.rank-3 { color: #ffa502; }
  }

  .hot-info {
    flex: 1;
    min-width: 0; 
    display: flex;
    flex-direction: column;
    justify-content: center; // 内容垂直居中
    
    .name-row {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      
      .name {
        font-size: 13px;
        color: #333;
        margin-right: 5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .tag-badge {
        // 防止标签被压缩
        flex-shrink: 0; 
        font-size: 10px;
        color: white;
        padding: 1px 3px;
        border-radius: 3px;
        transform: scale(0.8);
        font-weight: bold;
        
        &.HOT { background: #ff4757; }
        &.NEW { background: #2ed573; }
        &.UP { background: #ffa502; }
      }
    }

    .heat-val {
      font-size: 11px;
      color: #bbb;
    }
  }
}

// --- 实时搜索结果 ---
.result-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.result-cell {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child { border-bottom: none; }
  &:active { background: #f9f9f9; }

  .cell-icon {
    font-size: 18px;
    color: #ccc;
    margin-right: 12px;
  }

  .cell-text {
    flex: 1;
    
    .main-text {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: #333;
      
      // 高亮样式 (需要 :deep 或者全局样式，因为是 v-html 插入的)
      :deep(.highlight) {
        color: $primary-pink;
        font-weight: bold;
      }
    }

    .sub-text {
      margin: 0;
      font-size: 11px;
      color: #999;
    }
  }
}

// 列表过渡动画
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-active {
  position: absolute; // 确保删除时其他元素平滑移动
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>