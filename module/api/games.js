/**
 * 球局接口列表
 */
import http from '../request/http.js'; //导入http中axios封装方法

export default {
	//创建新球局
	gamesRequest(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/tournament/create',
			method: 'post'
		}, params)
	},

	//创建高尔夫比赛下一步信息
	createNextRequest(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/tournament/createNext',
			method: 'post'
		}, params)
	},

	//确认排序开球
	arrangeRequest(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/tournament/orderKickoff',
			method: 'post'
		}, params)
	},
	
	//我的球友
	myGolfer(params) {
		return http.httpRequest({
			url: '/api/biz/golf/gallery/myGolfer',
			method: 'post'
		}, params)
	}
};
