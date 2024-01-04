import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import './styles/main.css'
import App from './App.vue'
import initializeRouter from './router'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)

app.component('FontAwesomeIcon', FontAwesomeIcon)

initializeRouter(app)

app.mount('#app')
