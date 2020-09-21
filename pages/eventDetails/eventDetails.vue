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
		<view class="show-data">
			<view class="">
				截止时间 {{activity.closeDate}}
			</view>
			<view class="">
				已报名: {{activity.number}}人
			</view>
		</view>


		<view class="mask" v-if="isThumbPassword">
			<view class="editPassword">
				<view class="name">
					姓名和手机号将用于订场
				</view>
				<view class="input-box">
					<input class="uni-input" v-model="contact" focus placeholder="请输入真实姓名" />
				</view>
				<view class="input-box">
					<input class="uni-input" v-model="contactWay" focus placeholder="请输入手机号" />
				</view>
				<view class="keys">
					<view class="cancel" @click="paymini(false)">
						取消
					</view>
					<view class="determine" @click="paymini(true)">
						确定
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: null,
				isThumbPassword: false, //是否展现密码输入弹窗
				contact: "",
				contactWay: "",
				activity: null, //活动数据
			}
		},
		onLoad(options) {
			// if (options.golfCourseId) {
			// 	this.golfCourseId = options.golfCourseId
			// }
		},
		created() {
			this.activityList();
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
							console.log(12321);
							this.isThumbPassword = true;
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
			//获取活动数据
			activityList() {
				this.$api.api.getOneActivity({
					data: {
						activityId: 1,
					}
				}).then(res => {
					if (res.data.code === 0) {
						this.activity = res.data.data
					}
				})
			},
			signUp() {
				this.isThumbPassword = true;
			},
			paymini: function(is) {
				if (!is) {
					this.isThumbPassword = false;
					return
				}
				this.$api.api.activityPreOrder({
					data: {
						activityId: 1,
						golfGalleryId: uni.getStorageSync('golfGalleryId'),
					}
				}).then(res => {
					this.$api.api.activityUnifiedpay({
						data: {
							contact: this.contact,
							contactWay: this.contactWay,
							orderId: res.data.data.golfOrderId
						}
					}).then(res => {
						// 调起支付
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: res.data.data.timestamp,
							nonceStr: res.data.data.nonceStr,
							package: "prepay_id=" + res.data.data.prepayId,
							signType: res.data.data.signType,
							paySign: res.data.data.paySign,
							success: function(res) {
								console.log('success:' + JSON.stringify(res));
								this.isThumbPassword = false;
								uni.showToast({
									title: '支付成功',
									icon: "none",
									duration: 2000
								});
							},
							fail: function(err) {
								uni.showToast({
									title: '支付失败',
									icon: "none",
									duration: 2000
								});
								console.log('fail:' + JSON.stringify(err));
							}
						});
					})

				})
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
		padding-bottom: 13vw;
		.imgs {
			width: 100%;
			image {
				width: 100%;
				height: 160vh;
				margin-bottom: 13vh;
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
			bottom: 27.33vw;
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
