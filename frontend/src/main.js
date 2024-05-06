import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import { createPinia } from 'pinia' 
import './registerServiceWorker'
import "primevue/resources/themes/aura-light-green/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core CSS
import "primeicons/primeicons.css"; //icons

createApp(App).use(router).use(PrimeVue).use(createPinia()).mount('#app');