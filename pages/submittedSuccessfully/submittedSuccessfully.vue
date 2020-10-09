<template>
	<view class="container">
		<view class="box">
			<view class="">
				<image class="submitted" src="../../static/image/submitted.png" mode=""></image>
			</view>
			<view class="">
				<image class="successfully" src="../../static/image/successfully.png" mode=""></image>
			</view>
			<view class="bold">
				提交成功
			</view>
			<view class="text">
				商家正在为您确认球位
			</view>
			<view class="text">
				15分钟内短信通知您球位确认结果
			</view>
		</view>
		<view class="prompt">
			<view class="text-x">
				温馨提示
			</view>
			<view class="text-x">
				非工作时间(18:00-07:30)之间提交订单,确认球位时间会延长,可能需要工作时间返回确认信息
			</view>
		</view>
		<view class="button">
			<view class="" @click="orderDetails">
				查看订单详情
			</view>
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
				golfOrderId: ''
			}
		},
		onLoad(option) {
				this.golfOrderId = option.golfOrderId
		},
		created() {
		},
		mounted() {
		},
		// 下拉刷新
		onPullDownRefresh() {},
		methods: {
			orderDetails() {
				uni.navigateTo({ //跳入提交成功页面
					url: '/pages/orderDetails/orderDetails?golfOrderId=' + this.golfOrderId
				});
			},
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
			.submitted{
				width: 78.4vw;
				height: 13.73vw;
				margin: auto;
				margin-top: 7.2vw;
			}
			.successfully{
				width: 14.4vw;
				height: 14.4vw;
				margin: auto;
				margin-top: 11.47vw;
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
			}
			>view:nth-child(1){
				margin-right: 6.13vw;
			}
		}
	}
</style>
