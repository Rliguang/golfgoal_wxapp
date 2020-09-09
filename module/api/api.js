/**
 * 所有接口
 */
import http from '../request/http.js'; //导入http中axios封装方法

export default {
	//创建比赛
	createTournamentCreate(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/createTournament/create',
			method: 'post'
		}, params)
	},
	//手动添加球手
	manualAddPlayer(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/updateGolfer/manualAdd',
			method: 'post'
		}, params)
	},
	//PK添加点赞接口
	likeGroup(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/tournamentPk/likeGroup',
			method: 'post'
		}, params)
	},
	//打球记录
	playLogPage(params) {
		return http.httpRequest({
			url: '/api/biz/golf/mine/playLogPage',
			method: 'post'
		}, params)
	},
	//围观记录
	lookLogPage(params) {
		return http.httpRequest({
			url: '/api/biz/golf/mine/lookLogPage',
			method: 'post'
		}, params)
	}
	
	
};