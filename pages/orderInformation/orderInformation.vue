<template>
	<view class="wrapper">
		<view class="up">
			<view class="name">
				{{detailDate.courseName}}
			</view>
			<view class="">
				<span>
					开球时间
				</span>
				{{detailDate.scheduleDate}}
			</view>
		</view>
		<view class="content">
			<view class="box">
				<view class="name">人数</view>
				<view class="add-and-subtract">
					<view class="subtract" @click="addAndSubtract(false)">
						<image src="../../static/image/minus_sign.png" mode=""></image>
					</view>
					<view class="ints">
						{{number}}人
					</view>
					<view class="add" @click="addAndSubtract(true)">
						<image src="../../static/image/plus_sign.png" mode=""></image>
					</view>
				</view>
			</view>
			<view class="box">
				<view class="name">姓名</view>
				<view class="text">
					<input type="text" v-model="name" placeholder="请输入姓名" />
				</view>
			</view>
			<view class="box">
				<view class="name">手机号</view>
				<view class="text">
					<input type="text" v-model="phone" placeholder="请输入手机号" />
				</view>
			</view>
			<view class="big-box">
				<view class="name">留言</view>
				<view class="text">
					<textarea type="text" v-model="message" placeholder="留言内容" />
					</view>
			</view>
		</view>
		<view class="amount">
			单价
			<span>
				￥{{detailDate.costUnitPrice}}
			</span>
		</view>
		<view class="amount">
			原价
			<span>
				￥{{costPrice}}
			</span>
		</view>
		<view class="amount">
			支付价格
			<span>
				￥{{totalPrice}}
			</span>
		</view>
		<view class="coupons" v-if="coupons && detailDate.type == 1" @click="whetherIscoupons">
			<view class="selected">
				<image src="../../static/image/successfully.png" mode="" v-if="iscoupons"></image>
			</view>
			勾选优惠券
		</view>
		<!-- 活动支付 -->
		<view class="determine" v-if="detailDate.type == 0" @click="activityUnifiedpay">
			确认支付
		</view>
		<!-- 订单下单 -->
		<view class="determine" v-if="detailDate.type == 1" @click="placeTheOrder">
			确认并预定
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: "",
				name: "",
				number: 1,
				message: "",
				activity: null,
				detailDate: null,
				costPrice: 0, //原价
				totalPrice: 0, //总价
				coupons: false, //是否拥有优惠卷
				iscoupons: false, //是否使用优惠卷
			}
		},
		watch: {},
		computed: {},
		onLoad(option) {
			if(option.detailDate){
				this.detailDate = JSON.parse(option.detailDate);
				this.costPrice = this.detailDate.costUnitPrice*1;
				this.totalPrice = this.costPrice;
			}
		},
		onShow() {
			
		},
		created() {
			this.enquireCoupon();
		},
		mounted() {
			
		},
		methods: {
			//是否使用优惠卷事件
			whetherIscoupons() {
				this.iscoupons = !this.iscoupons;
				if(this.iscoupons){
					this.totalPrice = (this.costPrice*100 - this.detailDate.couponFee*100)/100;
				}else if(!this.iscoupons){
					this.totalPrice = this.costPrice;
				}
			},
			//查询自己是否拥有优惠卷
			enquireCoupon() {
					this.$api.api.hasCoupon({
						data: {
							galleryId: uni.getStorageSync('golfGalleryId'),
						}
					}).then(res => {
						if (res.data.code === 0) {
							this.coupons = res.data.data
						}
					})
			},
			//获取活动数据
			// activityList() {
			// 	this.$api.api.getOneActivity({
			// 		data: {
			// 			activityId: this.golfTournamentId,
			// 		}
			// 	}).then(res => {
			// 		if (res.data.code === 0) {
			// 			this.activity = res.data.data
			// 			console.log(this.activity);
			// 		}
			// 	})
			// },
			//订场创建预支付订单
			placeTheOrder() {
				if(this.phone.length !== 11 && this.phone != ''){
					uni.showToast({
						title: '手机号必须传入11位',
						icon: "none",
						duration: 2000
					});
					return
				}else if(this.name == ''){
					uni.showToast({
						title: '必须输入姓名',
						icon: "none",
						duration: 2000
					});
					return
				}
				let useCoupon = 0
				if(this.iscoupons){
					useCoupon = 1;
				}
				this.$api.api.scheduleCoursePreOrder({
					data: {
						contact: this.name,
						contactWay: this.phone,
						golfCourseId: this.detailDate.golfCourseId,
						golfGalleryId: uni.getStorageSync('golfGalleryId'),
						message: this.message,
						number: this.number,
						scheduleDate: this.detailDate.scheduleDate,
						totalPrice: this.totalPrice,
						unitPrice: this.detailDate.costUnitPrice,
						costPrice: this.costPrice,
						useCoupon: useCoupon
					}
				}).then(res => {
					if(res.data.code === 0){
						uni.navigateTo({ //跳入提交成功页面
							url: '/pages/submittedSuccessfully/submittedSuccessfully?golfOrderId=' + res.data.data.golfOrderId
						});
					}else{
						uni.showToast({
							title: res.data.detailMessage,
							icon: "none",
							duration: 2000
						});
					}
				})
			},
			activityUnifiedpay() {
				if(this.phone.length !== 11 && this.phone != ''){
					uni.showToast({
						title: '手机号必须传入11位',
						icon: "none",
						duration: 2000
					});
					return
				}else if(this.name == ''){
					uni.showToast({
						title: '必须输入姓名',
						icon: "none",
						duration: 2000
					});
					return
				}
				this.$api.api.activityUnifiedpay({
						data: {
							contact: this.name,
							contactWay: this.phone,
							activityId: this.detailDate.activityId,
							golfGalleryId: uni.getStorageSync('golfGalleryId'),
							message: this.message,
							teeTime: this.detailDate.scheduleDate,
							number: this.number,
							totalPrice: this.totalPrice,
						}
					}).then(res => {
						this.paymini(res)
						})
			},
			//活动支付方法
			paymini(res) {
						// 调起支付
						uni.requestPayment({
							provider: 'wxpay',
							timeStamp: res.data.data.timestamp,
							nonceStr: res.data.data.nonceStr,
							package: "prepay_id=" + res.data.data.prepayId,
							signType: res.data.data.signType,
							paySign: res.data.data.paySign,
							success: function(res) {
								uni.showToast({
									title: '支付成功',
									icon: "none",
									duration: 1000
								});
								setTimeout(function(){
									console.log('支付成功')
									uni.switchTab({ //跳入首页
										url: '/pages/index/index'
									});
								},1000)
							},
							fail: function(err) {
								uni.showToast({
									title: res.data.detailMessage,
									icon: "none",
									duration: 2000
								});
							}
						});
			},
			addAndSubtract(is) {
				if(is){
					this.number++
				}else{
					if(this.number>1){
						this.number--
					}
				}
				this.costPrice = (this.number*1)*(this.detailDate.costUnitPrice*1);
				this.iscoupons = false;
				this.totalPrice = this.costPrice;
			}
		},
	}
</script>
<style scoped lang="less">
	.wrapper{
		height: 100vh;
		background-color: #f5f5f5;
		.up{
			width: 100vw;
				height: 18.13vw;
				background-color: #ffffff;
				margin-bottom: 3.2vw;
				line-height: 8vw;
				font-size: 3.47vw;
				padding: 0 3.33vw;
				padding-top: 4vw;
				color: #333333;
				span{
					color: #999999;
					margin-right: 2vw;
				}
		}
		.content{
			padding: 0 3.33vw;
			background-color: #ffffff;
			.box{
				height: 14vw;
				line-height: 14vw;
				border-bottom: 1px solid #eeeeee;
				font-size: 3.73vw;
				color: #333333;
				display: flex;
				position: relative;
				.name{
					width: 20vw;
					height: 14vw;
					color: #999999;
				}
				.and{
					width: 22.4vw;
					height: 4.27vw;
					position: absolute;
					right: 0;
					text-align: right;
				}
				.add-and-subtract{
					width: 22.4vw;
					height: 4.27vw;
					position: absolute;
					top: 4.9vw;
					right: 0;
					display: flex;
					.add,.subtract{
						width: 4.27vw;
						height: 4.27vw;
						image{
							width: 100%;
							height: 100%;
							display: block;
						}
					}
					.ints{
						width: 13.87vw;
						height: 4.27vw;
						line-height: 4.27vw;
						color: #333333;
						font-size: 3.73vw;
						text-align: center;
					}
				}
				.text{
					position: absolute;
					right: 0;
					height: 14vw;
					line-height: 14vw;
					text-align: right;
					>input{
						height: 14vw;
					}
				}
			}
			.big-box{
				height: 32.8vw;
				color: #333333;
				.name{
					height: 11.33vw;
					line-height: 9vw;
					font-size: 3.73vw;
					color: #999999;
				}
				.text{
					height: 17.87vw;
					font-size: 3.73vw;
					color: #333333;
					>textarea{
						line-height: 4vw;
						height: 17.87vw;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 3;
						overflow: hidden;
					}
				}
			}
		}
		.amount{
			text-align: right;
			font-size: 4vw;
			color: #333333;
			margin-top: 6.53vw;
			>span{
				font-size: 4.8vw;
				color: #fd7d2e;
				margin-left: 4.5vw;
				margin-right: 2vw;
			}
		}
		
		.coupons{
			width: 91.46vw;
				height: 8.53vw;
				line-height: 8.53vw;
				background-color: #ff3b30;
				border-radius: 0vw;
				text-align: right;
				padding: 0 4.27vw;
				font-size: 3.73vw;
				position: relative;
				color: #ffffff;
				position: fixed;
				bottom: 13.07vw;
				view{
					width: 4.27vw;
						height: 4.27vw;
						border-radius: 50%;
						position: absolute;
						top: 2.13vw;
						background-color: #ffffff;
						font-size: 0;
						image{
							width: 100%;
							height: 100%;
							border-radius: 50%;
						}
				}
		}
		
		.determine{
			width: 100vw;
			height: 13.07vw;
			line-height: 13.07vw;
					position: fixed;
				text-align: center;
				font-size: 4.8vw;
				color: #ffffff;
				background-color: #0dd561;
				bottom: 0;
		}
	}
	
</style>
