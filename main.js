import Vue from 'vue'
import App from './App'
import Api from './module/api/index.js'
import store from './store'
import utils from './utils/utils.js'
import './static/css/global.css'

Vue.config.productionTip = false
Vue.prototype.$api = Api;
Vue.prototype.$store = store;
Vue.prototype.$utils = utils;

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()