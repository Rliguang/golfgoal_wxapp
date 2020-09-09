/**
 * 球场接口列表
 */
import http from '../request/http.js'; //导入http中axios封装方法

export default {
	//默认高尔夫场地
	courseRequest(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/course/one',
			method: 'post'
		})
	},

	//选择球场信息
	chooseEndsRequest(params) {
		return http.httpRequest({
			url: '/api/biz/golf/course/page',
			method: 'post'
		}, params)
	},
};
