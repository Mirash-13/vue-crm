import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import VueOnClickout from 'vue-on-clickout';
import VueTilt from 'vue-tilt.js'

Vue.use(VueOnClickout);
Vue.use(VueTilt)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
