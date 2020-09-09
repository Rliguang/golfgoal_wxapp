<template>
	<view class="container">
		<view class="golf-site"><text>比赛球场：</text>四川成都国际场</view>
		<view class="golf-site"><text>开赛时间：</text>2020年7月23日 星期四 13:47</view>

		<view class="golf-wechatCode text-center">
			<view class="golf-wechatCodeImg">
				<image src="/static/image/invite.png" class="golf-code"></image>
			</view>
			<text class="golf-inviteHint">可将此页面截图分享,球队长按扫码后加入球局</text>
		</view>

		<view class="golf-ballPlayer text-center">
			<text class="golf-playerText">已添加的球手</text>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		props: {},
		data() {
			return {}
		},
		watch: {},
		computed: {},
		methods: {},
		created() {},
		mounted() {}
	}
</script>

<style scoped>
	.golf-site {
		font-size: 28rpx;
		color: #666;
		line-height: 40rpx;
	}

	/* .golf-wechatCode,
	.golf-wechatCodeImg {
		text-align: center;
	} */

	.golf-code {
		width: 426rpx;
		height: 426rpx;
		padding: 72rpx 0 24rpx;
	}

	.golf-inviteHint {
		font-size: 24rpx;
		color: #666;
		line-height: 33rpx;
	}

	.golf-playerText {
		font-size: 32rpx;
		color: #333;
		line-height: 45rpx;
		display: block;
		padding: 80rpx 0 40rpx;
	}
</style>
