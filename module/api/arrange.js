/**
 * 排列开球接口
 */
import http from '../request/http.js'; //导入http中axios封装方法

export default {
	//获取球员信息
	getGolfer(params) {
		return http.httpRequest({
			url: '/api/biz/golf/tournamentGallery/getGolfer',
			method: 'post'
		}, params)
	},

	// 排列开球
	orderKickoff(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/tournament/orderKickoff',
			method: 'post'
		}, params)
	},
};
