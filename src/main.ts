import { createApp } from 'vue'
import { router } from './router'
import { createPinia } from 'pinia'
import App from './App.vue'

// TDesign
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'

//自定义全局样式
import './style.css'

createApp(App).use(createPinia()).use(TDesign).use(router).mount('#app')
