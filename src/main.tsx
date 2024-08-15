import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import '@fontsource-variable/inter';
import 'element-plus/dist/index.css'
import './main.css'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

declare global {
  const Blockly: any
  const BlocklyWorkspace: any
}

const v = createApp(App)
v.use(ElementPlus)
v.mount('#app')
