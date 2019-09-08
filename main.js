//import 'weapp-cookie'
import Vue from 'vue'
import App from './App'
import store from './store'

import client from '@kqtec/graphql-uni-app-client'

Vue.config.productionTip = false

App.mpType = 'app'

const serverUrl = 'http://localhost:8000/api/gql'

Vue.prototype.$serverUrl = serverUrl
Vue.prototype.$store = store
Vue.prototype.$client = new client({
	uri: serverUrl, 
})

const app = new Vue({
	store,
	...App
})
app.$mount()
