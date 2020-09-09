/**
 * 获取所有球友接口列表
 */
import http from '../request/http.js'; //导入http中axios封装方法

export default {
	//球友获取     
	getMygolfer(params) {
		return http.httpRequest({
			url: '/api/biz/golf/gallery/myGolfer',
			method: 'post'
		}, params)
	}
};