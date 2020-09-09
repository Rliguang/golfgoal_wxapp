import Vue from 'vue'
import Vuex from 'vuex'
import api from '../module/api/index.js'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		// userToken: utils.local.get('userToken') || '', //用户token
		userInfo: uni.getStorageSync('userInfo') || {}, //用户信息数据
		openId: uni.getStorageSync('openId') || '', //openId数据
		courseDefultInfo: uni.getStorageSync('courseDefultInfo') || {}//默认球场信息数据
	},
	mutations: {
		//用户信息数据
		userInfo: (state, data) => {
			state.userInfo = data
		},
		//openId数据
		openId: (state, data) => {
			state.openId = data
		},
		//默认球场信息数据
		courseDefultInfo: (state, data) => {
			state.courseDefultInfo = data
		},
	},
	getters: {
		userInfo: (state) => state.userInfo, //用户信息数据
		openId: (state) => state.openId, //openId
		courseDefultInfo: (state) => state.courseDefultInfo, //默认球场信息数据
	},
	actions: {
		//球场信息初始数据请求
		async golfCourse({
			commit
		}) {
			const {
				data: res
			} = await api.course.courseRequest()
			if (res.code === 0) {
				commit('courseDefultInfo', res.data);
				uni.setStorage({ //球场信息存入本地
					key: 'courseDefultInfo',
					data: res.data,
				});
			}
		},
	}
})
export default store
