<script setup lang="ts">
import { ref, reactive } from 'vue';
import { showToast, showConfirmDialog, showSuccessToast } from 'vant';
import { useRouter } from 'vue-router'; // 假设你有路由

// --- 数据接口定义 ---
interface UserInfo {
  name: string;
  avatar: string;
  level: number;
  exp: number; // 当前经验
  maxExp: number; // 升级所需经验
  isVip: boolean;
  coins: number; // 硬币/积分
}

interface HistoryItem {
  id: number;
  title: string;
  cover: string;
  progress: string; // e.g. "看到 12:30"
}

// --- 模拟数据 ---
const userInfo = reactive<UserInfo>({
  name: 'Felix酱',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  level: 6,
  exp: 850,
  maxExp: 1200,
  isVip: true,
  coins: 233,
});

const stats = reactive({
  watchHours: 128, // 观看小时
  watchedCount: 42, // 看过番剧
  days: 105, // 加入天数
});

const historyList = ref<HistoryItem[]>([
  { id: 1, title: '间谍过家家 Season 2', cover: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=300', progress: '第12话' },
  { id: 2, title: '电锯人', cover: 'https://images.unsplash.com/photo-1612487528505-d2338264c821?q=80&w=300', progress: '第08话' },
  { id: 3, title: '孤独摇滚!', cover: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?q=80&w=300', progress: '第05话' },
]);

// --- 交互逻辑 ---

// 每日签到
const handleCheckIn = () => {
  showSuccessToast({
    message: '签到成功! 硬币 +10',
    icon: 'gem-o'
  });
  userInfo.coins += 10;
};

// 退出登录
const handleLogout = () => {
  showConfirmDialog({
    title: '退出登录',
    message: '真的要离开这里嘛？(｡•́︿•̀｡)',
    confirmButtonColor: '#ff9a9e',
  })
    .then(() => {
      // 确认退出逻辑
      showToast('已安全退出');
      // router.push('/login'); // 实际项目中取消注释跳转
    })
    .catch(() => {
      // 取消
    });
};

const onGridClick = (text: string) => {
  showToast(`进入: ${text}`);
};
</script>

<template>
  <div class="profile-view">

    <!-- 用户信息卡片 (浮动) -->
    <div class="user-card">
      <div class="avatar-row">
        <div class="avatar-box">
          <img :src="userInfo.avatar" />
          <span v-if="userInfo.isVip" class="vip-badge">VIP</span>
        </div>
        <div class="info-text">
          <div class="name-line">
            <h2>{{ userInfo.name }}</h2>
            <span class="level-tag">Lv.{{ userInfo.level }}</span>
          </div>
          <p class="sign">今天也要元气满满哦~ ✨</p>
          
          <!-- 等级进度条 -->
          <div class="exp-bar-wrapper">
            <div class="exp-bar" :style="{ width: (userInfo.exp / userInfo.maxExp) * 100 + '%' }"></div>
          </div>
          <span class="exp-text">{{ userInfo.exp }} / {{ userInfo.maxExp }} EXP</span>
        </div>
        
        <!-- 签到按钮 -->
        <div class="check-in-btn" @click="handleCheckIn">
          <van-icon name="calender-o" />
          <span>签到</span>
        </div>
      </div>

      <!-- 统计数据栏 -->
      <div class="stats-row">
        <div class="stat-item">
          <span class="num">{{ stats.watchHours }}</span>
          <span class="label">观看小时</span>
        </div>
        <div class="stat-item">
          <span class="num">{{ stats.watchedCount }}</span>
          <span class="label">追番数量</span>
        </div>
        <div class="stat-item">
          <span class="num">{{ stats.days }}</span>
          <span class="label">加入天数</span>
        </div>
      </div>
    </div>

    <div class="profiel-content">
      <!-- 功能快捷入口 -->
    <div class="section-card menu-grid">
      <van-grid :column-num="4" :border="false" icon-size="28">
        <van-grid-item icon="clock-o" text="历史记录" @click="onGridClick('历史')" />
        <van-grid-item icon="star-o" text="我的收藏" @click="onGridClick('收藏')" badge="12" />
        <van-grid-item icon="down" text="离线缓存" @click="onGridClick('缓存')" />
        <van-grid-item icon="comment-o" text="我的消息" @click="onGridClick('消息')" dot />
      </van-grid>
    </div>

    <!-- 最近观看 (横向滚动) -->
    <div class="section-card history-section">
      <div class="section-header">
        <h3>📺 继续观看</h3>
        <span class="more">全部 ></span>
      </div>
      <div class="history-scroll">
        <div v-for="item in historyList" :key="item.id" class="history-item">
          <div class="cover">
            <img :src="item.cover" />
            <div class="play-overlay"><van-icon name="play" /></div>
          </div>
          <span class="title truncate">{{ item.title }}</span>
          <span class="progress">{{ item.progress }}</span>
        </div>
      </div>
    </div>

    <!-- 更多功能列表 -->
    <div class="section-card list-section">
      <van-cell-group :border="false">
        <van-cell title="硬币余额" :value="userInfo.coins" icon="gem-o" is-link />
        <van-cell title="个性装扮" value="未设置" icon="shirt-o" is-link />
        <van-cell title="应用设置" icon="setting-o" is-link />
        <van-cell title="关于我们" icon="info-o" is-link />
      </van-cell-group>
    </div>

    <!-- 退出登录按钮 -->
    <div class="logout-box">
      <van-button block round color="#ff9a9e" class="logout-btn" @click="handleLogout">
        退出登录 Log Out
      </van-button>
    </div>
    
    <!-- 底部留白 -->
    <div class="bottom-spacer"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$primary-pink: #ff9a9e;
$text-main: #333;
$text-light: #999;

.profile-view {
  height: 100%;
  background-color: #f8fbfd;
  position: relative;
}



// 2. 用户卡片 (核心)
.user-card {
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  position: relative;
  z-index: 1;
  
  .avatar-row {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .avatar-box {
      position: relative;
      width: 70px;
      height: 70px;
      margin-right: 15px;
      
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 3px solid #fff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
      
      .vip-badge {
        position: absolute;
        bottom: 0;
        right: -5px;
        background: #ffb400;
        color: #fff;
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 10px;
        font-weight: bold;
        border: 2px solid #fff;
      }
    }

    .info-text {
      flex: 1;
      
      .name-line {
        display: flex;
        align-items: center;
        h2 { margin: 0; font-size: 18px; color: $text-main; }
        .level-tag {
          margin-left: 8px;
          font-size: 10px;
          background: $primary-pink;
          color: white;
          padding: 1px 6px;
          border-radius: 4px;
          font-style: italic;
        }
      }
      
      .sign {
        margin: 4px 0 8px;
        font-size: 12px;
        color: $text-light;
      }

      // 经验条
      .exp-bar-wrapper {
        height: 6px;
        background: #eee;
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 4px;
        .exp-bar {
          height: 100%;
          background: linear-gradient(to right, #a1c4fd, #c2e9fb);
        }
      }
      .exp-text {
        font-size: 10px;
        color: #bbb;
      }
    }
    
    .check-in-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: #fff0f1;
      padding: 6px 12px;
      border-radius: 12px;
      color: $primary-pink;
      font-size: 12px;
      cursor: pointer;
      
      :deep(.van-icon) {
        font-size: 20px;
        margin-bottom: 2px;
      }
    }
  }

  // 统计数字
  .stats-row {
    display: flex;
    justify-content: space-around;
    padding-top: 10px;
    border-top: 1px solid #f5f5f5;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .num {
        font-size: 18px;
        font-weight: bold;
        color: $text-main;
      }
      .label {
        font-size: 11px;
        color: $text-light;
        margin-top: 4px;
      }
    }
  }
}

.profiel-content {
  height: calc(100% - 210px);
  overflow: auto;
}

// 3. 通用卡片样式
.section-card {
  margin: 15px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

// 4. 宫格菜单样式覆盖
.menu-grid {
  padding: 10px 0;
  :deep(.van-grid-item__content) {
    background: transparent;
  }
  :deep(.van-grid-item__text) {
    color: #555;
    font-size: 12px;
  }
}

// 5. 横向历史记录
.history-section {
  padding: 15px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    h3 { margin: 0; font-size: 16px; }
    .more { font-size: 12px; color: #999; }
  }

  .history-scroll {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 5px; // 留出滚动条空间
    
    &::-webkit-scrollbar {
      display: none;
    }

    .history-item {
      flex-shrink: 0;
      width: 100px;
      
      .cover {
        position: relative;
        width: 100%;
        height: 60px;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 6px;
        
        img { width: 100%; height: 100%; object-fit: cover; }
        
        .play-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          opacity: 0;
          transition: opacity 0.2s;
        }
      }

      &:hover .play-overlay {
        opacity: 1;
      }

      .title {
        display: block;
        font-size: 12px;
        color: #333;
      }
      
      .progress {
        font-size: 10px;
        color: #999;
      }
    }
  }
}

// 6. 列表菜单 & 退出按钮
.list-section {
  :deep(.van-cell) {
    padding: 15px;
    align-items: center;
  }
}

.logout-box {
  padding: 0 30px;
  margin-top: 30px;
  
  .logout-btn {
    box-shadow: 0 4px 15px rgba(255, 154, 158, 0.3);
  }
}

.bottom-spacer {
  height: 90px;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>