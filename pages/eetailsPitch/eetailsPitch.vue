<template>
	<view class="container">
		<view class="imgs" @click="jump">
			<image v-if="data.cover" :src="'https://dingqiang-golf.oss-cn-shenzhen.aliyuncs.com/'+data.cover" mode=""></image>
			<view class="bg">
				<view class="name">
					{{data.courseName}}
				</view>
				<view class="address">
					<image src="../../static/image/address.png" mode=""></image>
					{{data.address}}
				</view>
				<view class="price">
					￥{{costUnitPrice}}
				</view>
				<view class="photo">
					<image src="../../static/image/photo.png" mode=""></image>
					{{data.albumNumber}}
				</view>
			</view>
		</view>
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
		<view class="box">
			<view class="text" v-if="data.mode">
				<view class="name">
					球场模式
				</view>
				<view class="field">
					{{data.mode}}
				</view>
			</view>
			<view class="text" v-if="data.buildDate">
				<view class="name">
					建立时间
				</view>
				<view class="field">
					{{data.buildDate}}
				</view>
			</view>
			<view class="text" v-if="data.area">
				<view class="name">
					球场面积
				</view>
				<view class="field">
					{{data.area}}
				</view>
			</view>
			<view class="text" v-if="data.puttingGreenGrass">
				<view class="name">
					果岭草种
				</view>
				<view class="field">
					{{data.puttingGreenGrass}}
				</view>
			</view>
			<view class="text" v-if="data.data">
				<view class="name">
					球场数据
				</view>
				<view class="field">
					{{data.data}}
				</view>
			</view>
			<view class="text" v-if="data.designer">
				<view class="name">
					设计师
				</view>
				<view class="field">
					{{data.designer}}
				</view>
			</view>
			<view class="text" v-if="data.fairwayLength">
				<view class="name">
					球道长度
				</view>
				<view class="field">
					{{data.fairwayLength}}
				</view>
			</view>
			<view class="text" v-if="data.fairwayGrass">
				<view class="name">
					球道草种
				</view>
				<view class="field">
					{{data.fairwayGrass}}
				</view>
			</view>
		</view>
		<view class="box">
			<view class="text-center">
				<view class="name">
					球场简介
				</view>
				<view class="field">
					{{data.introduction}}
				</view>
			</view>
		</view>
		<view class="box">
			<view class="text-center">
				<view class="name">
					球场设施
				</view>
				<view class="field">
					{{data.facilitiesn}}
				</view>
			</view>
		</view>
		<view class="below">
			<view class="reservation" @click="go">
				<image src="../../static/image/reservation.png" mode=""></image>
				咨询
			</view>
			<button class="bookingImmediately" type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo" @click="golfLogin"
			 hover-class="btn-hover">
				立即订场 ￥{{costUnitPrice}}
				<span>
					劵后￥{{(costUnitPrice*100-couponFee*100)/100}}
				</span>
			</button>
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
				showPicker: false,
				date: '2019/01/01',
				time: '09:00:00',
				type: 'rangetime',
				value: '',
				costUnitPrice: "", //单价
				couponFee: "" //优惠价格
			}
		},
		onLoad(options) {
			if (options.golfCourseId) {
				this.golfCourseId = options.golfCourseId
			}
		},
		created() {
			var date = new Date();
			this.date = date.toISOString().replace(/T.*/, ' ');
		},
		mounted() {
			this.getOneCourse();
			this.scheduleCourseOnSale();
		},
		onShareAppMessage(res) {

		},
		// 下拉刷新
		onPullDownRefresh() {},
		methods: {
			//支付跳转
			jumpPay() {
				let detail = {
					golfCourseId: this.golfCourseId,
					courseName: this.data.courseName,
					costUnitPrice: this.costUnitPrice,
					couponFee: this.couponFee,
					scheduleDate: this.date + " " + this.time,
					type: 1, // 活动为0   订单列表为1
				}
				uni.navigateTo({
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
							this.jumpPay();
						}
					})
				})
			},
			//点击授权登录获取信息
			golfLogin() {
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
			onShowDatePicker(type) { //显示
				this.type = type;
				this.showPicker = true;
				this.value = this[type];
			},
			onSelected(e) { //选择
				this.showPicker = false;
				if (e) {
					this[this.type] = e.value;
					this.scheduleCourseOnSale();
				}
			},
			//通过时间获取场次时间价格
			scheduleCourseOnSale() {
				this.$api.api.scheduleCourseOnSale({
					data: {
						golfCourseId: this.golfCourseId,
						scheduleDate: this.date + " " + this.time,
					}
				}).then(res => {
					this.costUnitPrice = res.data.data.costUnitPrice;
					this.couponFee = res.data.data.couponFee;
					// if (res.data.code == 0) {

					// } else {

					// }
				})
			},
			cancelSelect(e) {
				console.log("您已取消选择");
			},
			//跳转相册
			jump() {
				uni.navigateTo({
					url: '/pages/photoAlbum/photoAlbum?golfCourseId=' + this.golfCourseId
				});
			},
			//打电话
			go() {
				let _this = this;
				uni.makePhoneCall({
					// 手机号
					phoneNumber: _this.data.contactWay,

					// 成功回调
					success: (res) => {
						console.log('调用成功!')
					},

					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}

				});
			},
			//获取球场信息
			async getOneCourse() {
				const {
					data: res
				} = await this.$api.api.getOneCourse({
					data: {
						courseId: this.golfCourseId
					}
				})
				if (res.code === 0) {
					// this.golfCourseList = res.data.records
					this.data = res.data;
				}
			},
		}
	}
</script>

<style scoped lang="less">
	.container {
		background-color: #f5f5f5;
		margin: 0;
		padding: 0;
		padding-bottom: 13vw;

		.imgs {
			width: 93.6vw;
			height: 48vw;
			border-radius: 2.13vw;
			margin: 3.2vw;
			position: relative;

			image {
				width: 100%;
				height: 100%;
				border-radius: 2.13vw;
			}

			.bg {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				background-color: rgba(0, 0, 0, 0.5);
				border-radius: 2.13vw;

				.name {
					width: 43.73vw;
					height: 3.73vw;
					font-size: 4vw;
					line-height: 3.73vw;
					color: #ffffff;
					position: absolute;
					top: 34vw;
					left: 3.2vw;
				}

				.address {
					width: 80.2vw;
					height: 3.57vw;
					line-height: 3.07vw;
					font-size: 3.2vw;
					color: #ffffff;
					position: absolute;
					top: 41vw;
					left: 3.2vw;
					overflow: hidden;
					text-overflow: ellipsis;

					image {
						width: 2.8vw;
						height: 3.47vw;
						position: relative;
						top: 0.5vw;
					}
				}

				.price {
					width: 13.87vw;
					height: 3.2vw;
					font-size: 4vw;
					color: #ff3b30;
					position: absolute;
					top: 40vw;
					right: 3.3vw;
					font-weight: 550;
				}

				.photo {
					width: 11vw;
					height: 4.27vw;
					padding-right: 1vw;
					background-color: #000000;
					border-radius: 2.13vw;
					opacity: 0.2;
					position: absolute;
					top: 3.2vw;
					right: 3.2vw;
					color: #ffffff;
					font-size: 3.2vw;
					text-align: right;

					image {
						width: 3.47vw;
						height: 3.2vw;
						position: relative;
						top: 0.3vw;
						margin-right: 0.5vw;
						left: -1.5vw;
						border-radius: 0;
					}
				}
			}

		}

		.time {
			height: 14.4vw;
			background-color: #ffffff;
			display: flex;
			padding: 0 3.2vw;
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

		.box {
			margin: 3.2vw 0;
			padding: 0 3.33vw;
			background-color: #ffffff;
			text-align: left;

			.text {
				height: 9.8vw;
				line-height: 9.8vw;
				font-size: 3.73vw;
				display: flex;

				.name {
					width: 23.2vw;
					height: 9.8vw;
					color: #999999;
				}

				.field {
					font-size: 3.73vw;
					color: #333333;
					height: 9.8vw;
				}
			}

			.text-center {
				line-height: 9.8vw;
				font-size: 3.73vw;

				.name {
					width: 23.2vw;
					text-align: left;
					height: 9.8vw;
					color: #999999;
				}

				.field {
					text-align: left;
					font-size: 3.73vw;
					color: #333333;
				}
			}
		}

		.below {
			width: 100vw;
			height: 13.07vw;
			line-height: 13.07vw;
			position: fixed;
			bottom: 0;
			text-align: center;
			color: #ffffff;
			font-size: 4.8vw;
			display: flex;

			.reservation {
				width: 34.67vw;
				height: 13.07vw;
				background-color: #cccccc;

				image {
					width: 3.33vw;
					height: 4.13vw;
					margin-top: 4.53vw;
				}
			}

			.bookingImmediately {
				width: 65.33vw;
				height: 13.07vw;
				line-height: 13.07vw;
				padding: 0;
				margin: 0;
				font-size: 4.8vw;
				color: #ffffff;
				border-radius: 0;
				background-color: #0dd561;

				span {
					font-size: 3.2vw;
					color: #f62929;
				}
			}
		}

		.test {
			text-align: center;
			padding: 10px 0;
		}

		button {
			margin: 20upx;
			font-size: 28upx;
		}

	}
</style>
