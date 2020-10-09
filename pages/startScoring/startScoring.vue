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
			PK设置
		</view>
		<view class="golf-setThe">
			<view class="radio">
				<label class="radio" @click="whetherThumb" >
					<checkbox v-model="thumbPassword" color="#0dd561" style="transform:scale(0.7)" />
					开启点赞密码验证 
				</label>
				<!-- <image @click="whetherThumb" v-show="thumbUpPassword==''" src="../../static/image/radio.png" mode=""></image>
				<image @click="whetherThumb" v-show="thumbUpPassword!=''" src="../../static/image/radio-x.png" mode=""></image> -->
				<!-- 开启点赞密码验证 -->
			</view>
			<!-- <label class="radio">
				<checkbox   color="#0dd561" style="transform:scale(0.7)" /> </label> -->
			<view class="imgs"  @click="passwordPrompt = true">
				<image src="../../static/image/question.png" mode=""></image>
				围观用户需输入密码才可进行点赞
			</view>
			<view class="password" @click="isThumbPassword = true" v-if="thumbPassword">
				{{thumbUpPassword}}
				<image src="../../static/image/xiugai.png" mode=""></image>
			</view>
			<view class="golf-title">
			</view>
			比赛规则
		</view>
		<view class="golf-rule">
			<evan-radio-group class="golf-ruleRadio" v-model="ruleData">
				<evan-radio ﻿v-for="item in ruleList" :key="item.value" style="margin-right: 60rpx;" primary-color="#0dd561" :label="item.value"
				 @change="bindRule(item.value)">{{item.label}}</evan-radio>
			</evan-radio-group>
		</view>
		<view class="golf-createGames">
			<button type="primary" @click="bindNext">下一步</button>
		</view>

		<view class="mask" v-if="isThumbPassword">
			<view class="editPassword">
				<view class="name">
					编辑密码
				</view>
				<view class="input-box">
					<input class="uni-input" v-model="thumbUpPassword" focus placeholder="请输入六位数字密码!" />
				</view>
				<view class="keys">
					<view class="cancel" @click="password(false)">
						取消
					</view>
					<view class="determine" @click="password(true)">
						确定
					</view>
				</view>
			</view>
		</view>

		<view class="mask" v-if="passwordPrompt">
			<view class="prompt">
				<image src="../../static/image/prompt.png" mode=""></image>
				<view class="text">
					设置密码后，围观群众查看pk详情前需输入该密码。
				</view>
				<view class="determine" @click="passwordPrompt = false">
					我知道了
				</view>
			</view>
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
				thumbPassword: false, //是否传入点赞密码
				thumbUpPassword: "123456", //密码
				passwordPrompt: false, //是否展现提示弹窗
				isThumbPassword: false, //是否展现密码输入弹窗
			}
		},
		onShow() {

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
			password(is) {
				if (is) {
					if(this.thumbUpPassword.length !== 6){
						uni.showToast({
							title: '密码必须为六位数字',
							duration: 2000,
							icon: "none"
						});
						this.thumbUpPassword = '123456'
					}
				}else{
					this.thumbUpPassword = '123456'
				}
				this.isThumbPassword = false;
			},
			whetherThumb() {
				this.thumbPassword = !this.thumbPassword;
			},
			//点击下一步
			bindNext() {
				let courseDefultInfo = uni.getStorageSync('courseDefultInfo');
				let golfGalleryId = uni.getStorageSync('golfGalleryId');
				let isControlLike = null;
				if (!this.thumbPassword) {
					//0为不点加锁
					isControlLike = 0;
				} else {
					if (this.thumbUpPassword.length == 6) {
						isControlLike = 1;
					} else {
						uni.showToast({
							title: '密码必须为六位数字',
							duration: 2000,
							icon: "none"
						});
						return false
					}
				}

				this.$api.api.createTournamentCreate({
					data: {
						teeTime: this.date + " " + this.time + ":00",
						golfCourseId: Number(courseDefultInfo.golfCourseId), //球场ID
						organizerId: Number(golfGalleryId),
						teamNumber: this.index,
						tournamentRule: this.ruleData,
						isControlLike: isControlLike,
						likePwd: this.thumbUpPassword,
					}
				}).then(res => {
					if (res.data.code == 0) {
						uni.setStorage({
							key: "golfTournamentGalleryId",
							data: res.data.data.currentTournamentGallery.golfTournamentGalleryId
						})
						uni.navigateTo({
							url: "/pages/score/score?golfTournamentId=" + res.data.data.currentTournamentGallery.golfTournamentId +
								'&type=' + 1
						})
					} else {

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

<style scoped lang="less">
	.password{
		font-size: 8vw;
		text-align: center;
		color: #333333;
		border-bottom: 1px #eeeeee solid;
		padding-bottom: 2vw;
		margin-bottom: 4vw;
		image{
			width: 4.27vw;
			height: 4.27vw;
		}
	}
	.mask {
		width: 100vw;
		background-color: rgba(0, 0, 0, 0.5);
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		.prompt {
			width: 74.67vw;
			height: 86.53vw;
			background-color: #ffffff;
			border-radius: 2.13vw;
			margin: 20vh auto;
			text-align: center;

			image {
				width: 70.4vw;
				height: 50.4vw;
				margin: 2.13vw;
				border-radius: 1.07vw;
				border-radius: 1.07vw;
			}

			.text {
				padding: 4.8vw 3.87vw;
				height: 8.67vw;
				line-height: 4vw;
				font-size: 4vw;
				color: #333333;
			}

			.determine {
				border-top: 1px solid #e5e5e5;
				height: 10vw;
				line-height: 10vw;
				font-size: 4.8vw;
				color: #1677ff;
			}
		}

		.editPassword {
			width: 74.67vw;
			height: 37.47vw;
			background-color: #ffffff;
			border-radius: 2.13vw;
			font-size: 4.27vw;
			color: #333333;
			margin: 30vh auto;

			.name {
				height: 13.47vw;
				line-height: 13.47vw;
				text-align: center;
			}

			.input-box {
				width: 68.27vw;
				height: 9.07vw;
				background-color: #eeeeee;
				border-radius: 0.53vw;
				margin: auto;

				.uni-input {
					height: 9.07vw;
					padding: 0 2vw;
					line-height: 9.07vw;
					margin: 0;
				}
			}

			.keys {
				height: 14.93vw;
				position: relative;

				>view {
					width: 16vw;
					height: 6.4vw;
					line-height: 6.4vw;
					text-align: center;
					background-color: #cccccc;
					border-radius: 0.53vw;
					color: #ffffff;
					font-size: 3.73vw;
					position: absolute;
					top: 4.27vw;
					left: 7.4vw;
				}

				.determine {
					background-color: #0dd561;
					left: 51.2vw;
				}
			}
		}


	}

	.golf-setThe {
		.radio {
			height: 14vw;
			line-height: 14vw;

			image {
				width: 4vw;
				height: 4vw;
				margin-top: 2vw;
				margin-right: 2vw;
			}
		}

		.imgs {
			height: 9vw;
			line-height: 9vw;
			background-color: #0dd561;
			border-radius: 1vw;
			font-size: 4vw;
			color: #ffffff;
			padding-left: 10vw;
			position: relative;

			image {
				width: 4vw;
				height: 4vw;
				position: absolute;
				top: 2.7vw;
				left: 3.2vw;
			}

			margin-bottom: 7.7vw;
		}
	}

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
