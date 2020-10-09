<template>
	<view class="container">
		<!-- 新建比赛 start -->
		<button class="golf-auth" type="primary" open-type="getUserInfo" @click="startScoring" hover-class="btn-hover">
			新建球局
		</button>
		<!-- 新建比赛 end -->
		<view class="golf-title">最近球局</view>
		<view class="golf-content">
			<!-- 列表 -->
			<view class="" v-if="golfListNull.length!==0" v-for="(item,index) in golfListNull" :key="index">
				<view class="list-box" @click="goGameDetail(item.golfTournamentId,item.currentTournamentGallery.golfTournamentGalleryId, item.currentTournamentGallery.isOrganizer, item.currentTournamentGallery.tournamentIdentity,item)">
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
				<view class="password" v-if="item.isControlLike == 1 && item.currentTournamentGallery.isOrganizer == 1">
					点赞密码:{{item.likePwd}} 密码请勿泄露给无关人员
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
			}
			// var pages = getCurrentPages()
		},
		created() {
			console.log()
			if (uni.getStorageSync('golfGalleryId') == '') {
				this.loginStatus = true
			}
		},
		methods: {
			//跳转到开局记分
			startScoring() {
				uni.navigateTo({
					url: '/pages/startScoring/startScoring'
				});
			},
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
	.and-the-top{
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
			width: 80vw;
			// height: 20vw;
			// line-height: 20vw;
			text-align: center;
			color: #ffffff;
			// background-color: #0DD561;
			position: fixed;
			bottom: 30vw;
			left: 10vw;
			font-size: 8vw;
			font-weight: 650;
			border-radius: 4vw;
		}

		.new-gift-bag,.new-gift-bag-x {
			width: 74.67vw;
			height: 74.67vw;
			position: absolute;
			top: 30vh;
			left: 12.67vw;
			>image{
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
