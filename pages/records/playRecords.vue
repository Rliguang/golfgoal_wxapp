<template>
	<view class="container">
		<view class="golf-playRecordsContent">
			<view class="golf-playTime">
				2020年07月
			</view>
			<view class="golf-playRecordsList">
				<view class="golf-playName">卖姑凉的小火柴(4)</view>
				<view class="golf-site"><text>场地：</text>四川成都国际场</view>
				<view class="golf-time"><text>时间：</text>07月23日 星期四 10:45</view>
			</view>
			<view class="golf-playRecordsList">
				<view class="golf-playName">成都卧龙谷乡村场(4)</view>
				<view class="golf-site"><text>场地：</text>四川成都国际场</view>
				<view class="golf-time"><text>时间：</text>07月23日 星期四 10:45</view>
			</view>
		</view>

		<view class="golf-playRecordsContent">
			<view class="golf-playTime">
				2020年06月
			</view>
			<view class="golf-playRecordsList">
				<view class="golf-playName">卖姑凉的小火柴(4)</view>
				<view class="golf-site"><text>场地：</text>四川成都国际场</view>
				<view class="golf-time"><text>时间：</text>07月23日 星期四 10:45</view>
			</view>
			<view class="golf-playRecordsList">
				<view class="golf-playName">成都卧龙谷乡村场(4)</view>
				<view class="golf-site"><text>场地：</text>四川成都国际场</view>
				<view class="golf-time"><text>时间：</text>07月23日 星期四 10:45</view>
			</view>
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
		created() {
			// uni.setNavigationBarTitle({
			// 	title: '用户昵称、AAAA-傻…'
			// })
		},
		mounted() {}
	}
</script>
<style scoped>
	.golf-playTime {
		font-size: 28rpx;
		font-weight: 600;
		color: #0fd762;
		line-height: 40rpx;
		margin: 32rpx 0 12rpx 0;
	}

	.golf-playRecordsList {
		background-color: #fff;
		padding: 32rpx 0 24rpx 24rpx;
		margin-bottom: 20rpx;
	}

	.golf-playName {
		font-size: 32rpx;
		color: #333;
		line-height: 45rpx;
		margin-bottom: 12rpx;
	}

	.golf-site text,
	.golf-time text {
		font-size: 26rpx;
		color: #999;
		line-height: 37rpx;
	}
</style>
