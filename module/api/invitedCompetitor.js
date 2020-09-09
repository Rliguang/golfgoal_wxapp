/**
 * 球局接口列表
 */
import http from '../request/http.js'; //导入http中axios封装方法

export default {
	//邀请球员页面,调用场景:新建球局-下一步-扫码添加
	inviteGolferPage(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/tournament/inviteGolferPage',
			method: 'post'
		}, params)
	},
	//通过ID查昵称
	tournamentInfo(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/tournament/info',
			method: 'post'
		}, params)
	}
	
};
