import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import { createPinia } from 'pinia' 
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import './registerServiceWorker'
import "primevue/resources/themes/aura-light-green/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core CSS
import "primeicons/primeicons.css"; //icons
import Tooltip from 'primevue/tooltip'

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

createApp(App).directive('tooltip', Tooltip).use(router).use(PrimeVue).use(pinia).mount('#app');