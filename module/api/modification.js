/**
 * 计分接口列表
 */
import http from '../request/http.js'; //导入http中axios封装方法

export default {
	//开球
	saveGame(params) {
		return http.httpJsonRequest({
			url: '/api/biz/golf/tournament/update',
			method: 'post'
		}, params)
	}
};
