<template>
	<view class="container">
		<view class="box">
			<view class="" v-for="value in scheduleCourseList" @click="cityID(value)">
				{{value.cityName}}
				<text>/{{value.courseNumber}}</text>
			</view>
		</view>
		<view class="cityName">
			当前城市: {{cityName}}
		</view>
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
				<span>¥{{item.price}}</span>
				劵后价:￥{{item.totalPrice}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				golfCourseList: null,
				scheduleCourseList: null,
				cityId: '',
				cityName: '成都'
			}
		},
		created() {
			this.chooseEnds()
			this.scheduleCourseListCity()
		},
		onShareAppMessage(res) {
			
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.chooseEnds();
		},
		methods: {
			//点击城市模块
			cityID(value){
				this.cityId = value.cityId;
				this.cityName = value.cityName;
				this.chooseEnds()
			},
			//跳转
			jump(item) {
				console.log(item.golfCourseId)
				uni.navigateTo({
					url: '/pages/eetailsPitch/eetailsPitch?golfCourseId='+item.golfCourseId
				});
			},
			//获取城市列表
			async scheduleCourseListCity(){
				const {
					data: res
				} = await this.$api.api.scheduleCourseListCity({
					data: {
					}
				})
				if (res.code === 0) {
					this.scheduleCourseList = res.data.records
				}
			},
			
			
			//获取球场信息
			async chooseEnds() {
				const {
					data: res
				} = await this.$api.course.chooseEndsRequest({
					data: {
						cityId: this.cityId,
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
		
		.box{
			padding: 3.2vw;
			display: flex;
			flex-wrap: wrap;
			view{
				width: 22.8vw;
				height: 11vw;
				line-height: 11vw;
				border: 1px solid #cccccc;
				color: #000000;
				text-align: center;
				font-size: 4vw;
				text{
					color: #999999;
					font-size: 3vw;
				}
			}
		}
		.cityName{
			height: 12.4vw;
			line-height: 12.4vw;
			margin-left: 3.2vw;
			color: #999999;
			font-size: 3.4vw;
		}
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
				font-size: 3.4vw;
				color: #ff3b30;
				span{
					color: #999999;
					font-size: 550;
					text-decoration:line-through;
				}
			}
		}
	}
</style>
