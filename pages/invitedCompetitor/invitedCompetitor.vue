<template>
	<view class="container">
		<view class="match-stadium" v-if="data.golfCourse">
			比赛球场：{{data.golfCourse.courseName}}
		</view>
		<view class="match-time" v-if="data.beginTime">
			开赛时间：{{data.beginTime}}
		</view>
		<view class="imgs">
			<image :src="data.qrCodeUrl" mode=""></image>
			<view class="imgs-text">
				可将此页面截图分享,球手扫码后加入球局
			</view>
		</view>
		<view class="add-player">
			<view class="text">
				已添加的球手
			</view>
			<view class="box">
				<view v-for="value in data.golfTournamentGalleryList">
					<image :src="value.avatar" mode=""></image>
					<view v-if="value.isOrganizer == 1">创建者</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		props: {},
		onLoad(option) {
			this.golfTournamentId = option.golfTournamentId
		},
		data() {
			return {
				data: {},
				controlTiming: null
			}
		},
		onUnload(e){
			clearInterval(this.controlTiming);
		},
		created() {

		},
		mounted() {
			var _this = this;
			_this.postTheData();
			this.controlTiming = setInterval(function() {
				_this.postTheData();
			}, 4000)
		},
		computed: {},
		beforeDestroy() {

		},
		methods: {
			postTheData() {
				var res = {};
				res = this.$api.invitedCompetitor.inviteGolferPage({
					data: {
						golfTournamentId: this.golfTournamentId
					}
				})

				res.then(data => {
					this.data = data.data.data
					this.data.beginTime
					let qrCodeUrl = 'https://dingqiang-golf.oss-cn-shenzhen.aliyuncs.com/' + this.data.qrCodeUrl
					this.data.qrCodeUrl = qrCodeUrl
					this.qrCodeUrl = qrCodeUrl;
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.container {
		padding: 84rpx 24rpx;
		font-size: 28rpx;
		color: #666666;

		.match-stadium {
			height: 40rpx;
		}

		.match-time {
			height: 40rpx;
			margin-top: 24rpx;
		}

		.imgs {
			width: 600rpx;
			height: 400rpx;
			margin: 72rpx auto;

			image {
				width: 400rpx;
				width: 400rpx;
				height: 100%;
				margin-left: 100rpx;
				font-size: 0;
			}

			.imgs-text {
				text-align: center;
				margin-top: 24rpx;
			}
		}

		.add-player {
			font-size: 32rpx;
			color: #333333;
			margin-top: 80rpx;
			text-align: center;
			margin-top: 80rpx;

			.box {
				display: flex;
				justify-content: center;

				view {
					height: 84rpx;
					width: 84rpx;
					margin: 25rpx;
					position: relative;

					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
						font-size: 0;
					}

					view {
						position: absolute;
						margin-top: -12rpx;
						margin-left: -3rpx;
						font-size: 20rpx;
						color: #FFFFFF;
						background-color: #0DD561;
						border-radius: 10rpx;
						width: 80rpx;
						height: 26rpx;
					}
				}
			}
		}
	}
</style>
