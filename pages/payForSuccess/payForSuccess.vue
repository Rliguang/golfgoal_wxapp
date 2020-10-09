<template>
	<view class="container">
		<view class="box">
			<view class="">
				<image class="successfully" src="../../static/image/successfully.png" mode=""></image>
			</view>
			<view class="bold">
				支付成功
			</view>
		</view>
		<view class="button">
			<view class="" @click="index">
				返回首页
			</view>
		</view> 
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad(option) {
			
		},
		created() {
		},
		mounted() {
		},
		// 下拉刷新
		onPullDownRefresh() {},
		methods: {
			index() {
				uni.switchTab({
					url: '../index/index'
				});
			}
		}
	}
</script>

<style scoped lang="less">
	.container {
		height: 100vh;
		background-color: #f5f5f5;
		margin: 0;
		padding: 0;
		text-align: center;
		.box{
			width: 100vw;
			height: 80.4vw;
			background-color: #ffffff;
			border-radius: 0vw;
			.successfully{
				width: 14.4vw;
				height: 14.4vw;
				margin: auto;
				margin-top: 25.47vw;
			}
			.bold{
					height: 4.53vw;
					font-size: 4.8vw;
					color: #333333;
					font-weight: 600;
					margin: 6.13vw auto 4vw auto;
			}
			.text{
				height: 3.33vw; 
				font-size: 3.47vw;
				color: #999999; 
				margin: 4.8vw auto;
			}
		}
		.prompt{
			margin-top: 4.23vw;
			.text-x{
				width: 76.8vw;
				font-size: 3.47vw;
				color: #999999; 
				margin: auto;
				text-align: left;
			}
		}
		.button{
			width: 82.93vw;
			height: 11.73vw;
			position: fixed;
			bottom: 27.6vw;
			display: flex;
			left: 8.53vw;
			>view{
				width: 38.4vw;
				height: 11.73vw;
				line-height: 11.73vw;
				background-color: #0dd561;
				border-radius: 1.07vw;
				font-size: 4.8vw;
				color: #ffffff;
				margin: auto;
			}
		}
	}
</style>
