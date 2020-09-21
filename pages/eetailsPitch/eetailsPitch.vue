<template>
	<view class="container">
		<view class="imgs" @click="jump">
			<image v-if="data.cover" :src="'https://dingqiang-golf.oss-cn-shenzhen.aliyuncs.com/'+data.cover" mode=""></image>
			<view class="bg">
				<view class="name">
					{{data.courseName}}
				</view>
				<view class="address">
					<image src="../../static/image/address.png" mode=""></image>
					{{data.address}}
				</view>
				<view class="price">
					￥{{data.price}}
				</view>
				<view class="photo">
					<image src="../../static/image/photo.png" mode=""></image>
					{{data.albumNumber}}
				</view>
			</view>
		</view>
		<view class="box">
			<view class="text" v-if="data.mode">
				<view class="name">
					球场模式
				</view>
				<view class="field">
					{{data.mode}}
				</view>
			</view>
			<view class="text" v-if="data.buildDate">
				<view class="name">
					建立时间
				</view>
				<view class="field">
					{{data.buildDate}}
				</view>
			</view>
			<view class="text" v-if="data.area">
				<view class="name">
					球场面积
				</view>
				<view class="field">
					{{data.area}}
				</view>
			</view>
			<view class="text" v-if="data.puttingGreenGrass">
				<view class="name">
					果岭草种
				</view>
				<view class="field">
					{{data.puttingGreenGrass}}
				</view>
			</view>
			<view class="text" v-if="data.data">
				<view class="name">
					球场数据
				</view>
				<view class="field">
					{{data.data}}
				</view>
			</view>
			<view class="text" v-if="data.designer">
				<view class="name">
					设计师
				</view>
				<view class="field">
					{{data.designer}}
				</view>
			</view>
			<view class="text" v-if="data.fairwayLength">
				<view class="name">
					球道长度
				</view>
				<view class="field">
					{{data.fairwayLength}}
				</view>
			</view>
			<view class="text" v-if="data.fairwayGrass">
				<view class="name">
					球道草种
				</view>
				<view class="field">
					{{data.fairwayGrass}}
				</view>
			</view>
		</view>
		<view class="box">
			<view class="text-center">
				<view class="name">
					球场简介
				</view>
				<view class="field">
					{{data.introduction}}
				</view>
			</view>
		</view>
		<view class="box">
			<view class="text-center">
				<view class="name">
					球场设施
				</view>
				<view class="field">
					{{data.facilitiesn}}
				</view>
			</view>
		</view>
		<view class="reservation" @click="go">
			<image src="../../static/image/reservation.png" mode=""></image>
			低价预定
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: null
			}
		},
		onLoad(options) {
			if (options.golfCourseId) {
				this.golfCourseId = options.golfCourseId
			}
		},
		created() {},
		mounted() {
			this.getOneCourse();
		},
		// 下拉刷新
		onPullDownRefresh() {},
		methods: {
			
			//跳转相册
			jump() {
				console.log(this.golfCourseId)
				uni.navigateTo({
					url: '/pages/photoAlbum/photoAlbum?golfCourseId=' + this.golfCourseId
				});
			},
			//打电话
			go() {
				let _this = this;
				uni.makePhoneCall({
					// 手机号
					phoneNumber: _this.data.contactWay,

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
			//获取球场信息
			async getOneCourse() {
				const {
					data: res
				} = await this.$api.api.getOneCourse({
					data: {
						courseId: this.golfCourseId
					}
				})
				if (res.code === 0) {
					// this.golfCourseList = res.data.records
					this.data = res.data;
					console.log(this.data)
				}
			},
		}
	}
</script>

<style scoped lang="less">
	.container {
		background-color: #f5f5f5;
		margin: 0;
		padding: 0;
		padding-bottom: 13vw;

		.imgs {
			width: 93.6vw;
			height: 48vw;
			border-radius: 2.13vw;
			margin: 3.2vw;
			position: relative;

			image {
				width: 100%;
				height: 100%;
				border-radius: 2.13vw;
			}

			.bg {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				background-color: rgba(0, 0, 0, 0.5);
				border-radius: 2.13vw;

				.name {
					width: 43.73vw;
					height: 3.73vw;
					font-size: 4vw;
					line-height: 3.73vw;
					color: #ffffff;
					position: absolute;
					top: 34vw;
					left: 3.2vw;
				}

				.address {
					width: 80.2vw;
					height: 3.57vw;
					line-height: 3.07vw;
					font-size: 3.2vw;
					color: #ffffff;
					position: absolute;
					top: 41vw;
					left: 3.2vw;
					overflow: hidden;
					text-overflow: ellipsis;

					image {
						width: 2.8vw;
						height: 3.47vw;
						position: relative;
						top: 0.5vw;
					}
				}

				.price {
					width: 13.87vw;
					height: 3.2vw;
					font-size: 4vw;
					color: #ff3b30;
					position: absolute;
					top: 40vw;
					right: 3.3vw;
					font-weight: 550;
				}

				.photo {
					width: 11vw;
					height: 4.27vw;
					padding-right: 1vw;
					background-color: #000000;
					border-radius: 2.13vw;
					opacity: 0.2;
					position: absolute;
					top: 3.2vw;
					right: 3.2vw;
					color: #ffffff;
					font-size: 3.2vw;
					text-align: right;

					image {
						width: 3.47vw;
						height: 3.2vw;
						position: relative;
						top: 0.3vw;
						margin-right: 0.5vw;
						left: -1.5vw;
						border-radius: 0;
					}
				}
			}

		}

		.box {
			margin: 3.2vw 0;
			padding: 0 3.33vw;
			background-color: #ffffff;
			text-align: left;

			.text {
				height: 9.8vw;
				line-height: 9.8vw;
				font-size: 3.73vw;
				display: flex;

				.name {
					width: 23.2vw;
					height: 9.8vw;
					color: #999999;
				}

				.field {
					font-size: 3.73vw;
					color: #333333;
					height: 9.8vw;
				}
			}

			.text-center {
				line-height: 9.8vw;
				font-size: 3.73vw;

				.name {
					width: 23.2vw;
					text-align: left;
					height: 9.8vw;
					color: #999999;
				}

				.field {
					text-align: left;
					font-size: 3.73vw;
					color: #333333;
				}
			}
		}

		.reservation {
			width: 100vw;
			height: 13.07vw;
			line-height: 13.07vw;
			background-color: #0dd561;
			text-align: center;
			color: #ffffff;
			font-size: 4.8vw;
			position: fixed;
			bottom: 0;

			image {
				width: 3.33vw;
				height: 4.13vw;
				margin-top: 4.53vw;
			}
		}
	}
</style>
