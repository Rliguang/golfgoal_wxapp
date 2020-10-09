<template>
	<view class="container">
		<view class="imgs">
			<image v-if="activity.mainUrl" :src="'https://dingqiang-golf.oss-cn-shenzhen.aliyuncs.com/'+activity.mainUrl" mode=""></image>
		</view>
		<view class="sign-up">
			<view class="text">
				报名费用将用于高尔夫球场订场
			</view>
			<view class="click-on-the">
				<button class="click-on-the" type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo" @click="golfLogin"
				 hover-class="btn-hover">
					立即报名
				</button>
			</view>
		</view>
		<!-- <view class="show-data">
			<view class="">
				截止时间 {{activity.closeDate}}
			</view>
			<view class="">
				已报名: {{activity.number}}人
			</view>
		</view> -->
		
		<view class="time">
			<view class="text">
				开球时间
			</view>
			<view class="plug-in-data" @click="onShowDatePicker('date')">
				{{date}}
			</view>
			<view class="plug-in-time" @click="onShowDatePicker('time')">
				{{time}}
			</view>
		</view>
		<mx-date-picker :show="showPicker" :type="type" :value="value" :show-tips="true" :begin-text="'入住'" :end-text="'离店'"
		 :show-seconds="true" @confirm="onSelected" @cancel="onSelected" />
	</view>
</template>

<script>
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	export default {
		components: {
			MxDatePicker
		},
		data() {
			return {
				data: null,
				isThumbPassword: false, //是否展现密码输入弹窗
				contact: "",
				contactWay: "",
				activity: null, //活动数据
				showPicker: false,
				date: '2019/01/01',
				time: '09:00:00',
				type: 'rangetime',
				value: '',
			}
		},
		onLoad(options) {
			this.activityId = options.activityId
			this.activityList();
		},
		created() {
			var date = new Date();
			this.date = date.toISOString().replace(/T.*/, ' ');
		},
		mounted() {
		},
		//分享事件
		onShareAppMessage(res) {
			return {
				title: this.activity.activityTitle,
				path: '/pages/eventDetails/eventDetails',
			}
		},
		// 下拉刷新
		onPullDownRefresh() {},
		methods: {
			//时间显示
			onShowDatePicker(type) { 
				this.type = type;
				this.showPicker = true;
				this.value = this[type];
				console.log(this.value)
			},
			//时间选择
			onSelected(e) { 
				this.showPicker = false;
				if (e) {
					this[this.type] = e.value;
				}
			},
			//获取活动数据
			activityList() {
				this.$api.api.getOneActivity({
					data: {
						activityId: this.activityId,
					}
				}).then(res => {
					if (res.data.code === 0) {
						this.activity = res.data.data
					}
				})
			},
			signUp() {
				let detail = {
					activityId: this.activityId,
					courseName: this.activity.activityTitle,
					costUnitPrice: this.activity.price,
					scheduleDate: this.date + " " + this.time,
					type: 0, // 活动为0   订单列表为1
				}
				uni.navigateTo({ //跳入订单信息页面
					url: '/pages/orderInformation/orderInformation?detailDate=' + JSON.stringify(detail)
				});
			},
			//获取用户信息
			getUserInfo() {
				new Promise(resolve => {
					uni.getUserInfo({ //获取用户信息
						success: res => {
							resolve({
								nickName: res.userInfo.nickName, //昵称
								avatar: res.userInfo.avatarUrl, //头像
								sex: res.userInfo.gender, //性别 0未填 1 男性 2女性
							});
						}
					})
				}).then(resUserInfo => {
					uni.setStorage({
						key: 'userInfo',
						data: resUserInfo,
					});
					uni.showLoading({
						title: '正在加载中'
					})
					this.$store.commit('userInfo', resUserInfo) //保存至Vuex内存
					return new Promise(async resolve => {
						const {
							data: res
						} = await this.$api.login.loginRequest({
							data: {
								avatar: resUserInfo.avatar,
								creatorOpenId: this.openId || uni.getStorageSync('openId'),
								nickname: resUserInfo.nickName,
								sex: resUserInfo.sex,
								openId: this.openId || uni.getStorageSync('openId'),
								updatorOpenId: this.openId || uni.getStorageSync('openId'),
							},
						})
						if (res.code === 0) {
							uni.setStorage({ //高尔夫球员ID存入本地
								key: 'golfGalleryId',
								data: res.data.golfGalleryId,
							});
							uni.hideLoading()
							this.isThumbPassword = true;
							this.signUp()
						}
					})
				})
			},
			//点击授权登录获取信息
			async golfLogin() {
				/*  #ifndef  H5  */ //H5页面不生效
				new Promise(resolve => {
					uni.getProvider({ //获取设备权限信息
						service: 'oauth',
						success: res => {
							resolve(res);
						}
					})
				}).then(res => {
					uni.showLoading({
						title: '正在加载中'
					})
					return new Promise(resolve => {
						uni.login({ //登录加载获取code
							provider: `${res.provider[res.provider.length-1]}`,
							success: res => {
								resolve(res);
							}
						});
					}).then(loginCode => {
						return new Promise(resolve => {
			
							this.$api.login.openIdRequest({
								data: {
									code: loginCode.code
								}
							}).then(res => {
								if (res.data.code === 0) {
									this.openId = res.data.data.openid
									uni.setStorage({
										key: 'openId',
										data: res.data.data.openid,
									});
									this.$store.commit('openId', res.data.data.openid)
									resolve(res);
								}
							})
							//默认球场请求
							this.$store.dispatch('golfCourse')
						})
					})
				})
				/*  #endif  */
			},
			
		}
	}
</script>

<style scoped lang="less">
	.container {
		height: 100vh;
		background-color: #c2c2c2;
		margin: 0;
		padding: 0;
		// padding-bottom: 13vw;
		.imgs {
			width: 100%;
			image {
				width: 100%;
				height: 1346.4vw;
				margin-bottom: 37vw;
			}
		}
		
		.time {
			width: 93.6vw;
			height: 14.4vw;
			background-color: #ffffff;
			display: flex;
			padding: 0 3.2vw;
			position: fixed;
			bottom: 25.2vw;
			.text {
				width: 45vw;
				height: 14.4vw;
				line-height: 14.4vw;
				font-size: 3.73vw;
				color: #333333;
			}
		
			.plug-in-data {
				width: 25vw;
				height: 5.87vw;
				line-height: 5.87vw;
				background-color: #eeeeee;
				border-radius: 2.93vw;
				margin-top: 4.27vw;
				margin-right: 1.47vw;
				font-size: 3.2vw;
				color: #0dd561;
				padding: 0 3.87vw;
				text-align: center;
			}
		
			.plug-in-time {
				width: 20vw;
				height: 5.87vw;
				line-height: 5.87vw;
				background-color: #eeeeee;
				border-radius: 2.93vw;
				font-size: 3.2vw;
				color: #0dd561;
				margin-top: 4.27vw;
				padding: 0 3.87vw;
				text-align: center;
			}
		}
		
		.sign-up {
			width: 100vw;
			height: 25.2vw;
			background-color: #ffffff;
			border-radius: 0vw;
			position: fixed;
			bottom: 0;

			.text {
				height: 10vw;
				line-height: 10vw;
				color: #999999;
				font-size: 3.47vw;
				text-align: center;
			}

			.click-on-the {
				width: 93.6vw;
				height: 11.73vw;
				line-height: 11.73vw;
				text-align: center;
				background-color: #0dd561;
				border-radius: 1.07vw;
				font-size: 4.8vw;
				margin: auto;
				color: #ffffff;
			}
		}

		.show-data {
			height: 5.6vw;
			position: fixed;
			bottom: 40vw;
			right: 3.2vw;
			display: flex;
			justify-content: flex-end;

			>view {
				font-size: 3.47vw;
				margin-left: 3.2vw;
				line-height: 5.6vw;
				color: #999999;
				background-color: #000000;
				border-radius: 1.07vw;
				opacity: 0.6;
				padding: 0 1.33vw;
			}
		}

		.mask {
			width: 100vw;
			background-color: rgba(0, 0, 0, 0.5);
			height: 100vh;
			position: fixed;
			top: 0;
			left: 0;

			.editPassword {
				width: 74.67vw;
				height: 54.47vw;
				background-color: #ffffff;
				border-radius: 2.13vw;
				font-size: 4.27vw;
				color: #333333;
				margin: 30vh auto;

				.name {
					height: 13.47vw;
					line-height: 13.47vw;
					text-align: center;
				}

				.input-box {
					width: 68.27vw;
					height: 9.07vw;
					background-color: #eeeeee;
					border-radius: 0.53vw;
					margin: 2vw auto;

					.uni-input {
						height: 9.07vw;
						padding: 0 2vw;
						line-height: 9.07vw;
						margin: 0;
					}
				}

				.keys {
					height: 14.93vw;
					position: relative;

					>view {
						width: 16vw;
						height: 6.4vw;
						line-height: 6.4vw;
						text-align: center;
						background-color: #cccccc;
						border-radius: 0.53vw;
						color: #ffffff;
						font-size: 3.73vw;
						position: absolute;
						top: 4.27vw;
						left: 7.4vw;
					}

					.determine {
						background-color: #0dd561;
						left: 51.2vw;
					}
				}
			}


		}
	}
</style>
