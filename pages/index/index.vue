<template>
	<view class="container">
		<button class="share" @click="activitiesShare">
			<image src="https://dingqiang-golf.oss-cn-shenzhen.aliyuncs.com/coupon_invite.png" mode=""></image>
		</button>
		<view class="plate">
			<view @click="jifen">
				<image src="../../static/image/jifen.png" mode=""></image>
				<view>计分</view>
			</view>
			<view @click="dingchang">
				<image src="../../static/image/dingc.png" mode=""></image>
				<view>订场</view>
			</view>
			<view @click="gongfang">
				<image src="../../static/image/gongfang.png" mode=""></image>
				<view>俱乐部</view>
			</view>
		</view>
		<view class="golf-title">最近活动</view>
		<view class="golf-content">
			<!-- 活动列表 -->
			<view class="list-activities" @click="eventDetails(value)" v-for="value in activity">
				<view class="imgs">
					<image v-if="value.mainUrl" :src="'https://dingqiang-golf.oss-cn-shenzhen.aliyuncs.com/'+value.coverUrl" mode=""></image>
					<image v-else src="https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1600416514&di=65924f6720bbce9f5a68f8669fecfc88&src=http://a2.att.hudong.com/86/10/01300000184180121920108394217.jpg"
					 mode=""></image>
				</view>
				<view class="stadium-name">
					{{value.activityTitle}}
				</view>
				<view class="stadium-address">
					<image src="../../static/image/address.png" mode=""></image>
					{{value.activityAddress}}
				</view>
				<view class="stadium-state">
					报名中
				</view>
			</view>
		</view>
		<!-- 遮罩层 -->
		<view class="authorization" v-if="determine">
			<view class="box">
				<view class="h">
					您还未登录
				</view>
				<view class="p">
					请先登录再进行操作
				</view>
				<image src="../../static/image/wx_authorization.png" mode=""></image>
				<view class="buttom">
					<view class="cancel" @click="onDetermine">
						取消参与
					</view>
					<button class="determine" type="primary" open-type="getUserInfo" @click="invitedPlayers" hover-class="btn-hover">
						参与球局
					</button>
				</view>
			</view>
		</view>
		<!-- 登录遮罩层 -->
		<view class="authorization" v-if="loginStatus">
			<view class="login-window-pops">
				<button class="golf-auth" @click="loginStatus=false">
					取消
				</button>
			</view>
			<view class="login-window-pops">
				<button class="golf-auth" type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo" @click="golfLogin"
				 hover-class="btn-hover">
					登录
				</button>
			</view>
		</view>
		<!-- 新人礼包弹窗 -->
		<view class="authorization and-the-top" v-if="newGiftBag">
			<view class="new-gift-bag" v-if="!newGiftBagImgs" @click="newGiftBagImgs = true">
				<image src="https://dingqiang-golf.oss-cn-shenzhen.aliyuncs.com/gift/toget.png" mode=""></image>
			</view>
			<view class="new-gift-bag-x" v-if="newGiftBagImgs" @click="newGiftBag = false">
				<image src="https://dingqiang-golf.oss-cn-shenzhen.aliyuncs.com/gift/success.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue';
	const app = getApp();
	export default {
		data() {
			return {
				current: 1,
				golfListNull: [],
				openId: '',
				nickName: null, //昵称
				avatar: null, //头像
				sex: null, //性别 0未填 1 男性 2女性
				isCanUse: uni.getStorageSync('isCanUse') || true, //默认为true
				determine: false,
				url: "",
				activity: [], //活动列表
				loginStatus: false, //登录遮罩层控制参数
				newGiftBag: false, //新人礼包弹窗控制参数
				newGiftBagImgs: false, //新人礼包弹窗内部图片控制参数
			}
		},
		onLoad(options) {
			// if (options.scene) {
			// 	let scene = decodeURIComponent(options.scene);
			// 	this.scene = scene;
			// 	// 后续处理scene
			// 	if (scene) {
			// 		this.determine = true;
			// 	}
			// }
			//从邀请球手分享进入
			if (options.golfTournamentId) {
				this.scene = options.golfTournamentId;
				this.determine = true;
			}
			//从优惠劵分享进入
			if (options.golfGalleryId) {
				this.shareOneId = options.golfGalleryId;
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				return {
					title: '立即领取50元订场优惠劵',
					path: '/pages/index/index?golfGalleryId=' + uni.getStorageSync('golfGalleryId')
				}
			} else {
				return {
					title: '快来观战吧！',
					path: '/pages/onlooker/onlooker?golfGalleryId=' + uni.getStorageSync('golfGalleryId')
				}
			}
		},
		async onShow() {
			const {
				data: res
			} = await this.$api.match.tournamentPage({
				data: {
					current: this.current,
					size: 100,
					galleryId: uni.getStorageSync('golfGalleryId')
				},
			})
			if (res.code === 0) {
				this.golfListNull = res.data.records
			}
			// var pages = getCurrentPages()
		},
		created() {
			console.log()
			if (uni.getStorageSync('golfGalleryId') == '') {
				this.loginStatus = true
			}
		},
		mounted() {
			this.activityList();
		},
		methods: {
			//跳转活动分享
			activitiesShare() {
				uni.navigateTo({
					url: '/pages/activitiesShare/activitiesShare'
				});
			},
			//计分
			jifen() {
				uni.navigateTo({
					url: '/pages/scoring/scoring'
				});
			},
			//订场
			dingchang() {
				uni.navigateTo({
					url: '/pages/booking/booking'
				});
			},
			//工坊
			gongfang() {
				// uni.showToast({
				// 	title: '正在开发中',
				// 	duration: 2000,
				// 	icon: "none"
				// });
				uni.navigateTo({
					url: '/pages/workshop/workshop'
				});
			},
			//获取活动列表数据
			activityList() {
				this.$api.api.activityList({
					data: {
						current: 1,
						size: 100,
					}
				}).then(res => {
					if (res.data.code === 0) {
						this.activity = res.data.data
					}
				})
			},
			//跳转到活动详情页面
			eventDetails(v) {
				uni.navigateTo({
					url: '/pages/eventDetails/eventDetails?activityId=' + v.golfActivityId
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
								inviterId: this.shareOneId
							},
						})
						if (res.code === 0) {
							console.log(2222)
							uni.setStorage({ //高尔夫球员ID存入本地
								key: 'golfGalleryId',
								data: res.data.golfGalleryId,
							});

							uni.hideLoading()
							this.loginStatus = false;
							//判断是否有传入分享人ID  如果有 跳出弹窗
							if (res.data.isNewGallery == 1) {
								this.newGiftBag = true;
							}
							//判断是否传入邀请球手ID 如果有 跳出弹窗
							if (this.scene) {
								this.determine = true;
							}
						}
					})
				})
			},
			//跳转球员加入球局页面
			invitedPlayers() {
				this.determine = false;
				uni.navigateTo({ //跳入球员设置页面
					url: '/pages/invitedJoin/invitedJoin?id=' + this.scene + "&golfGalleryId=" + uni.getStorageSync('golfGalleryId')
				});
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
			onDetermine() {
				this.determine = false;
			}
		}
	}
</script>

<style scoped lang="less">
	.container {
		background-color: #ffffff;
	}

	.share {
		// width: 93.6vw;
		height: 27.73vw;
		border-radius: 1.07vw;
		margin-bottom: 4.27vw;
		border: 0;
		padding: 0;
		image {
			width: 100%;
			height: 100%;
		}
	}

	.plate {
		width: 100vw;
		margin-left: -40rpx;
		height: 30.2vw;
		background-color: #ffffff;
		border-radius: 0vw;
		display: flex;
		border-bottom: 3vw solid #f5f5f5;

		>view {
			flex: 1;

			image {
				width: 15.73vw;
				height: 15.73vw;
				margin-left: 9vw;
				margin-top: 3.4vw;
				border-radius: 50%;
			}

			view {
				height: 3.33vw;
				font-size: 3.47vw;
				color: #333333;
				text-align: center;
				margin-top: 2.5vw;
			}
		}
	}

	.golf-title {
		margin-top: 3vw;
	}

	.golf-auth {
		margin-bottom: 54rpx;
		border-radius: 60rpx;
	}

	.golf-list {
		margin-top: 40rpx;
	}

	.golf-info {
		width: 100%;
		padding-left: 22rpx;
	}

	.golf-site {
		font-size: 30rpx;
		font-weight: 500;
		color: #333;
		line-height: 45rpx;
	}

	.golf-sate {
		font-size: 30rpx;
		font-weight: 600;
		line-height: 45rpx;
	}

	.golf-notStart {
		color: #ffd051;
	}

	.golf-inProgress {
		color: #0dd561;
	}

	.golf-end {
		color: #999;
	}

	.golf-time {
		position: relative;

		.buttom {
			position: absolute;
			top: 0;
			right: 0;
			font-weight: 600;
		}
	}

	.golf-time text:last-child {
		margin-left: 20rpx;
	}

	.golf-line {
		line-height: 2.2;
	}

	.golf-info text {
		font-size: 26rpx;
		color: #999;
	}

	.golf-speed {
		font-size: 24rpx;
		color: #999;
		line-height: 40rpx;
		height: 40rpx;
		border-radius: 24px;
		border: 2rpx solid #999;
		padding: 0 15rpx;
		text-align: center;
	}

	.golf-weather {
		font-size: 26rpx;
		color: #999;
	}

	.golf-listNull {
		color: #999;
		font-size: 24rpx;
		text-align: center;
	}

	.golf-listNull img {
		width: 150rpx;
		height: 150rpx;
		display: block;
		margin: 0 auto;
		text-align: center;
		margin-top: 200rpx;
		margin-bottom: 15rpx;
	}

	.and-the-top {
		z-index: 999;
	}

	.authorization {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.3);
		text-align: center;

		.box {
			width: 90%;
			height: 888rpx;
			margin: auto;
			margin-top: 160rpx;
			border-radius: 8rpx;
			background-color: #ffffff;
			color: #333333;
			font-size: 34rpx;

			.h {
				padding-top: 32rpx;
			}

			.p {
				margin-top: 16rpx;
				font-size: 28rpx;
				color: #666666;
			}

			image {
				width: 640rpx;
				margin: auto;
			}

			.buttom {
				display: flex;

				.cancel {
					width: 300rpx;
					height: 80rpx;
					line-height: 80rpx;
					margin: 32rpx 20rpx;
					border: 1rpx solid #0fd762;
					color: #0fd762;
					border-radius: 40rpx;
				}

				.determine {
					width: 300rpx;
					height: 80rpx;
					line-height: 80rpx;
					margin: 32rpx 20rpx;
					border: 1rpx solid #0fd762;
					background-color: #0fd762;
					color: #FFFFFF;
					border-radius: 40rpx;
				}
			}
		}

		.login-window-pops {
			width: 30vw;
			// height: 20vw;
			// line-height: 20vw;
			text-align: center;
			color: #ffffff;
			float: left;
			// background-color: #0DD561;
			position: fixed;
			bottom: 30vw;
			left: 10vw;
			font-size: 8vw;
			font-weight: 650;
			border-radius: 4vw;
		}
		.login-window-pops:nth-child(1)>button{
			background-color: #999999;
		}
		.login-window-pops:nth-child(2){
			margin-left: 50vw;
		}

		.new-gift-bag,
		.new-gift-bag-x {
			width: 74.67vw;
			height: 74.67vw;
			position: absolute;
			top: 30vh;
			left: 12.67vw;

			>image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.password {
		height: 7.2vw;
		background-color: #000000;
		border-radius: 1.07vw;
		opacity: 0.25;
		font-size: 2.93vw;
		color: #ffffff;
		line-height: 7.2vw;
		text-indent: 1em;
		margin: 2vw 0;
	}

	.list-box {
		padding: 24rpx;
		position: relative;
		background-color: #ffffff;
		border-radius: 8rpx;
		margin-top: 32rpx;

		.top {
			height: 76rpx;
			line-height: 50rpx;
			font-size: 32rpx;
			color: #333333;
			font-weight: 550;
			position: relative;
			border-bottom: 1px solid #eeeeee;

			.delete {
				position: absolute;
				top: 0;
				width: 80rpx;
				right: 0;
				text-align: right;
				font-size: 24rpx;
				color: #FF5B5A;

				image {
					position: absolute;
					left: 8rpx;
					top: 14rpx;
					width: 22rpx;
					height: 22rpx;
				}
			}
		}

		.content {
			height: 80rpx;
			line-height: 80rpx;
			font-size: 24rpx;
			color: #333333;
			position: relative;

			.creator {
				image {
					position: relative;
					left: 0;
					width: 24rpx;
					height: 24rpx;
					top: 2rpx;
					border-radius: 50%;
				}
			}

			.onlookers {
				height: 80rpx;
				position: absolute;
				text-align: right;
				top: 0;
				right: 0;

				image {
					position: absolute;
					left: -24rpx;
					width: 22rpx;
					height: 16rpx;
					top: 34rpx;
				}
			}
		}

		.golfers {
			height: 128rpx;
			display: flex;
			display: -webkit-flex;
			flex-direction: row;
			flex-wrap: wrap;
			background-color: #f5f5f5;
			border-radius: 8rpx;

			.golfers-box {
				position: relative;

				image {
					width: 32rpx;
					height: 32rpx;
					margin-left: 20rpx;
					top: 4rpx;
					margin-right: 20rpx;
					border-radius: 16rpx;
					position: relative;
				}

				width: 48%;
				height: 44rpx;
				margin-top: 10rpx;
				padding-right: 2%;
				line-height: 22rpx;
				font-size: 28rpx;
				overflow:hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.player-no {
				width: 100%;
				height: 100%;
				line-height: 128rpx;
				color: #999999;
				text-align: center;
				font-size: 24rpx;
			}
		}

		.following {
			height: 54rpx;
			line-height: 72rpx;
			display: flex;

			.time {
				width: 300rpx;
				height: 54rpx;
				color: #666666;
				font-size: 24rpx;
			}

			.state {
				color: #0DD561;
				font-size: 32rpx;
				font-weight: 600;
				position: absolute;
				right: 24rpx;
			}
		}
	}

	.list-activities {
		width: 100%;
		height: 42.67vw;
		border-radius: 1.07vw;
		margin: 3.2vw 0;
		position: relative;

		.imgs {
			width: 100%;
			height: 100%;
			border-radius: 1.07vw;

			image {
				width: 100%;
				height: 100%;
				border-radius: 1.07vw;
			}
		}

		.stadium-name {
			position: absolute;
			width: 70.73vw;
			height: 3.73vw;
			line-height: 3.73vw;
			font-size: 4vw;
			color: #ffffff;
			left: 3.2vw;
			top: 29.7vw;
		}

		.stadium-address {
			position: absolute;
			width: 70.2vw;
			height: 3.07vw;
			font-size: 3.2vw;
			color: #ffffff;
			padding-left: 3vw;
			left: 3.2vw;
			top: 36.6vw;

			image {
				position: absolute;
				width: 2.8vw;
				height: 3.47vw;
				left: -0.5vw;
				top: 0.5vw;
			}
		}

		.stadium-state {
			position: absolute;
			top: 0;
			right: 0;
			width: 11.73vw;
			height: 5.33vw;
			line-height: 5.33vw;
			background-color: #0dd561;
			border-radius: 0vw 1.07vw 0vw 1.07vw;
			font-size: 3.2vw;
			color: #ffffff;
			text-align: center;
		}
	}
</style>
