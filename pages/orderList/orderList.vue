<template>
	<view class="wrapper">
		<bar :nav="setNav"></bar>
		<view class="box" v-for="value in data" @click="orderDetails(value)">
			<view class="box-list">
				<view class="name">
					活动订单
				</view>
				<view class="text">
					{{value.courseName}}
				</view>
			</view>
			<view class="box-list">
				<view class="name">
					开球时间
				</view>
				<view class="text">
					{{value.effectiveTime}}
				</view>
			</view>
			<view class="box-list">
				<view class="name">
					订单总价
				</view>
				<view class="text">
					￥{{value.tradeAmt}}
				</view>
			</view>
			<view class="state pay-for" v-if="value.orderStatus == 1 || value.orderStatus == 0">
				去支付
			</view>
			<view class="state" v-if="value.orderStatus == 3 || value.orderStatus == 4 || value.orderStatus == 5">
				已关闭
			</view>
			<view class="state" v-if="value.orderStatus == 9">
				已支付
			</view>
			<view class="activity" v-if="value.orderType == 2">
				活动
			</view>
		</view>
	</view>
</template>

<script>
	import bar from '../../components/bar/bar.vue'
	export default {
		components: {
			bar
		},
		data() {
			return {
				data: null,
				// 自定义导航栏对象
				setNav: {
					'bg': '#00D458', //背景色
					'color': 'white', //字体颜色
					'isdisPlayNavTitle': false, //是否显示返回按钮，由于导航栏是共用的，把所有的东西封装好，
					// 然后有些页面不需要的东西通过条件控制进行显示与隐藏
					'navTitle': '订单列表' //导航标题
				},
			}
		},
		watch: {},
		computed: {},
		onLoad(option) {

		},
		onShow() {

		},
		created() {
			this.orderPage()
		},
		mounted() {},
		methods: {
			orderPage() {
				this.$api.api.orderPage({
					data: {
						golfGalleryId: uni.getStorageSync('golfGalleryId'),
						current: 1,
						size: 100
					},
				}).then(res => {
					this.data = res.data.data.records
				})
			},
			orderDetails(value) {
				uni.navigateTo({
					url: '/pages/orderDetails/orderDetails?golfOrderId=' + value.golfOrderId
				})
			}
		},
	}
</script>
<style scoped lang="less">
	.wrapper {
		height: 100vh;
		background-color: #f5f5f5;

		.box {
			width: 93.6vw;
			height: 27.73vw;
			background-color: #ffffff;
			box-shadow: 0vw 0.27vw 2.67vw 0vw rgba(0, 0, 0, 0.02);
			border-radius: 1.07vw;
			margin: 3.2vw;
			padding: 1vw 0;
			position: relative;

			.box-list {
				height: 9vw;
				line-height: 9vw;
				font-size: 3.73vw;
				color: #333333;
				display: flex;

				.name {
					width: 21vw;
					height: 9vw;
					color: #999999;
					margin-left: 3.3vw;
				}

				.text {
					height: 9vw;
				}
			}

			.state {
				width: 18.4vw;
				height: 3.47vw;
				font-size: 3.73vw;
				color: #cccccc;
				position: absolute;
				right: 3.33vw;
				bottom: 5.73vw;
				text-align: right;

			}

			.pay-for {
				width: 19.2vw;
				height: 6.93vw;
				border-radius: 0.53vw;
				border: solid 1px #0fd762;
				color: #0fd762;
				text-align: center;
				line-height: 6.93vw;
			}

			.activity {
				width: 9.33vw;
				height: 4.53vw;
				line-height: 4.53vw;
				background-color: #ff3b30;
				box-shadow: 0vw 0.27vw 2.67vw 0vw rgba(0, 0, 0, 0.02);
				border-radius: 0vw 1.07vw 0vw 13.33vw;
				position: absolute;
				top: 0;
				right: 0;
				font-size: 2.67vw;
				color: #ffffff;
				text-align: center;
			}
		}
	}
</style>
