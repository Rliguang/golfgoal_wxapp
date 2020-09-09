/**
 * 登录接口列表
 */
import http from '../request/http.js'; //导入http中axios封装方法

export default {
	//TOKEN获取     
	toeknRequest(params) {
		return http.httpRequest({
			url: '/api/admin/auth/getAccessTokenByClient',
			method: 'post'
		}, params)
	},

	//OpenId获取
	openIdRequest(params) {
		return http.httpRequest({
			url: '/api/biz/wxapp/getOpenId',
			method: 'post'
		}, params)
	},

	//登录和注册获取用户信息
	loginRequest(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/gallery/loginOrRegister',
			method: 'post'
		}, params)
	},
};