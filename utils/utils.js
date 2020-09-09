const utils = {
	//设置localStorage缓存
	local: {
		set(key, value) {
			localStorage.setItem(key, JSON.stringify(value));
		},
		get(key) {
			return JSON.parse(localStorage.getItem(key));
		},
		clear() {
			localStorage.clear();
		},
		remove(key) {
			localStorage.removeItem(key);
		}
	},
	//设置sessionStorage缓存
	session: {
		set(key, value) {
			sessionStorage.setItem(key, JSON.stringify(value));
		},
		get(key) {
			return JSON.parse(sessionStorage.getItem(key));
		},
		clear() {
			sessionStorage.clear();
		},
		remove(key) {
			sessionStorage.removeItem(key);
		}
	},
	/** 
	 * 获取当前日期
	 * @param {time} str [GMT字符串] 
	 */
	nowDate(str) {
		const Year = str.getFullYear();
		const Month = str.getMonth() + 1 < 10 ? `0${(str.getMonth() + 1)}` : str.getMonth() + 1;
		const Day = str.getDate() < 10 ? `0${(str.getDate())}` : str.getDate();
		const dateLog = `${Year}-${Month}-${Day}`;
		return `${dateLog}`
	},

	/**
	 * 获取当前时间
	 * @param {time} str [GMT字符串] 
	 */
	nowTime(str, sec) {
		const Hours = str.getHours() < 10 ? `0${(str.getHours())}` : str.getHours();
		const Minutes = str.getMinutes() < 10 ? `0${(str.getMinutes())}` : str.getMinutes();
		const Second = str.getSeconds() < 10 ? `0${(str.getSeconds())}` : str.getSeconds();
		if (sec === 0) {
			const timeLog = `${Hours}:${Minutes}`;
			return `${timeLog}`
		} else {
			const timeLog = `${Hours}:${Minutes}:${Second}`;
			return `${timeLog}`
		}
	},

	/** 
	 * 电话号码验证方法
	 * @param {String} str [电话号字符串] 
	 */
	isMobilePhone(string) {
		const qqReg = /^(13|14|15|17|18|19)\d{9}$/;
		if (qqReg.test(string)) return true
	},
	isColor(num) {
		switch (num) {
			case 1:
				return 'black'
				break
			case 2:
				return 'gold'
				break
			case 3:
				return 'blue'
				break
			case 4:
				return 'white'
				break
			case 5:
				return 'red'
				break
			default:
				return ''
		}
	}

};

export default utils;
