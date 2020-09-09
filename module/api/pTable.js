/**
 * 记分卡接口列表
 */
import http from '../request/http.js'; //导入http中axios封装方法

export default {
	//记分卡获取     
	scoreCard(params) {
		return http.httpRequest({
			url: '/api/biz/golf/tournamentHoleScore/scorecard',
			method: 'post'
		}, params)
	}
};