import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { store } from './store'

// TDesign
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'
import './theme-style.css'

createApp(App).use(store).use(TDesign).use(router).mount('#app')
