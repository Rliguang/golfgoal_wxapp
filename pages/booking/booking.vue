<template>
	<view class="container">
		<view class="stadium" v-for="item in golfCourseList" @click="jump(item)">
			<view class="imgs">
				<view class="" v-if="discount>1">

				</view>
				<image v-if="item.cover" :src="'https://dingqiang-golf.oss-cn-shenzhen.aliyuncs.com/'+item.cover" mode=""></image>
				<image v-else src="https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg"
				 mode=""></image>
			</view>
			<view class="name">
				{{item.courseName}}<!--  <span>55.10km</span> -->
			</view>
			<view class="text">
				{{item.modeData}}
			</view>
			<view class="address">
				{{item.address}}
			</view>
			<view class="price">
				¥{{item.price}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				golfCourseList: null
			}
		},
		created() {
			this.chooseEnds()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.chooseEnds();
		},
		methods: {
			//跳转
			jump(item) {
				console.log(item.golfCourseId)
				uni.navigateTo({
					url: '/pages/eetailsPitch/eetailsPitch?golfCourseId='+item.golfCourseId
				});
			},
			//获取球场信息
			async chooseEnds(courseName = '') {
				const {
					data: res
				} = await this.$api.course.chooseEndsRequest({
					data: {
						courseName: courseName
					}
				})
				if (res.code === 0) {
					this.golfCourseList = res.data.records
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

		.stadium {
			width: 93.6vw;
			height: 61.2vw;
			border-radius: 1vw;
			position: relative;
			margin: 3.3vw;
			background-color: #ffffff;

			.imgs {
				height: 37.2vw;
				border-radius: 1vw;
				color: #333333;
				overflow: hidden;
				position: relative;
				view {
					width: 8.53vw;
					height: 5.33vw;
					position: absolute;
					top: 0;
					right: 0;
					font-size: 3.2vw;
					border-radius: 1.07vw;
					color: #ffffff;
				}

				image {
					width: 100%;
					position: absolute;
					bottom: 0;
					// height: 100%;
				}
			}

			.name {
				margin: 3.2vw 3.2vw 1vw 3.2vw;
				line-height: 5.6vw;
				height: 5.6vw;
				font-size: 4vw;

				span {
					margin-left: 3vw;
				}
			}

			.text {
				height: 5vw;
				font-size: 3.4vw;
				color: #999999;
				margin: 0 3.2vw 1vw 3.2vw;
			}

			.address {
				height: 5vw;
				color: #999999;
				font-size: 3.4vw;
				margin: 0 3.2vw 1vw 3.2vw;
			}

			.price {
				position: absolute;
				height: 5vw;
				top: 47vw;
				right: 3.2vw;
				color: #FF3B30;
				font-size: 3.4vw;
			}
		}
	}
</style>
