<template>
	<view class="wrapper">
		<button class="share" @click="activitiesShare">
			<image src="https://dingqiang-golf.oss-cn-shenzhen.aliyuncs.com/coupon_invite.png" mode=""></image>
		</button>
		<view class="list" v-for="value in data">
			<view class="list-box-use" v-if="value.couponStatus == 0" @click="immediateUse">
				<view class="name">
					订场通用优惠券
				</view>
				<view class="period-of-validity">
					有效期 :{{value.expBegin}}~{{value.expEnd}}
				</view>
				<view class="state">
					立即使用
				</view>
			</view>
			<view class="list-box-activation" v-if="value.couponStatus == 1" @click="couponNotActivated">
				<view class="imgs">
					<image :src="value.inviteeAvatar" mode=""></image>
				</view>
				<view class="name">
					邀请人:{{value.inviteeNickname}}已领取
				</view>
				<view class="state">
					待激活
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: []
			}
		},
		watch: {},
		computed: {},
		onLoad(option) {

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
		onShow() {

		},
		created() {
			this.orderPage()
		},
		mounted() {},
		methods: {
			//跳转活动分享
			activitiesShare() {
				uni.navigateTo({
					url: '/pages/activitiesShare/activitiesShare'
				});
			},
			orderPage() {
				this.$api.api.couponList({
					data: {
						galleryId: uni.getStorageSync('golfGalleryId'),
						current: 1,
						size: 999
					},
				}).then(res => {
					this.data = res.data.data.records
					this.data.forEach(function(value){
						let expBegin = value.expBegin.substring(0,10);
						let expEnd = value.expEnd.substring(0,10);
						value.expBegin = expBegin
						value.expEnd = expEnd
					})
					console.log(this.data)
				})
			},
			//点击可使用卡劵
			immediateUse() {
				uni.switchTab({
					url: '../booking/booking'
				});
			},
			//点击未激活卡劵
			couponNotActivated() {
				uni.showModal({
					title: '提示',
					content: '尚未激活原因：您的好友已领取订场优惠券但尚未使用，成功使用后即可激活您的订场优惠券',
					success: async (res) => {
						if (res.confirm) {
							
						} else if (res.cancel) {
							
						}
					}
				});
			},
		},
	}
</script>
<style scoped lang="less">
	.wrapper {
		height: 100vh;
		background-color: #f5f5f5;
		.share {
			width: 93.6vw;
			height: 27.73vw;
			border-radius: 1.07vw;
			margin: 3.2vw;
			margin-bottom: 4.27vw;
			border: 0;
			padding: 0;
			image {
				width: 100%;
				height: 100%;
			}
		}

		.list {
			width: 93.6vw;
			height: 27.73vw;
			margin: 3.2vw;

			.list-box-use {
				width: 93.6vw;
				height: 27.73vw;
				background: url(../../static/image/use.png);
				background-size: 100% 100%;
				position: relative;

				>view {
					position: absolute;
				}

				.name {
					width: 30vw;
					height: 3.47vw;
					color: #333333;
					font-size: 3.73vw;
					top: 4.27vw;
					left: 4.4vw;
				}

				.period-of-validity {
					width: 52.67vw;
					height: 3.07vw;
					font-size: 3.2vw;
					color: #999999;
					bottom: 4.93vw;
					left: 4.4vw;
				}

				.state {
					width: 19.2vw;
					height: 6.93vw;
					border-radius: 0.53vw;
					border: solid 0.13vw #ffffff;
					top: 10.04vw;
					right: 4.27vw;
					font-size: 3.73vw;
					color: #ffffff;
					line-height: 6.93vw;
					text-align: center;
				}
			}

			.list-box-activation {
				width: 93.6vw;
				height: 27.73vw;
				background: url(../../static/image/activation.png);
				background-size: 100% 100%;
				position: relative;

				>view {
					position: absolute;
				}

				.imgs {
					width: 9.07vw;
					height: 9.07vw;
					border-radius: 8.53vw;
					top: 9.33vw;
					left: 6vw;

					image {
						width: 100%;
						height: 100%;
						border-radius: 8.53vw;
					}
				}

				.name {
					width: 37.07vw;
					height: 3.47vw;
					font-size: 3.73vw;
					color: #333333;
					top: 11.87vw;
					left: 16.8vw;
				}

				.state {
					width: 19.2vw;
					height: 6.93vw;
					border-radius: 0.53vw;
					border: solid 0.13vw #ffffff;
					top: 10.04vw;
					right: 4.27vw;
					font-size: 3.73vw;
					color: #ffffff;
					line-height: 6.93vw;
					text-align: center;
				}
			}
		}
	}
</style>
