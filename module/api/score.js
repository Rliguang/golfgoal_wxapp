/**
 * 计分接口列表
 */
import http from '../request/http.js'; //导入http中axios封装方法

export default {
	//开球
	startPlay(params) {
		return http.httpRequest({
			url: '/api/biz/golf/tournament/kickoff',
			method: 'post'
		}, params)
	},
	getPkList(params) {
		return http.httpRequest({
			url: '/api/biz/golf/tournamentPk/pkListByGolfer',
			method: 'post'
		}, params)
	},
	getPkInfo(params) {
		return http.httpRequest({
			url: '/api/biz/golf/tournamentPk/getPkByGolfer',
			method: 'post'
		}, params)
	},
	getLikeGroupList(params) {
		return http.httpRequest({
			url: '/api/biz/golf/tournamentPk/listGroup',
			method: 'post'
		}, params)
	},
	subLike(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/tournamentPk/likeGroupBatch',
			method: 'post'
		}, params)
	},
	getLikeList(params) {
		return http.httpRequest({
			url: '/api/biz/golf/tournamentPk/likeInfo',
			method: 'post'
		}, params)
	},
	getGrounpList(params) {
		return http.httpRequest({
			url: '/api/biz/golf/tournamentPk/likeGroup',
			method: 'post'
		}, params)
	},
	spgetPkList(params) {
		return http.httpRequest({
			url: '/api/biz/golf/tournamentPk/pkListByGallery',
			method: 'post'
		}, params)
	},
	addPk(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/tournamentPk/addPk',
			method: 'post'
		}, params)
	},
	deletePk(params) {
		return http.httpRequest({
			url: '/api/biz/golf/tournamentPk/removePk',
			method: 'post'
		}, params)
	},
	//取消球局
	removeGame(params) {
		return http.httpRequest({
			url: '/api/biz/golf/tournament/remove',
			method: 'post'
		}, params)
	},
	//观众获取比赛信息
	// pkListByGallery(params) {
	// 	return http.httpRequest({
	// 		url: '/api/biz/golf/tournamentPk/pkListByGallery',
	// 		method: 'post'
	// 	}, params)
	// }
	//结束比赛
	tournamentEnd(params) {
		return http.httpRequest({
			url: '/api/biz/golf/tournament/end',
			method: 'post'
		}, params)
	},
	
};
//获取pk列表
