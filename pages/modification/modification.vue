<template>
	<view class="container">
		<view class="golf-modification">
			<view class="golf-formItem flex flex-between">
				<text style="font-size: 28rpx;">开赛时间：</text>
				<view class="flex flex-start">
					<picker mode="date" :value="date" @change="bindDateChange">
						<text class="golf-date">{{date}}</text>
					</picker>
					<picker mode="time" :value="time" @change="bindTimeChange">
						<text class="golf-time">{{time}}</text>
					</picker>
				</view>
			</view>
			<view class="golf-formItem right flex flex-between">
				<text>球场规则：</text>
				<picker mode="selector" :value="index" range-key="name" :range="ruleList" @change="bindRuleChange">
					<text class="golf-rule">{{ruleList[index].name}}</text>
				</picker>
			</view>
		</view>
		<view class="golf-title flex flex-between" style="margin-top: 10rpx;font-size: 24rpx;">
			开球顺序
			<text class="golf-adjust align-center" @click="bindAdjust">
				调整排列
			</text>
			<image v-if="!paixu" src="../../static/image/paixu.png" mode=""></image>
			<image v-else src="../../static/image/paixuX.png" mode=""></image>
		</view>
		<view class="golf-sequence">
			<ul>
				<li class="flex flex-between align-center golf-seqLi" v-for="(item,index) in sequenceList" :key="index">
					<view class="flex flex-start align-center" @click="bindSwquence(index)">
						<text class="golf-num">{{item.kickoffOrder === 0 ? '' : item.kickoffOrder}}</text>
						<view class="golf-avatar">
							<img :src="item.avatar ? item.avatar : '../../static/image/default.png'">
						</view>
						<text>{{item.nickname}}</text>
					</view>
					<view class="teewei">
						<picker mode="selector" @change="bindPickerChange" :value="item.tee - 1" :range="teeList" :data-index="index">
							<view :class="['golf-tee', $utils.isColor(item.tee)]" color='red'>{{teeList[item.tee - 1]}}</view>
						</picker>

					</view>
					<view class="deleteButton" @click="deleteButton(item)">
						删除
					</view>
				</li>
			</ul>
		</view>
		<view class="golf-btn">
			<button type="primary" @click="bindSaveChangesBtn" :disabled="disabledBtn">保存修改</button>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		props: {},
		data() {
			return {
				date: '日期', //开赛日期
				time: '时间', //开赛时间
				index: 0,
				ruleList: [{ //比赛规则,0-一般规则,1-大流氓,2-小流氓
						name: '一般规则',
						value: 0
					},
					{
						name: '大流氓',
						value: 1
					},
					{
						name: '小流氓',
						value: 2
					}
				],
				golfTournamentId: '',
				golfData: null,
				sequenceList: [],
				teeList: ['黑Tee', '金Tee', '蓝Tee', '白Tee', '红Tee'],
				paixu: false
			}
		},
		created() {
			// this.getNowDate()
		},
		watch: {},
		computed: {},
		methods: {
			//调整开球顺序
			bindAdjust() {
				this.paixu = true;
				this.backgroundColor = false
				this.disabledBtn = true
				for (let i = 0; i < this.sequenceList.length; i++) {
					this.sequenceList[i].kickoffOrder = 0
				}
				//需要点击次数
				this.total = this.sequenceList.length
				this.count = 0;
			},
			//重新排序
			bindSwquence(index) {
				if (this.sequenceList[index].kickoffOrder === 0) {
					this.count = ++this.count
					for (let i = 0; i < this.sequenceList.length; i++) {
						this.sequenceList[index].kickoffOrder = this.count
					}
					//设置顺序后重新排序
					if (this.count === this.total) {
						this.sequenceList.sort(function(a, b) {
							return a.kickoffOrder - b.kickoffOrder;
						})
						this.backgroundColor = true
						this.disabledBtn = false
						this.paixu = false;
					}
				}
			},
			//删除球手方法
			deleteButton(e) {
				let _this = this;
				uni.showModal({
					title: '提示',
					content: '是否确认删除球手',
					success: function(res) {
						if (res.confirm) {
							_this.$api.player.tournamentGalleryRemove({
								data: {
									// golfGalleryId: item.golfGalleryId,
									golfTournamentId: e.golfTournamentId,
									golfTournamentGalleryId: e.golfTournamentGalleryId
								}
							}).then(res => {
								if (res.data.code == 0) {
									//操作成功
									uni.showToast({
										title: '删除成功',
										duration: 2000
									});
									_this.getGolfer();
								} else {
									uni.showToast({
										title: res.data.detailMessage,
										icon: "none",
										duration: 2000
									});
								}
							})
						} else if (res.cancel) {
						}
					}
				});

			},
			bindPickerChange(e) {
				this.sequenceList[e.target.dataset.index].tee = Number(e.detail.value) + 1
			},
			async getGolfer() {
				const {
					data: res
				} = await this.$api.arrange.getGolfer({
					data: {
						golfTournamentId: this.golfTournamentId
					}
				})
				if (res.code === 0) {
					this.sequenceList = res.data
				}
			},
			//获取当前日期时间
			getNowDate() {
				let nowDate = new Date();
				this.date = this.$utils.nowDate(nowDate)
				this.time = this.$utils.nowTime(nowDate)
			},

			//修改开赛日期
			bindDateChange(e) {
				this.date = e.detail.value;
				this.$emit('gamesDate', `${this.date} ${this.time}`);
			},

			//修改开赛时间
			bindTimeChange(e) {
				this.time = e.detail.value + ':00';
				this.$emit('gamesTime', `${this.date} ${this.time}`);
			},

			//切换规则
			bindRuleChange(e) {
				this.index = e.detail.value;
			},

			//修改
			async bindSaveChangesBtn(e) {
				let submitData = {
					golfTournamentId: this.golfTournamentId,
					golfTournamentGalleryList: this.sequenceList,
					tournamentRule: this.index,
					teeTime: `${this.date} ${this.time}`
				}
				const {
					data: res
				} = await this.$api.modification.saveGame({
					data: submitData
				})
				if (res.code === 0) {
					uni.showToast({
						title: '修改成功',
						duration: 2000
					});
					uni.navigateBack({
						delta: 1
					})
				}else{
					uni.showToast({
					    title: res.detailMessage,
					    duration: 2000,
						icon: "none"
					});
				}
			}
		},
		onLoad(option) {
			this.golfTournamentId = option.golfTournamentId
			this.golfData = JSON.parse(option.golfData)
			this.date = this.golfData.teeTime.split(' ')[0]
			this.time = this.golfData.teeTime.split(' ')[1]
			this.index = this.golfData.tournamentRule
			this.getGolfer()
		},
		mounted() {}
	}
</script>
<style scoped lang="less">
	.golf-formItem {
		background-color: #fff;
		text-align: left;
		padding: 32rpx 24rpx;
		border-bottom: 2rpx solid #eee;
		position: relative;
		/* border-bottom: 1rpx solid #eee; */
	}

	.golf-date,
	.golf-time {
		height: 44rpx;
		background: #eee;
		border-radius: 22rpx;
		padding: 6rpx 24rpx;
		color: #999;
	}

	.golf-time {
		margin-left: 20rpx;
	}

	.golf-rule {
		font-size: 28rpx;
		color: #999;
		line-height: 40rpx;
		margin-right: 12rpx;
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
		top: 40rpx;
		right: 15rpx;
	}

	.golf-sequence {
		margin-top: 28rpx;
	}

	.golf-seqLi {
		padding: 24rpx 24rpx;
		background-color: #fff;
		border-bottom: 2rpx solid #eee;
		position: relative;

		.teewei {
			right: 120rpx;
			position: absolute;
		}

		.deleteButton {
			right: 20rpx;
			position: absolute;
			text-decoration: underline;
		}
	}

	.golf-num {
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		font-weight: 600;
		color: #fff;
		border-radius: 50%;
		text-align: center;
		background-color: #0dd561;
	}

	.golf-avatar img {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		background-color: #030303;
		overflow: hidden;
		margin: 0 24rpx 0 36rpx;
	}

	.golf-tee {
		height: 44rpx;
		/* background-color: #027aff; */
		color: #fff;
		border-radius: 4rpx;
		padding: 6rpx 30rpx;
	}

	.golf-btn {
		width: 100%;
		position: absolute;
		bottom: 0;
		left: 0;
	}
	
	.golf-btn button {
		border-radius: 0;
	}
	
	.golf-title{
		position: relative;
		.golf-adjust{
			position: absolute;
			right: 40rpx;
		}
		image{
			width: 17rpx;
			height: 23rpx;
			position: absolute;
			right: 10rpx;
			top: 17rpx;
		}
	}
</style>
