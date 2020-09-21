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
	},
	//添加PK  打鸟数PK
	createBirdsPk(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/pk/createBirdsPk',
			method: 'post'
		}, params)
	},
	//添加PK  球洞PK
	createHitsPk(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/pk/createHitsPk',
			method: 'post'
		}, params)
	},
	//获取一个指定的高尔夫场地
	getOneCourse(params) {
		return http.httpRequest({
			url: '/api/biz/golf/scheduleCourse/getOneCourse',
			method: 'post'
		}, params)
	},
	//获取一个指定的高尔夫场地
	getCourseAlbumList(params) {
		return http.httpRequest({
			url: '/api/biz/golf/scheduleCourse/getCourseAlbumList',
			method: 'post'
		}, params)
	},
	
	//获取围观群众列表
	tournamentGalleries(params) {
		return http.httpRequest({
			url: '/api/biz/golf/scoreCard/tournamentGalleries',
			method: 'post'
		}, params)
	},
	
	//获取围观群众列表
	checkLikePasswd(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/pk/checkLikePasswd',
			method: 'post'
		}, params)
	},
	//活动订单预生成
	activityPreOrder(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/activity/activityPreOrder',
			method: 'post'
		}, params)
	},
	
	//订场下单付款 微信验证
	activityUnifiedpay(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/activity/activityUnifiedpay',
			method: 'post'
		}, params)
	},
	//获取活动列表
	activityList(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/activity/list',
			method: 'post'
		}, params)
	},
	//获取活动详情
	getOneActivity(params) {
		return http.httpRequest({
			url: '/api/biz/golf/activity/getOneActivity',
			method: 'post'
		}, params)
	},
	
	
	
	
	
	
};