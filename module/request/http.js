import {
	baseUrl
} from '../config/config.js';
// import app from '../../main.js'
// Api.login.toeknRequest({ //获取token值
// 	data: {
// 		clientId: '23ajqbxews94av3tz9otrtz0',
// 		clientSecret: '8jqmoew9u9d3hbx0goahjdk44n8p5ehc',
// 	},
// 	success: res => {
// 		uni.setStorage({
// 			key: 'token',
// 			data: `Bearer ${res.data.data.access_token}`,
// 		});
// 	}
// })

//application/x-www-form-urlencoded http请求
const httpRequest = (opts, params) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + opts.url,
			method: opts.method,
			data: params.data,
			dataType: 'json',
			header: {
				"Content-type": 'application/x-www-form-urlencoded',
				"Authorization": uni.getStorageSync("token") || '',
			},
			success: (res) => {
				resolve(res)
				// if (res.statusCode === 200 && res.data.code === 0) {
					
				// 	params.success && params.success(res)
				// } else {
				// 	if (res.data.code === 40002) {
				// 	}
				// }
			},
			fail: (res) => {
				reject(res)
				params.fail && params.fail(res)
			}
		})
	})
};

//application/json http请求
const httpJsonRequest = (opts, params) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + opts.url,
			method: opts.method,
			data: params === undefined ? '' : params.data,
			dataType: 'json',
			header: {
				"Content-type": 'application/json',
				"Authorization": uni.getStorageSync("token") || '',
			},
			success: (res) => {
				resolve(res)
				// if (res.statusCode === 200 && res.data.code === 0) {
				// 	// params.success && params.success(res)
				// }
			},
			fail: (res) => {
				reject(res)
				// params.fail && params.fail(res)
			}
		})
	})
};

// option           ========>  object
// option.url       =>    url地址               =>     string                             =>    必填
// option.method    =>    请求方式，            =>      string 取值 GET POST 默认POST      =>    选填
// option.header    =>    请求header头          =>      object                            =>    选填
// option.data      =>    请求参数              =>      object                            =>    选填
// option.loading   =>    是否显示加载动画       =>      boolean 取值true false 默认false   =>    选填
// option.loadtext  =>    加载提示语            =>       string  默认 加载中...            =>    选填
// option.msg       =>    请求失败提示语        =>       string  不穿即不显示 默认空       =>     选填

// export default class api {
// syncRequest = function(option) {
// 	option.method = option.method ? option.method : "POST";
// 	option.header = option.header ? option.header : {};
// 	option.data = option.data ? option.data : {};
// 	option.loading = option.loading ? true : false;
// 	option.loadtext = option.loadtext ? option.loadtext : '加载中...';
// 	if (option.method == "GET") {
// 		option.header['Content-Type'] = 'application/json;charset=UTF-8'
// 	} else {
// 		option.header['Content-Type'] = 'application/x-www-form-urlencoded'
// 	}
// 	if (option.loading) {
// 		uni.showLoading({
// 			mask: true,
// 			title: option.loadtext
// 		})
// 	}
// 	return new Promise((resolve, reject) => {
// 		uni.request({
// 			url: baseUrl + opts.url,
// 			method: opts.method,
// 			data: params.data,
// 			dataType: 'json',
// 			header: {
// 				"Content-type": 'application/json',
// 				"Authorization": uni.getStorageSync("token") || '',
// 			},
// 			success: (res) => {
// 				// if (option.loading) {
// 				// 	uni.hideLoading()
// 				// }
// 				if (res.statusCode === 200 && res.data.code === 0) {
// 					resolve(res)
// 					// params.success && params.success(res)
// 				}
// 				// if (res.statusCode == 200) {
// 				// 	resolve(res);
// 				// } 
// 				// else {
// 				// 	if (option.msg) {
// 				// 		uni.showToast({
// 				// 			icon: "none",
// 				// 			title: option.msg
// 				// 		})
// 				// 	}
// 				// }

// 			},
// 			fail: (err) => {
// 				// if (option.loading) {
// 				// 	uni.hideLoading()
// 				// }
// 				// if (option.msg) {
// 				// 	uni.showToast({
// 				// 		icon: "none",
// 				// 		title: option.msg
// 				// 	})
// 				// }
// 				reject(err)
// 			}
// 		});
// 	})
// }
// }


export default {
	httpRequest,
	httpJsonRequest
}
