/**
 * 修改记分接口列表
 */
import http from '../request/http.js'; //导入http中axios封装方法

export default {
	//记分卡获取     
	getScore(params) {
		return http.httpRequest({
			url: '/api/biz/golf/tournamentHoleScore/getHole',
			method: 'post'
		}, params)
	},
	holeScore(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/tournamentHoleScore/holeScore',
			method: 'post'
		}, params)
	},
	//删除球洞数据
	clearHoleScore(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/score/clearHoleScore',
			method: 'post'
		}, params)
	},
	
	
	// 设置首次开球洞
	setFirstHole(params) {
		return http.httpRequest({
			url: '/api/biz/golf/tournament/setFirst',
			method: 'post'
		}, params)
	},
};