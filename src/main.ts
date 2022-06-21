import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { store } from './store'

// TDesign
import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/es/style/index.css'
import './theme-style.css'

const app = createApp(App)

app.use(router).use(store).use(TDesign).mount('body')
