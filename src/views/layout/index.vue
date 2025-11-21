<template>
  <div class="app-layout">
    <router-view />

    <!-- 底部导航栏 -->
    <van-tabbar
      v-model="activeTab"
      class="custom-tabbar"
      active-color="#ff9a9e"
      inactive-color="#bbbbbb"
      @change="tabbarChange"
    >
      <van-tabbar-item icon="wap-home" to="/HomePage">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/CategoryPage">分类</van-tabbar-item>
      <van-tabbar-item icon="search" to="/SearchPage">搜索</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/mine">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
  setup() {
    const activeTab = ref(0);
    const tabbarChange = (index: number) => {
      activeTab.value = index;
    };

    return {
      activeTab,
      tabbarChange
    }
  },
};
</script>

<style lang="scss" scoped>
// 引入字体
@import url("https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700&display=swap");

// --- 变量 ---
$primary-pink: #ff9a9e;
$bg-color: #f8fbfd; // 极淡的蓝色背景
$card-bg: #ffffff;
$text-main: #333;
$text-sub: #999;

// --- 全局布局 ---
.app-layout {
  width: 100%;
  height: 100vh;
  background-color: $bg-color;
  font-family: "M PLUS Rounded 1c", sans-serif;
  position: relative;
  overflow: hidden;
}

.main-content {
  height: 100%;
  overflow-y: auto; // 内容区域滚动
  -webkit-overflow-scrolling: touch;
  padding-bottom: 80px; // 留出底部 Tabbar 的空间
}

.page-container {
  padding: 20px;
}

// --- 1. 首页样式 ---
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .greeting {
    h2 {
      font-size: 20px;
      margin: 0;
      color: $text-main;
    }
    p {
      font-size: 12px;
      color: $text-sub;
      margin-top: 5px;
    }
  }

  .header-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
    padding: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}

.banner-box {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(100, 100, 100, 0.1);
  margin-bottom: 25px;

  .my-swipe .van-swipe-item {
    height: 180px;
    .banner-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 15px;

  h3 {
    margin: 0;
    font-size: 18px;
    color: $text-main;
  }
  .more {
    font-size: 12px;
    color: $text-sub;
  }
}

// 瀑布流/网格布局
.anime-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;

  .anime-card {
    background: $card-bg;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s;

    &:active {
      transform: scale(0.98);
    }

    .cover-wrapper {
      position: relative;
      height: 140px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .score {
        position: absolute;
        bottom: 8px;
        right: 8px;
        background: rgba(255, 154, 158, 0.9);
        color: white;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 8px;
        font-weight: bold;
      }
    }

    .info {
      padding: 10px;

      h4 {
        margin: 0;
        font-size: 14px;
        color: $text-main;
      }

      .truncate {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .tag {
        display: inline-block;
        margin-top: 6px;
        font-size: 10px;
        color: $primary-pink;
        background: rgba(255, 154, 158, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
      }
    }
  }
}

// --- 占位页面样式 ---
.center-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
}

.search-view {
  .hot-tags {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    padding: 0 10px;
    .tag-bubble {
      background: #fff;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      color: #666;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }
  }
}

.profile-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  .big-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 10px;
  }
}

// --- 底部导航栏 (魔改) ---
.custom-tabbar {
  // 悬浮效果核心
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);

  // 磨砂玻璃
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  // 去除 Vant 默认边框线
  &::after {
    display: none;
  }
}

// 为了覆盖 Vant 默认样式，使用 :deep
:deep(.van-tabbar-item--active) {
  background-color: transparent; // 选中背景透明

  .van-tabbar-item__icon {
    transform: scale(1.1); // 选中图标稍微放大
    transition: transform 0.2s;
  }
}

.bottom-spacer {
  height: 80px; // 防止内容被底部悬浮栏遮住
}

// 页面切换动画
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
