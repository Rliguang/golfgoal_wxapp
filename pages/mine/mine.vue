<template>
	<view class="golf-mineCenter">
		<view class="glof-mineBg">
			<view class="flex flex-start align-center">
				<view class="golf-userAvtar">
					<image v-if="golfGalleryId" :src="info.avatar"></image>
					<image v-else src="../../static/image/default.png"></image>
				</view>
				<text v-if="golfGalleryId" class="golf-userName">{{info.nickname}}</text>
				<button v-else class="normalClass"  type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo" @click="golfLogin"
				 hover-class="btn-hover">
					点击登录
				</button>
			</view>
		</view>
		<view class="golf-module">
			<view class="box left" @click="orderList">
				<view class="text">
					<text>{{info.orderNumber}}</text>
				</view>
				<view class="text">
					我的订单
				</view>
			</view>
			<view class="box" @click="coupon">
				<view class="text">
					<text>{{info.couponNumber}}</text>
				</view>
				<view class="text">
					优惠劵
				</view>
			</view>
		</view>
		<view class="golf-record">
			<view class="golf-formItem right flex flex-between" @click="playRecords">
				<text>打球记录</text>
				<text>{{info.playNumber}}次</text>
			</view>
			<view class="golf-formItem right flex flex-between" @click="onlookersRecord">
				<text>围观记录</text>
				<text>{{info.lookNumber}}次</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		props: {},
		data() {
			return {
				info:{
					playNumber:0,
					lookNumber:0
				},
				golfGalleryId:0
			}
		},
		watch: {},
		computed: {},
		onShow() {
			this.golfGalleryId=uni.getStorageSync('golfGalleryId')
			if(this.golfGalleryId){
				this.mineInfo()
			}
		},
		methods: {
			//跳转至优惠劵
			coupon() {
				uni.navigateTo({
					url: '/pages/coupon/coupon'
				});
			},
			//跳转至我的订单
			orderList() {
				if(uni.getStorageSync('golfGalleryId') == ''){
					uni.showToast({
						title: '请先登录',
						duration: 2000,
						icon: "none"
					});
					return
				}
				uni.switchTab({
					url: '../orderList/orderList'
				});
			},
			//跳转至打球记录
			playRecords() {
				if(uni.getStorageSync('golfGalleryId') == ''){
					uni.showToast({
						title: '请先登录',
						duration: 2000,
						icon: "none"
					});
					return
				}
				uni.navigateTo({ 
					url: '/pages/PlayingRecord/PlayingRecord'
				});
			},
			//跳转至围观记录
			onlookersRecord() {
				if(uni.getStorageSync('golfGalleryId') == ''){
					uni.showToast({
						title: '请先登录',
						duration: 2000,
						icon: "none"
					});
					return
				}
				uni.navigateTo({ 
					url: '/pages/onlookersRecord/onlookersRecord'
				});
			},
			getUserInfo() {
				new Promise(resolve => {
					uni.getUserInfo({ //获取用户信息
						success: res => {
							resolve({
								nickName: res.userInfo.nickName, //昵称
								avatar: res.userInfo.avatarUrl, //头像
								sex: res.userInfo.gender, //性别 0未填 1 男性 2女性
							});
						}
					})
				}).then(resUserInfo => {
					uni.setStorage({
						key: 'userInfo',
						data: resUserInfo,
					});
					this.$store.commit('userInfo', resUserInfo) //保存至Vuex内存
					return new Promise(async resolve => {
						let _this = this;
						setTimeout(function(){
							_this.$api.login.loginRequest({
								data: {
									avatar: resUserInfo.avatar,
									creatorOpenId: _this.openId|| uni.getStorageSync('openId'),
									nickname: resUserInfo.nickName,
									sex: resUserInfo.sex,
									openId: _this.openId|| uni.getStorageSync('openId'),
									updatorOpenId: _this.openId|| uni.getStorageSync('openId'),
								},
							}).then(res => {
								uni.setStorage({ //高尔夫球员ID存入本地
									key: 'golfGalleryId',
									data: res.data.data.golfGalleryId,
								});
								_this.golfGalleryId=res.data.data.golfGalleryId
								_this.mineInfo()
							})
						},200)
					})
				})
			},
			
			//点击授权登录获取信息
			async golfLogin() {
				/*  #ifndef  H5  */ //H5页面不生效
				new Promise(resolve => {
					uni.getProvider({ //获取设备权限信息
						service: 'oauth',
						success: res => {
							resolve(res);
						}
					})
				}).then(res => {
					return new Promise(resolve => {
						uni.login({ //登录加载获取code
							provider: `${res.provider[res.provider.length-1]}`,
							success: res => {
								resolve(res);
							}
						});
					}).then(loginCode => {
						return new Promise(resolve => {
							this.$api.login.openIdRequest({ //获取openid
								data: {
									code: loginCode.code
								}
							}).then(res => {
								resolve(res);
								this.openId = res.data.data.openid
								uni.setStorage({
									key: 'openId',
									data: res.data.data.openid,
								});
								this.$store.commit('openId', res.data.data.openid)
							})
							//默认球场请求
							this.$store.dispatch('golfCourse')
						})
					})
				})
				/*  #endif  */
			},
			mineInfo() {
				this.$api.mine.mineInfo({
					data:{
						galleryId:uni.getStorageSync('golfGalleryId')
					}
				}).then(res=>{
					this.info=res.data.data
				})
			}
		},
		created() {},
		mounted() {}
	}
</script>
<style scoped lang="less">
	.golf-module{
		width: 93.6vw;
			height: 21.87vw;
			background-color: #ffffff;
			border-radius: 1.07vw;
			margin: auto;
			margin-top: 4.23vw;
			display: flex;
			.box{
				width: 49.9vw;
				height: 16vw;
				margin-top: 2.93vw;
				.text{
					height: 8vw;
					line-height: 8vw;
					font-size: 4.53vw;
					color: #333333;
					text-align: center;
				}
			}
			.left{
				border-right: 0.2px solid #eeeeee;
			}
	}
	.normalClass{
		outline: none;
		background: rgba(0,0,0,0);
		color: #000000;
	}
	.normalClass::after{
		border: none;
	}
	.glof-mineBg {
		background-color: #fff;
		padding: 40rpx;
	}

	.golf-userAvtar image {
		width: 128rpx;
		height: 128rpx;
	}

	.golf-userName {
		font-size: 36rpx;
		font-weight: 500;
		color: #333;
		margin-left: 32rpx;
	}

	.golf-record {
		background-color: #fff;
		margin: 24rpx;
		padding: 24rpx;
	}

	.golf-formItem {
		width: 100%;
		text-align: left;
		padding: 32rpx 0;
		border-bottom: 2rpx solid #eee;
		position: relative;
	}

	.golf-formItem:last-child {
		border-bottom: none;
	}

	.golf-formItem text {
		margin-right: 24rpx;
	}

	.right:after {
		content: ' ';
		width: 20rpx;
		height: 20rpx;
		border-top: 2rpx solid #b0afb2;
		border-right: 2rpx solid #b0afb2;
		transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		/* IE 9 */
		-moz-transform: rotate(45deg);
		/* Firefox */
		-webkit-transform: rotate(45deg);
		/* Safari 和 Chrome */
		-o-transform: rotate(45deg);
		position: absolute;
		top: 45rpx;
		right: 0;
	}
</style>
