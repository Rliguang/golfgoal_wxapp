<template>
	<view class="container">
		<!-- 新建球局表单 start -->
		<view class="golf-title">基本设置</view>
		<view class="golf-formItem flex flex-between">
			<text>开赛时间：</text>
			<view class="flex flex-start">
				<picker mode="date" :value="date" @change="bindDateChange">
					<text class="golf-date">{{date}}</text>
				</picker>
				<picker mode="time" :value="time" @change="bindTimeChange">
					<text class="golf-time">{{time}}</text>
				</picker>
			</view>
		</view>
		<view class="golf-formItem right flex flex-between" @click="bindSiteChange">
			<text>比赛球场：</text>
			<text class="golf-site" v-if="courseDefultInfo">{{courseDefultInfo.courseName}}</text>
			<text class="golf-site" v-else>请选择比赛球场</text>
		</view>
		<view class="golf-formItem right flex flex-between">
			<text>同组人数：</text>
			<picker @change="bindNumChange" mode='selector' range-key="name" :value="index" :range="num">
				<text class="golf-site">{{num[index].name}}</text>
			</picker>
		</view>
		<view class="golf-title">
			比赛规则
		</view>
		<view class="golf-rule">
			<evan-radio-group class="golf-ruleRadio" v-model="ruleData">
				<evan-radio ﻿v-for="item in ruleList" :key="item.value" style="margin-right: 60rpx;" primary-color="#0dd561" :label="item.value" @change="bindRule(item.value)">{{item.label}}</evan-radio>
			</evan-radio-group>
		</view>
		<view class="golf-createGames">
			<button type="primary" @click="bindNext">下一步</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		components: {

		},
		props: {},

		data() {
			return {
				index: 0,
				num: [{
					id: 1,
					name: '4人或以内同组'
				}],
				ruleData: 0,
				date: '日期', //开赛日期
				time: '时间', //开赛时间
				ruleList: [{ //比赛规则,0-一般规则,1-大流氓,2-小流氓
						label: '一般规则',
						value: 0
					},
					{
						label: '大流氓',
						value: 1
					},
					{
						label: '小流氓',
						value: 2
					}
				],
				nextGamesData: null,
			}
		},
		onShareAppMessage(res) {

		},
		created() {
			this.getNowDate() //获取当前时间
		},
		mounted() {

		},
		computed: {
			...mapGetters(['courseDefultInfo'])
		},
		beforeDestroy() {

		},
		methods: {
			//点击下一步
			bindNext() {
				let courseDefultInfo = uni.getStorageSync('courseDefultInfo');
				let golfGalleryId = uni.getStorageSync('golfGalleryId');
				this.nextGamesData = {
					teeTime: this.date + " " + this.time + ":00",
					golfCourseId: Number(courseDefultInfo.golfCourseId), //球场ID
					organizerId: Number(golfGalleryId),
					teamNumber: this.index,
					tournamentRule: this.ruleData,
				}

				this.$api.api.createTournamentCreate({
					data: {
						teeTime: this.date + " " + this.time + ":00",
						golfCourseId: Number(courseDefultInfo.golfCourseId), //球场ID
						organizerId: Number(golfGalleryId),
						teamNumber: this.index,
						tournamentRule: this.ruleData,
					}
				}).then(res => {
					if(res.data.code == 0){
						uni.setStorage({
							key: "golfTournamentGalleryId",
							data: res.data.data.currentTournamentGallery.golfTournamentGalleryId
						})
						uni.navigateTo({
							url: "/pages/score/score?golfTournamentId=" + res.data.data.currentTournamentGallery.golfTournamentId + '&type=' + 1
						})
					}else{
						
					}
					
				})
			},
			//球赛规则
			bindRule(e) {

			},
			//获取当前日期时间
			getNowDate() {
				let nowDate = new Date();
				this.date = this.$utils.nowDate(nowDate)
				this.time = this.$utils.nowTime(nowDate, 0)
			},
			//获取开赛日期
			bindDateChange(e) {
				this.date = e.detail.value;
				this.$emit("gamesDate", `${this.date} ${this.time}`);
			},

			//获取开赛时间
			bindTimeChange(e) {
				this.time = e.detail.value;
				this.$emit("gamesTime", `${this.date} ${this.time}`);
			},
			//比赛球场
			bindSiteChange() {
				uni.navigateTo({
					url: "/pages/chooseEnds/chooseEnds"
				})
			},
		}
	}
</script>

<style scoped>
	.golf-createGames {
		width: 100%;
		position: fixed;
		bottom: 0;
		left: 0;
	}

	.golf-createGames button {
		border-radius: 0;
	}

	.golf-title {
		position: relative;
	}

	.refresh {
		position: absolute;
		top: 0;
		width: 100rpx;
		left: 560rpx;
		text-align: center;
		font-size: 28rpx;
		/* background-color: #999999; */
		/* border-radius: 20rpx; */
	}

	.refresh>image {
		width: 20rpx;
		height: 20rpx;
	}

	.golf-createForm {
		margin-bottom: 54rpx;
	}

	.golf-formItem {
		width: 100%;
		text-align: left;
		padding: 40rpx 0;
		border-bottom: 2rpx solid #eee;
		position: relative;
	}

	.golf-date,
	.golf-time {
		margin-right: 20rpx;
		height: 44rpx;
		background: #eee;
		border-radius: 22rpx;
		padding: 6rpx 24rpx;
		color: #999;
	}

	.golf-time {
		padding: 6rpx 60rpx;
	}

	.golf-site {
		padding-right: 20rpx;
		font-size: 28rpx;
		color: #999;
		line-height: 40rpx;
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
		top: 50rpx;
		right: 0;
	}

	.golf-rule {
		margin: 24rpx 0 56rpx 0;
	}
	
</style>
