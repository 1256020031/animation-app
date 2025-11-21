<template>
  <div class="login-container">
    <!-- 背景层 -->
    <div class="background-layer"></div>

    <div class="login-card">
      <!-- 头像区域 -->
      <div class="avatar-wrapper">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" class="avatar" />
      </div>

      <div class="title-group">
        <h1>Welcome Back!</h1>
        <p>开启你的二次元之旅 ✨</p>
      </div>

      <!-- Vant 表单组件 -->
      <van-form @submit="onSubmit" @failed="onFailed" class="anime-form">
        
        <!-- 账号输入框 -->
        <div class="input-bubble">
          <van-field
            v-model="form.username"
            name="username"
            placeholder="请输入账号 / 昵称"
            :rules="rules.username"
            autocomplete="off"
          >
            <!-- 自定义左侧图标 -->
            <template #left-icon>
              <span class="custom-icon">🌸</span>
            </template>
          </van-field>
        </div>

        <!-- 密码输入框 -->
        <div class="input-bubble">
          <van-field
            v-model="form.password"
            type="password"
            name="password"
            placeholder="请输入密码"
            :rules="rules.password"
            autocomplete="off"
          >
            <template #left-icon>
              <span class="custom-icon">🔐</span>
            </template>
          </van-field>
        </div>

        <!-- 记住我 & 忘记密码 -->
        <div class="options">
          <!-- 使用 Vant Checkbox，自定义颜色 -->
          <van-checkbox v-model="form.remember" checked-color="#ff9a9e" icon-size="16px">
            <span class="opt-text">记住我</span>
          </van-checkbox>
          <a href="#" class="forgot-pwd">忘记密码?</a>
        </div>

        <!-- 登录按钮 -->
        <div class="btn-wrapper">
          <van-button 
            round 
            block 
            type="primary" 
            native-type="submit"
            color="linear-gradient(to right, #ff9a9e, #fecfef)"
            class="anime-btn"
          >
            登 录 Login
          </van-button>
        </div>

      </van-form>

      <div class="footer">
        <span>还没有账号? </span>
        <a href="#" class="register-link">立即注册 ></a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, } from 'vue';
import { useRouter } from 'vue-router';
// 引入 Vant 组件样式 (如果你配置了自动引入插件 unplugin-vue-components 则不需要这两行)
import { showToast, showLoadingToast, closeToast } from 'vant';

// 定义表单数据接口
interface LoginForm {
  username: string;
  password: string;
  remember: boolean;
}

const form = reactive<LoginForm>({
  username: '',
  password: '',
  remember: false
});

// 校验规则 (Vant 格式)
const rules = {
  username: [
    { required: true, message: '请填写账号捏 ( >﹏< )' }
  ],
  password: [
    { required: true, message: '密码不能为空哦~' }
  ]
};

const router = useRouter();
// 提交表单
const onSubmit = (values: any) => {
  console.log('验证通过:', values);
  
  // 显示加载中
  const toast = showLoadingToast({
    message: '少女祈祷中...',
    forbidClick: true,
    duration: 0, // 持续展示直到手动关闭
  });


  router.push('/HomePage');
    closeToast(); // 关闭加载
  // 模拟网络请求
  // setTimeout(() => {
  //   showToast({
  //     message: `欢迎回来，${form.username}酱！(o^▽^o)`,
  //     type: 'success',
  //     icon: 'like-o' // 使用心形图标
  //   });
  // }, 1500);
};

// 校验失败的回调
const onFailed = (errorInfo: any) => {
  console.log('校验失败', errorInfo);
  showToast({
    message: errorInfo.errors[0].message,
    type: 'fail',
    icon: 'close'
  });
};
</script>

<style lang="scss" scoped>
// 引入圆体字
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700&display=swap');

// 变量定义
$primary-pink: #ff9a9e;
$card-bg: rgba(255, 255, 255, 0.80);
$shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);

.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-family: 'M PLUS Rounded 1c', sans-serif;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2692&auto=format&fit=crop') no-repeat center center;
  background-size: cover;
  filter: blur(5px);
  z-index: -1;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.2);
  }
}

.login-card {
  width: 90%; // 移动端宽度适配
  max-width: 380px;
  padding: 50px 25px 30px;
  background: $card-bg;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: $shadow;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
  // 浮动动画
  animation: cardFloat 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.avatar-wrapper {
  position: absolute;
  top: -45px;
  width: 90px;
  height: 90px;
  background: #fff;
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  
  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #f0f2f5;
  }
}

.title-group {
  text-align: center;
  margin-bottom: 25px;
  h1 { font-size: 22px; color: #333; margin-bottom: 5px; }
  p { font-size: 13px; color: #888; }
}

.anime-form {
  width: 100%;
}

// --- Vant 样式魔改核心区域 ---

// 1. 气泡输入框容器
.input-bubble {
  margin-bottom: 16px;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
  transition: all 0.3s;
  
  // 聚焦时的外发光效果（需要配合 JS 也可以纯 CSS 模拟，这里简化处理）
  &:focus-within {
    box-shadow: 0 0 0 2px rgba(255, 154, 158, 0.3);
    transform: translateY(-1px);
  }
}

// 2. 深度覆盖 Vant Field 样式
:deep(.van-cell) {
  background-color: rgba(245, 247, 250, 0.8); // 浅灰背景
  padding: 12px 16px;
  
  // 去除 Vant 默认的底部细线
  &::after {
    display: none;
  }

  // 输入框文字颜色
  .van-field__control {
    color: #555;
    font-size: 14px;
  }

  // 错误提示文字对齐调整
  .van-field__error-message {
    text-align: right;
    margin-top: 4px;
  }
}

.custom-icon {
  font-size: 18px;
  margin-right: 8px;
}

// 3. 选项区域
.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 8px;
  
  .opt-text {
    font-size: 12px;
    color: #666;
  }

  .forgot-pwd {
    font-size: 12px;
    color: $primary-pink;
    text-decoration: none;
  }
}

// 4. 按钮魔改
.btn-wrapper {
  margin-top: 10px;
}

.anime-btn {
  font-size: 16px;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(255, 154, 158, 0.4);
  border: none;
  height: 44px;
  transition: all 0.3s;

  // 按钮点击时的动画
  &:active {
    transform: scale(0.96);
  }
}

.footer {
  margin-top: 20px;
  font-size: 12px;
  color: #666;

  .register-link {
    color: #5CA1FE;
    font-weight: bold;
    margin-left: 5px;
  }
}

@keyframes cardFloat {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>