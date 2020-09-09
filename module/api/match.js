/**
 * 首页球局接口列表
 */
import http from '../request/http.js'; //导入http中axios封装方法

export default {
	//TOKEN获取     
	tournamentPage(params) {
		return http.httpRequest({
			url: '/api/biz/golf/tournament/page',
			method: 'post'
		}, params)
	},
	//绑定球手
	bindGaller(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/tournamentGallery/invite',
			method: 'post'
		}, params)
	},
	//绑定观众2
	bindGallerInvite(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/tournamentGallery/invite',
			method: 'post'
		}, params)
	},
	//进入围观 判断是否是球手或者创建者
	getTournamentGallery(params) {
		return http.httpRequest({
			url: '/api/biz/golf/firstPage/getTournamentGallery',
			method: 'post'
		}, params)
	}
	
	
};