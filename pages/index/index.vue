<template>
	<view class="container">
		<!-- 新建比赛 start -->
		<button class="golf-auth" type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo" @click="golfLogin"
		 hover-class="btn-hover">
			新建球局
		</button>
		<!-- 新建比赛 end -->
		<view class="golf-title">今日球局</view>
		<view class="golf-content">
			<!-- 高尔夫列表 start -->
			<!-- <view v-if="golfListNull.length!==0" v-for="(item,index) in golfListNull" :key="index" class="golf-list flex align-center">
				<view class="golf-info" style="background-color: #007 AFF;" @click="goGameDetail(item.golfTournamentId,item.currentTournamentGallery.golfTournamentGalleryId, item.currentTournamentGallery.isOrganizer, item.currentTournamentGallery.tournamentIdentity,item)">
					<view class="golf-line flex flex-between">
						<view class="golf-site">{{item.golfCourse.courseName}}</view>
						<view class="golf-sate golf-inProgress" v-if="item.tournamentStatus===0">待开始</view>
						<view class="golf-sate golf-end" v-if="item.tournamentStatus===1">进行中</view>
						<view class="golf-sate golf-end" v-if="item.tournamentStatus===9">已结束</view>
					</view>

					<view class="golf-line golf-time">
						<text>时间：</text>{{item.beginTime}} <text>围观：</text>{{item.galleryNumber}}
						<view class="buttom" v-if="item.currentTournamentGallery.isOrganizer == 1 && item.tournamentStatus===0"
						 @click.stop="goGameDelete(item)">
							删除
						</view>
					</view>
				</view>
			</view> -->
			
			<!-- 列表 -->
			<view class="list-box" v-if="golfListNull.length!==0" v-for="(item,index) in golfListNull" :key="index" @click="goGameDetail(item.golfTournamentId,item.currentTournamentGallery.golfTournamentGalleryId, item.currentTournamentGallery.isOrganizer, item.currentTournamentGallery.tournamentIdentity,item)">
				<view class="top">
					<view class="stadium-name">
						{{item.golfCourse.courseName}}
					</view>
					<view class="delete" v-if="item.tournamentStatus===0" @click.stop="goGameDelete(item)">
						<image src="../../static/image/delete.png" mode=""></image>
						删除
					</view>
				</view>
				<view class="content">
					<view class="creator">
						<image :src="item.organizer.avatar" mode=""></image>
						{{item.tournamentName}}(创建者)
					</view>
					<view class="onlookers">
						<image src="../../static/image/onlookers.png" mode=""></image>
						当前围观:{{item.galleryNumber}}人
					</view>
				</view>
				<view class="golfers">
					<view class="golfers-box" v-for="value in item.golfTournamentGalleryList">
						<image v-if="value.avatar" :src="value.avatar" mode=""></image>
						<image v-else src="../../static/image/default.png" mode=""></image>
						{{value.nickname}}
					</view>
					<view class="player-no" v-if="item.golfTournamentGalleryList.length == 0">
						暂无球手
					</view>
				</view>
				<view class="following">
					<view class="time">
						{{item.showTime}}
					</view>
					<view class="state" style="color: #FFCB1C;" v-if="item.tournamentStatus===0">待开始</view>
					<view class="state" style="color: #0DD561;" v-if="item.tournamentStatus===1">进行中</view>
					<view class="state" style="color: #FF3B30;" v-if="item.tournamentStatus===9">已结束</view>
				</view>
			</view>
			<!-- 高尔夫列表 end -->
			<!-- 高尔夫列表空 start -->
			<view v-if="golfListNull.length===0" class="golf-listNull">
				<img src="/static/image/null.png" alt="还没有球局呢!">
				<view class="golf-null">还没有球局呢!</view>
			</view>
			<!-- 高尔夫列表空 end -->
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
						取消授权
					</view>
					<button class="determine" type="primary" open-type="getUserInfo" @getuserinfo="getUserInfoPlayers" @click="golfLogin"
					 hover-class="btn-hover">
						微信授权
					</button>
				</view>
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
				golfList: [{
					name: '四川成都国际场1111',
					state: 0,
					site: '成都麓山国际场地111',
					time: '周四 2020-07-23 13:42',
					num: '2人'
				}],
				current: 1,
				golfListNull: [],
				openId: '',
				nickName: null, //昵称
				avatar: null, //头像
				sex: null, //性别 0未填 1 男性 2女性
				isCanUse: uni.getStorageSync('isCanUse') || true, //默认为true
				determine: false,
				url: "",
			}
		},
		onLoad(options) {
			if (options.scene) {
				let scene = decodeURIComponent(options.scene);
				this.scene = scene;
				// 后续处理scene
				if (scene) {
					this.determine = true;
				}
			}
			if (options.golfTournamentId) {
				this.scene = options.golfTournamentId;
				// 后续处理scene
				this.determine = true;
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.getDataList();
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
				console.log(this.golfListNull);
			}
			// var pages = getCurrentPages()
		},

		methods: {
			//获取当前页面列表数据
			getDataList() {
				this.golfListNul = [];
				var _this = this;
				this.$api.match.tournamentPage({
					data: {
						current: this.current,
						size: 100,
						galleryId: uni.getStorageSync('golfGalleryId')
					}
				}).then(res => {
					if (res.data.code === 0) {
						_this.golfListNull = res.data.data.records
					}
				})
			},
			goGameDelete(item) {
				let _this = this;
				uni.showModal({
					title: '提示',
					content: '是否删除！',
					success: function(res) {
						if (res.confirm) {
							_this.$api.player.tournamentGalleryRemove({
								data: {
									// golfGalleryId: item.golfGalleryId,
									golfTournamentId: item.golfTournamentId,
									golfTournamentGalleryId: item.currentTournamentGallery.golfTournamentGalleryId
								}
							}).then(res => {
								if (res.data.code == 0) {
									//操作成功
									uni.showToast({
										title: '删除成功',
										duration: 2000
									});
									_this.getDataList();
								} else {
									uni.showToast({
										title: '删除失败',
										icon: "none",
										duration: 2000
									});
								}
							})
						} else if (res.cancel) {

						}
					}
				});
			},
			goGameDetail(golfTournamentId, golfTournamentGalleryId, isOrganizer, tournamentIdentity, item) {
				uni.setStorage({
					key: "golfTournamentGalleryId",
					data: golfTournamentGalleryId
				})
				if (isOrganizer == 1) {
					// 为组织者
					uni.navigateTo({ //跳入记分卡
						url: '/pages/score/score?golfTournamentId=' + golfTournamentId + '&type=' + 1
					});
					return
				} else if (tournamentIdentity == 1) {
					// 球员
					uni.navigateTo({ //跳入记分卡
						url: '/pages/score/score?golfTournamentId=' + golfTournamentId + '&type=' + 2
					});
					return
				} else {
					// 观众
					uni.navigateTo({
						url: '/pages/onlooker/onlooker?golfTournamentId=' + golfTournamentId
					});
					return
				}
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
							uni.navigateTo({
								url: '/pages/startScoring/startScoring'
							});
							// uni.navigateTo({ //跳入球员设置页面
							// 	url: '/pages/games/games'
							// });
						}
					})
				})
			},
			//获取用户信息2
			getUserInfoPlayers() {
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
							this.determine = false;
							uni.navigateTo({ //跳入球员设置页面
								url: '/pages/invitedJoin/invitedJoin?id=' + this.scene + "&golfGalleryId=" + res.data.golfGalleryId
							});
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
			onDetermine() {
				this.determine = false;
			}
		}
	}
</script>

<style scoped lang="less">
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
	}
	
	.list-box{
		padding: 24rpx;
		position: relative;
		background-color: #ffffff;
		border-radius: 8rpx;
		margin-top: 32rpx;
		.top{
			height: 76rpx;
			line-height: 50rpx;
			font-size: 32rpx;
			color: #333333;
			font-weight: 550;
			position: relative;
			border-bottom: 1px solid #eeeeee;
			.delete{
				position: absolute;
				top: 0;
				width: 80rpx;
				right: 0;
				text-align: right;
				font-size: 24rpx;
				color: #FF5B5A;
				image{
					position: absolute;
					left: 8rpx;
					top: 14rpx;
					width: 22rpx;
					height: 22rpx;
				}
			}
		}
		.content{
			height: 80rpx;
			line-height: 80rpx;
			font-size: 24rpx;
			color: #333333;
			position: relative;
			.creator{
				image{
					position: relative;
					left: 0;
					width: 24rpx;
					height: 24rpx;
					top: 2rpx;
					border-radius: 50%;
				}
			}
			.onlookers{
				height: 80rpx;
				position: absolute;
				text-align: right;
				top: 0;
				right: 0;
				image{
					position: absolute;
					left: -24rpx;
					width: 22rpx;
					height: 16rpx;
					top: 34rpx;
				}
			}
		}
		.golfers{
			height: 128rpx;
			display: flex;
			display: -webkit-flex;
			flex-direction: row;
			flex-wrap: wrap;
			background-color: #f5f5f5;
			border-radius: 8rpx;
			.golfers-box{
				position: relative;
				image{
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
			.player-no{
				width: 100%;
				height: 100%;
				line-height: 128rpx;
				color: 	#999999;
				text-align: center;
				font-size: 24rpx;
			}
		}
		.following{
			height: 54rpx;
			line-height: 72rpx;
			display: flex;
			.time{
				width: 300rpx;
				height: 54rpx;
				color: #666666;
				font-size: 24rpx;
			}
			.state{
				color: #0DD561;
				font-size: 32rpx;
				font-weight: 600;
				position: absolute;
				right: 24rpx;
			}
		}
	}
</style>
