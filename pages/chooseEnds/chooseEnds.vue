<template>
	<view class="golf-searchSiteList">
		<!-- 搜索框 start -->
		<view class="golf-searchTopBox">
			<view class="golf-searchBoxRadius flex align-center">
				<image src="../../static/image/search.png" mode="" class="golf-searchImg"></image>
				<input class="golf-searchInput" type="search" v-model="ipt" @confirm="searchNow($event)" placeholder="请输入球场名称"></input>
			</view>
		</view>
		<!-- 搜索框 end -->

		<!-- 球场列表 start -->
		<view class="container">
			<view class="golf-siteInfo" v-for="(item,index) in golfCourseList" :key="index" @click="bindSiteList(index)">
				<view class="flex flex-between">
					<view class="golf-site">{{item.courseName}}<!-- <text>最近去过</text> -->
					</view>
					<!-- <view class="golf-distance">7.1KM</view> -->
				</view>
				<!-- <view class="golf-line flex flex-start align-center">
					<view class="golf-speed"><text>果岭速度：</text>8.5</view>
					<view class="golf-weather"><text>{{item.weather}}</text> 24°C/32°C</view>
				</view> -->
			</view>
		</view>
		<!-- 球场列表 end -->
	</view>

</template>

<script>
	export default {
		data() {
			return {
				searchKey: [],
				ipt: '',
				searchClose: true,
				golfCourseList: [], //球场列表数据
			}
		},
		created() {
			this.chooseEnds()
		},
		computed: {},
		methods: {
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

			//点击选择球场
			bindSiteList(index) {
				this.$store.commit('courseDefultInfo', this.golfCourseList[index])
				uni.setStorage({ //球场信息存入本地
					key: 'courseDefultInfo',
					data: this.golfCourseList[index],
				});
				uni.navigateBack({
					url: '/pages/games/games',
				});
			},

			searchNow(e) {
				this.chooseEnds(e.target.value)
				// if (this.ipt == '') {
				// 	uni.showToast({
				// 		title: '未输入搜索关键字',
				// 		icon: 'none',
				// 		duration: 1000
				// 	});
				// 	return false;
				// }
				// var that = this;
				// var newArr = that.searchKey;
				// newArr.push(this.ipt);
				// this.searchKey = newArr;
				// var newStr = newArr.join('-');
				// uni.setStorage({
				// 	key: 'searchLocal',
				// 	data: newStr
				// });
			},
		},
	}
</script>

<style scoped>
	.golf-searchTopBox {
		width: 100%;
		background-color: #0dd561;
		height: 88rpx;
		box-sizing: border-box;
		padding-top: 15rpx;
	}

	.golf-searchBoxRadius {
		width: 90%;
		height: 60rpx;
		background-color: #0bcc5e;
		margin-left: 5%;
		overflow: hidden;
		border-radius: 30rpx;
	}

	.golf-searchImg {
		width: 33rpx;
		height: 32rpx;
		line-height: 60rpx;
		margin: 18rpx;
	}

	.golf-searchInput {
		width: 80%;
		height: 60rpx;
		line-height: 60rpx;
		margin-left: 10rpx;
		background-color: #0bcc5e;
		color: #FFFFFF;
	}

	.golf-searchInput::-webkit-input-placeholder {
		color: #FFFFFF;
	}

	.golf-siteInfo {
		background-color: #fff;
		padding: 32rpx 24rpx;
		margin-bottom: 24rpx;
	}

	.golf-site text {
		width: 120rpx;
		height: 32rpx;
		line-height: 32rpx;
		font-size: 24rpx;
		color: #fff;
		background-color: #0dd561;
		border-radius: 4rpx;
		margin-left: 24rpx;
		padding: 2rpx 12rpx;
	}

	.golf-distance {
		font-size: 32rpx;
		font-weight: 600;
		color: #0dd561;
		line-height: 45rpx;
	}

	.golf-line {
		line-height: 3.2;
	}

	.golf-speed {
		font-size: 24rpx;
		color: #999;
		line-height: 40rpx;
		height: 40rpx;
		border-radius: 24px;
		border: 2rpx solid #999;
		padding: 0 15rpx;
		text-align: center;
	}

	.golf-weather {
		font-size: 26rpx;
		color: #999;
		margin-left: 32rpx;
	}
</style>
