/**
 * 球员接口列表
 */
import http from '../request/http.js'; //导入http中axios封装方法

export default {
	//手动添加球友信息
	addManualRequest(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/gallery/manualAdd',
			method: 'post'
		}, params)
	},

	
	//我的球友
	myGolferRequest(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/gallery/myGolfer',
			method: 'post'
		}, params)
	},
	
	//获取比赛观众
	spectatorRequest(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/gallery/tournamentGalleries',
			method: 'post'
		}, params)
	},
	//删除球手与比赛关联关系
	tournamentGalleryRemove(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/tournamentGallery/remove',
			method: 'post'
		}, params)
	},
	
	
};
