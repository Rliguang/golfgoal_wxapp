<template>
	<view class="container">
		<!-- <view class="receive">
			
		</view> -->
		<button class="receive" hover-class='none' :plain='true' open-type="share">
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		created() {
			
		},
		mounted() {
		},
		onShareAppMessage(res) {
			return {
				title: '立即领取50元订场优惠劵',
				path: '/pages/index/index?golfGalleryId=' + uni.getStorageSync('golfGalleryId')
			}
		},
		// 下拉刷新
		onPullDownRefresh() {},
		methods: {
			
			
		}
	}
</script>

<style scoped lang="less">
	.container {
		height: 100vh;
		margin: 0;
		padding: 0;
		background: url(https://dingqiang-golf.oss-cn-shenzhen.aliyuncs.com/backgroud.jpg);
		background-size: 100% 100%;
		.receive{
			width: 76.4vw;
			height: 115vw;
			position: fixed;
			background: url(https://dingqiang-golf.oss-cn-shenzhen.aliyuncs.com/coupon_invite_main.png);
			background-size: 100% 100%;
			top: 20vw;
			left: 11.8vw;
			border: 0;
		}
	}
</style>
