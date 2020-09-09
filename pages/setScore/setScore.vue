<template>
	<view class="wrapper">
		<view class="setScore">
			<view class="scoreHead">
				<text class="scoreName">姓名</text>
				<text class="scorePar">PAR({{par}})</text>
				<text class="scoreNum">本洞计分</text>
			</view>
			<view class="scoreBody" v-for="item in golferScoreModelList" :key="item.golfTournamentGalleryId">
				<text :class="[$utils.isColor(item.tee), 'scoreName']">{{item.nickname}}</text>
				<text class="scorePar">{{item.holeScoreList[0].hit}}</text>
				<view class="scoreNum">
					<text @click="downCore(item)">-</text>
					<text>{{item.holeScoreList[0].handicap === 0 ? 'par' : item.holeScoreList[0].handicap}}</text>
					<text @click="addCore(item)">+</text>
				</view>
			</view>
		</view>
		<button type="primary" class="save" @click="save">保存本洞成绩</button>
		<text>*如果想将本洞记为未打未记分状态,请按下面按钮</text>
		<button type="default" class="clear" @click="clear">清除本洞成绩</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				golfTournamentId: '',
				holeNo: '',
				par: '',
				firstHole: 0,
				golferScoreModelList: []
			}
		},
		onLoad (option) {
			this.golfTournamentId = option.golfTournamentId
			this.holeNo = option.holeNo
			this.par = Number(option.par)
			this.getCore()
		},
		methods: {
			downCore (item) {
				if (Number(item.holeScoreList[0].hit) > 1) {
					item.holeScoreList[0].handicap = Number(item.holeScoreList[0].handicap) - 1
					item.holeScoreList[0].hit = this.par + item.holeScoreList[0].handicap
				}
			},
			addCore (item) {
				item.holeScoreList[0].handicap = Number(item.holeScoreList[0].handicap) + 1
				item.holeScoreList[0].hit = this.par + item.holeScoreList[0].handicap
			},
			async save () {
				let arr = []
				for (let val of this.golferScoreModelList) {
					arr.push({
						golfTournamentHoleScoreId: val.holeScoreList[0].golfTournamentHoleScoreId,
						handicap: val.holeScoreList[0].handicap,
					})
				}
				const {
					data: res
				} = await this.$api.setScore.holeScore({
					data: {
						holeScoreList: arr
					}
				})
				if (res.code === 0) {
					
					if (this.firstHole) {
						uni.showToast({
							title: '保存成功',
							duration: 2000
						});
						uni.navigateBack({
							delta: 1
						})
					} else {
						this.$api.setScore.setFirstHole({
							data: {
								golfTournamentId: this.golfTournamentId,firstHole: this.holeNo
							}
						}).then(res => {
							uni.showToast({
								title: '保存成功',
								duration: 2000
							});
							uni.navigateBack({
								delta: 1
							})
						})
					}
				}
			},
			async clear () {
				uni.showModal({
				    title: '提示',
				    content: '是否确认删除本洞所有成绩？',
				    success: async (res) => {
				        if (res.confirm) {
							let arr = []
							for (let val of this.golferScoreModelList) {
								arr.push({
									golfTournamentHoleScoreId: val.holeScoreList[0].golfTournamentHoleScoreId,
									handicap: 0,
								})
							}
							const {
								data: res
							} = await this.$api.setScore.clearHoleScore({
								data: {
									holeScoreList: arr
								}
							})
							if (res.code === 0) {
								uni.showToast({
									title: '保存成功',
									duration: 2000
								});
								uni.navigateBack({
									delta: 1
								})
							}
				        } else if (res.cancel) {
				        }
				    }
				});
				
			},
			async getCore () {
				const {
					data: res
				} = await this.$api.setScore.getScore({
					data: {
						golfTournamentId: this.golfTournamentId*1,
						holeNo: this.holeNo
					}
				})
				if (res.code === 0) {
					this.golferScoreModelList = res.data.golferScoreModelList
					for (let val of this.golferScoreModelList) {
						val.holeScoreList[0].hit = this.par + Number(val.holeScoreList[0].handicap)
					}
					this.firstHole = res.data.golfTournament.firstHole
					uni.setNavigationBarTitle({
					    title: '当前球洞:' + this.holeNo 
					});
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.wrapper {
		.setScore {
			width: 100%;
			padding: 0 24rpx;
			box-sizing: border-box;
			overflow: hidden;
			>view {
				display: flex;
				align-items: center;
				>.scoreName {
					flex: 1;
					text-align: left;
				}
				>.scorePar {
					flex: 0 0 114rpx;
					text-align: center;
				}
				>.scoreNum {
					flex: 0 0 250rpx;
					text-align: center;
				}
			}
			>.scoreHead {
				margin: 24rpx 0 44rpx;
				>text {
					font-size:28rpx;
					font-family:PingFangSC-Medium,PingFang SC;
					font-weight:500;
					color:rgba(51,51,51,1);
					line-height:40rpx;
				}
			}
			>.scoreBody {
				margin-bottom: 40rpx;
				>.scoreName {
					border-radius:4px;
					box-sizing: border-box;
					padding: 12rpx;
					color: white;
				}
				>.scoreNum {
					border:2px solid rgba(204,204,204,1);
					border-radius:4px;
					display: flex;
					>text {
						text-align: center;
						flex: 1;
						padding: 12rpx 0;
					}
				}
			}
		}
		>button {
			width: 686rpx;
			margin-top: 16rpx;
			margin-bottom: 16rpx;
			color: white;
		}
		>text {
			// margin: 0 auto;
			width: 100%;
			display: inline-block;
			text-align: center;
			font-size:24rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(255,59,48,1);
			line-height:33rpx;
		}
		>.clear {
			background-color: rgba(255,59,48,1);
		}
	}
</style>
