import Vue from 'vue'

// 请求地址
// export const baseUrl = 'https://cloud.dingqiangkeji.com';  //生产环境
export const baseUrl = 'https://sit.qiangyunkj.com'; //测试环境


// 将全局配置挂载到Vue原型上
Vue.prototype.$config = {
	baseUrl
};
