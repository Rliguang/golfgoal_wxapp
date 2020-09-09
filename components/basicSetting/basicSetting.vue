<template>
	<view class="golf-createForm">
		<view class="golf-formContent">
			<view class="golf-forminfo">
				<view class="golf-formItem flex flex-between">
					<text>开赛时间：</text>
					<view class="flex flex-start">
						<picker mode="date" :value="date" @change="bindDateChange">
							<text class="golf-date">{{date}}</text>
						</picker>
						<picker mode="time" :value="time" @change="bindTimeChange">
							<text class="golf-time">{{time}}</text>
						</picker>
					</view>
				</view>
				<view class="golf-formItem right flex flex-between" @click="bindSiteChange">
					<text>比赛球场：</text>
					<text class="golf-site">{{courseDefultInfo.courseName}}</text>
				</view>
				<view class="golf-formItem right flex flex-between">
					<text>同组人数：</text>
					<picker @change="bindNumChange" mode='selector' range-key="name" :value="index" :range="num">
						<text class="golf-site">{{num[index].name}}</text>
					</picker>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				index: 0,
				num: [{
					id: 1,
					name: '4人或以内同组'
				}],
				date: '日期', //开赛日期
				time: '时间', //开赛时间
			}
		},
		created() {
			this.getNowDate() //获取当前时间
		},
		methods: {
			//获取当前日期时间
			getNowDate() {
				let nowDate = new Date();
				this.date = this.$utils.nowDate(nowDate)
				this.time = this.$utils.nowTime(nowDate, 0)
			},

			//获取开赛日期
			bindDateChange(e) {
				this.date = e.detail.value;
				this.$emit("gamesDate", `${this.date} ${this.time}`);
			},

			//获取开赛时间
			bindTimeChange(e) {
				this.time = e.detail.value;
				this.$emit("gamesTime", `${this.date} ${this.time}`);
			},

			//比赛球场
			bindSiteChange() {
				uni.navigateTo({
					url: "/pages/chooseEnds/chooseEnds"
				})
			},

			//同组人数
			bindNumChange(e) {
				this.index = e.detail.value;
			},

			// getphonenumber(e) {
			// 	if (e.detail.iv) {
			// 		uni.showToast({
			// 			title: '已授权',
			// 			icon: 'none',
			// 			duration: 2000
			// 		})
			// 	}
			// },

			// savaInfo() {
			// 	let that = this;
			// 	let nickname = that.nickName;
			// 	let headimg = that.headimg;
			// 	let gender = that.index + 1;
			// 	let mobile = that.mobile;
			// 	let region = that.region;
			// 	let birthday = that.date;
			// 	let description = that.description;
			// 	let updata = {};
			// 	if (!nickname) {
			// 		uni.showToast({
			// 			title: '请填写昵称',
			// 			icon: 'none',
			// 			duration: 2000
			// 		});
			// 		return;
			// 	}
			// updata.nickname = nickname;
			// if (!headimg) {
			// 	headimg = that.avater;
			// }
			// 	updata.headimg = headimg;
			// 	updata.gender = gender;
			// 	if (that.isPoneAvailable(mobile)) {
			// 		updata.mobile = mobile;
			// 	} else {
			// 		uni.showToast({
			// 			title: '手机号码有误，请重填',
			// 			icon: 'none',
			// 			duration: 2000
			// 		});
			// 		return;
			// 	}
			// 	if (region.length == 1) {
			// 		uni.showToast({
			// 			title: '请选择常住地',
			// 			icon: 'none',
			// 			duration: 2000
			// 		});
			// 		return;
			// 	} else {
			// 		updata.province = region[0];
			// 		updata.city = region[1];
			// 		updata.area = region[2];
			// 	}
			// 	if (birthday == "0000-00-00") {
			// 		uni.showToast({
			// 			title: '请选择生日',
			// 			icon: 'none',
			// 			duration: 2000
			// 		});
			// 		return;
			// 	}
			// 	updata.birthday = birthday;
			// 	updata.description = description;
			// 	that.updata(updata);
			// },
			// isPoneAvailable(poneInput) {
			// 	var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
			// 	if (!myreg.test(poneInput)) {
			// 		return false;
			// 	} else {
			// 		return true;
			// 	}
			// },
			// async updata(datas) {
			// 	//传后台
			// },
			// imgUpload(file) {
			// 	let that = this;
			// 	uni.uploadFile({
			// 		header: {
			// 			Authorization: uni.getStorageSync('token')
			// 		},
			// 		url: '/api/upload/image', //需传后台图片上传接口
			// 		filePath: file[0],
			// 		name: 'file',
			// 		formData: {
			// 			type: 'user_headimg'
			// 		},
			// 		success: function(res) {
			// 			var data = JSON.parse(res.data);
			// 			data = data.data;
			// 			that.avater = that.url + data.img;
			// 			that.headimg = that.url + data.img;
			// 		},
			// 		fail: function(error) {
			// 		}
			// 	});
			// },
		},
		computed: {
			...mapGetters(['courseDefultInfo'])
		},
		onLoad() {}
	}
</script>

<style scoped>
	.golf-createForm {
		margin-bottom: 54rpx;
	}

	.golf-formItem {
		width: 100%;
		text-align: left;
		padding: 40rpx 0;
		border-bottom: 2rpx solid #eee;
		position: relative;
	}

	.golf-date,
	.golf-time {
		margin-right: 20rpx;
		height: 44rpx;
		background: #eee;
		border-radius: 22rpx;
		padding: 6rpx 24rpx;
		color: #999;
	}

	.golf-time {
		padding: 6rpx 60rpx;
	}

	.golf-site {
		padding-right: 20rpx;
		font-size: 28rpx;
		color: #999;
		line-height: 40rpx;
	}

	.right:after {
		content: ' ';
		width: 20rpx;
		height: 20rpx;
		border-top: 2rpx solid #b0afb2;
		border-right: 2rpx solid #b0afb2;
		transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		/* IE 9 */
		-moz-transform: rotate(45deg);
		/* Firefox */
		-webkit-transform: rotate(45deg);
		/* Safari 和 Chrome */
		-o-transform: rotate(45deg);
		position: absolute;
		top: 50rpx;
		right: 0;
	}
</style>
