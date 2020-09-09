<template>
	<view class="container">
		<view class="golf-title">围观记录</view>
		<view class="golf-content">
			<!-- 列表 -->
			<view class="list-box" v-if="golfListNull.length!==0" v-for="(item,index) in golfListNull" :key="index" @click="goGameDetail(item.golfTournamentId,item.currentTournamentGallery.golfTournamentGalleryId, item.currentTournamentGallery.isOrganizer, item.currentTournamentGallery.tournamentIdentity,item)">
				<view class="top">
					<view class="stadium-name">
						{{item.golfCourse.courseName}}
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
		},
		created() {
			this.getDataList();
		},
		methods: {
			//获取当前页面列表数据
			getDataList() {
				this.golfListNul = [];
				var _this = this;
				this.$api.api.lookLogPage({
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
			}
		}
	}
</script>

<style scoped lang="less">
	
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
	
</style>