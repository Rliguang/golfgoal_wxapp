/**
 * 球局接口列表
 */
import http from '../request/http.js'; //导入http中axios封装方法

export default {
	//我的
	mineInfo(params) {
		return http.httpRequest({
			url: '/api/biz/golf/gallery/mineInfo',
			method: 'post'
		}, params)
	}
};
