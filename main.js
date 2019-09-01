import Vue from 'vue'
import App from './App'
import store from './store'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$serverUrl = 'https://www.dcloud.io/demo'
Vue.prototype.$store = store

const app = new Vue({
	store,
    ...App
})
app.$mount()
