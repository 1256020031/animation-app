import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css';
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';
import 'vant/es/image-preview/style';

const app = createApp(App)
app.use(router)
app.mount('#app')
