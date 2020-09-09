<template>
	<view>
		<view class="header" :style="{'height':titleBarHeight,'padding-top':statusBarHeight,'background-color': nav.bg}">
			
			<view class="iconfont leftArrow header-back weight homePage"  :style="{'border':nav.color}" @click="back"></view>
			<view class="header-title weight">{{nav.navTitle}}</view>
		</view>
		<view :style="{'height':titleBarHeight,'padding-top':statusBarHeight}"></view>
	</view>
</template>
<script>
	export default {
		props: ["nav"],
		data() {
			return {
				statusBarHeight: 0,
				titleBarHeight: 0,
			}
		},
		created() {
			var that = this;
			uni.getSystemInfo({
				success: function(res) {
					if (res.model.indexOf('iPhone') !== -1) {
						that.titleBarHeight = 44 + 'px';
					} else {
						that.titleBarHeight = 48 + 'px';
					}
					that.statusBarHeight = res.statusBarHeight + 'px'
				},

			})
		},
		methods: {
			// 回到上一页
			back: function() {
				uni.switchTab({
					url: '../index/index'
				});
			}
		}
	}
</script>

<style>
	.header {
		display: flex;
		align-items: center;
		top: 0;
		position: fixed;
		width: 100%;
		z-index: 100;
		left: 0;
	}
	.homePage{
		width: 20rpx;
		height: 20rpx;
		background: url(../../static/image/homePage.png);
		background-size: 100% 100%;
		border-radius: 0 !important;
		margin-left: 18rpx;
	}
	.header .header-title {
		position: absolute;
		left: 50%;
		font-size: 28upx;
		transform: translateX(-50%);
		color: #ffffff;
	}

	.header-back {
		position: absolute;
		left: 15upx;
		font-size: 30upx;
		padding: 10upx;
		border-radius: 50%;
	}
	
	
</style>
