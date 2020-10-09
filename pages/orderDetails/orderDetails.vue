<template>
	<view class="wrapper">
		<view class="box">
			<view class="box-list">
				<view class="name">
					订单状态
				</view>
				<view class="text" v-if="data.orderStatus == 1 || data.orderStatus == 0">
					待支付
				</view>
				<view class="text" v-if="data.orderStatus == 9">
					已成功
				</view>
				<view class="text" v-if="data.orderStatus == 5">
					支付失败
				</view>
			</view>
			<view class="box-list">
				<view class="name">
					下单时间
				</view>
				<view class="text">
					{{data.createTime}}
				</view>
			</view>
			<view class="box-list">
				<view class="name">
					订单总价
				</view>
				<view class="text">
					{{data.tradeAmt}}
				</view>
			</view>
		</view>
		<view class="box">
			<view class="box-list">
				<view class="name">
					开球时间
				</view>
				<view class="text">
					{{data.effectiveTime}}
				</view>
			</view>
			<view class="box-list">
				<view class="name">
					打球人数
				</view>
				<view class="text">
					{{data.goodsNumber}}
				</view>
			</view>
			<view class="box-list">
				<view class="name">
					打球人
				</view>
				<view class="text">
					{{data.contact}}
				</view>
			</view>
			<view class="box-list">
				<view class="name">
					联系电话
				</view>
				<view class="text">
					{{data.contactWay}}
				</view>
			</view>
		</view>
		<view class="box">
			<view class="box-list">
				<view class="name">
					活动名称
				</view>
				<view class="text">
					{{data.courseName}}
				</view>
			</view>
			<view class="box-list">
				<view class="name">
					地址
				</view>
				<view class="text">
					{{data.address}}
				</view>
			</view>
		</view>
		<view class="operation">
			<view class="" @click="go">
				联系客服
			</view>
			<view class="" @click="scheduleCourseUnifiedpay" v-if="data.orderStatus == 1 || data.orderStatus == 0">
				支付订单
			</view>
			<view class="" v-if="data.orderStatus == 9"> 
				已支付
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {},
		data() {
			return {
				golfOrderId: null,
				data: null,
				
			}
		},
		watch: {},
		computed: {},
		onLoad(option) {
			console.log(option.golfOrderId)
			this.golfOrderId = option.golfOrderId;
			this.orderDetail()
		},
		onShow() {

		},
		created() {},
		mounted() {},
		methods: {
			//判断是否为订场或者活动  1-订场, 2-活动
			determineType() {
					this.$api.api.activityActivityUnifiedpay({
						data: {
							orderId: golfOrderId
						}
					}).then(res => {
						this.paymini(res);
					})
				
			},
			//通过订单ID获取微信支付数据
			scheduleCourseUnifiedpay(){
				this.$api.api.scheduleCourseUnifiedpay({
					data: {
						golfOrderId: this.golfOrderId
					}
				}).then(res => {
					this.paymini(res)
				})
			},
			//支付
			paymini: function(value) {
				console.log(value);
				// 调起支付
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: value.data.data.timestamp,
					nonceStr: value.data.data.nonceStr,
					package: "prepay_id=" + value.data.data.prepayId,
					signType: value.data.data.signType,
					paySign: value.data.data.paySign,
					success: function(res) {
						uni.showToast({
							title: '支付成功',
							icon: "none",
							duration: 1000
						});
						setTimeout(function(){
							uni.navigateTo({ //跳入支付成功页面
								url: '/pages/payForSuccess/payForSuccess'
							});
						},1000)
						
					},
					fail: function(err) {
						uni.showToast({
							title: '支付失败',
							icon: "none",
							duration: 2000
						});
					}
				});
			},
			//打电话
			go() {
				let _this = this;
				uni.makePhoneCall({
					// 手机号
					phoneNumber: '19180783093',

					// 成功回调
					success: (res) => {
						console.log('调用成功!')
					},

					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}

				});
			},
			//通过订单号获取订单数据
			orderDetail() {
				this.$api.api.orderDetail({
					data: {
						orderId: this.golfOrderId
					},
				}).then(res => {
					console.log(res)
					this.data = res.data.data
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
			padding: 0 4.4vw;
			background-color: #ffffff;
			margin-top: 3.2vw;

			.box-list {
				height: 9vw;
				line-height: 9vw;
				font-size: 3.73vw;
				display: flex;

				.name {
					width: 23.87vw;
					height: 9vw;
					color: #999999;
				}

				.text {
					height: 9vw;
					color: #999999;
					color: #333333;
				}
			}
		}

		.operation {
			width: 83.3vw;
			height: 11.73vw;
			position: fixed;
			display: flex;
			left: 8.3vw;
			bottom: 27.6vw;
			>view {
				width: 38.4vw;
				position: absolute;
				height: 11.73vw;
				border-radius: 1.07vw;
				text-align: center;
				line-height: 11.73vw;
				font-size: 4.8vw;
				color: #ffffff;
				background-color: #0dd561;
			}
			>view:nth-child(2){
				right: 0;
			}
		}
	}
</style>
