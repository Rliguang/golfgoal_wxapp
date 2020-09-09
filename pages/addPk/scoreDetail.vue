<template>
	<view class="wrapper">
		<view class="golf-scoreContent text-center">
			<text class="golf-rule">比赛规则:大流氓 果岭速度:8.5</text>
			<view class="flex flex-between align-center golf-scoreInfo">
				<view style="width: 72rpx"></view>
				<view class="golf-siteInfo">
					<view>四川成都国际场</view>
					<view class="golf-date">周{{"日一二三四五六".charAt(new Date(golfData.teeTime.split(' ')[0]).getDay())}} {{golfData.teeTime}}</view>
				</view>
				<view class="showNums">
					<image v-if="cardList.golfTournament.tournamentStatus==9" src="../../static/image/over.png" mode=""></image>
				</view>
			</view>
		</view>
		
		<view class="" style="margin: auto;">
			<view v-for="(item,index) in cardList.golferScoreModelList[0].holeScoreList" :key="index" class="oneCard twoCard">
				<view class="title">
					<view class="top">球洞</view>
					<view class="buttom">标准杆</view>
					<view v-for="(items,index1) in cardList.golferScoreModelList" :key="index1" class="top1 top">
						<image class="headImgBorder" :src="items.avatar?items.avatar:'../../static/image/mine_0.png'" mode=""></image>
						<text>{{items.nickname}}</text>
					</view>
				</view>
				<view class="scrollList">
					<view style="height: 100%;" class="">
						<view style="height: 128rpx" class="onLine">
							<view v-for="(item2, index) in scoreHole[index]" :key="index" class="contents">
								<view class=" top " :class="item2.holeNo > 0 ? 'holeNo' : ''">{{item2.holeNo > 0 ? item2.holeNo : (item2.holeNo === 0 ? 'TOT' : (item2.holeNo === -1 ? 'IN' : 'OUT'))}}</view>
								<view class=" buttom ">{{item2.par}}</view>
							</view>
						</view>
						<view class="onLine" v-for="(item3, index3) in cardList.golferScoreModelList" :key="index3">
							<view class="onePieces" v-for="(item4, index4) in item3.holeScoreList[index]" :key="index4">
								<view class="row" :style="{textAlign:align}">
									{{item4.handicap}}
									<!-- <view v-if="item4.holeNo>0">
										<view class="bird" v-if="item4.handicap==0">
											{{ item4.handicap}} 
										</view>
										<view class="bird birdc" v-if="item4.handicap>0">
											+{{ item4.handicap}} 
										</view>
										<view class="bird birda" v-if="item4.handicap == -1">
											{{ item4.handicap}}
										</view>
										<view class="bird birdb" v-if="item4.handicap < -1">
											{{ item4.handicap}}
										</view>
									</view>
									<view v-else>
										<view class="bird" v-if="item4.handicap==0">
											{{ item4.handicap}} 
										</view>
										<view class="birdc" v-if="item4.handicap>0">
											+{{ item4.handicap}} 
										</view>
										<view class="birdd" v-if="item4.handicap == -1">
											{{ item4.handicap}}
										</view>
										<view class="birdd" v-if="item4.handicap < -1">
											{{ item4.handicap}}
										</view>
									</view> -->
									<!-- <text>{{item4.handicap}}</text> -->
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import tabsControl from '@/components/tabs/tabs.vue';
import pTable from '@/components/portrait-table/portrait-table.vue';
import ballScoreItem from '@/components/ballScoreItem/ballScoreItem.vue';
export default {
	components: {
		tabsControl,
		pTable,
		ballScoreItem
	},
	props: {},
	data() {
		return {
			likeList:[],
			scoreHole:[],
			cardList:{},
			items: ['计分卡', 'PK'],
			current: 0,
			title: [
				{
					label: '傻梓木-生鲜水…',
					value: 'name'
				},
				{
					label: '用户昵称…',
					value: 'name'
				},
				{
					label: '嘻嘻哈哈',
					value: 'name'
				}
			],
			golfData: {
				teeTime: '',
				tournamentRule: ''
			},
		};
	},
	watch: {},
	computed: {},
	onLoad(option) {
		this.golfTournamentId = option.golfTournamentId;
	
	},
	onShow() {
		this.scordCard();
		this.spgetPkList();
	},
	methods: {
		toDetail(id){
			uni.navigateTo({
				url: '/pages/addPk/pkDetail?id=' + id
			});
		},
		toLike(id,ids) {

			uni.navigateTo({
				url: '/pages/addPk/addLike?id=' + id
			});
		},
		scordCard() {
			this.$api.pTable
				.scoreCard({
					data: {
						golfTournamentId: this.golfTournamentId
					}
				})
				.then(res => {
					let arr = []
					let arr1 = []
					let arr2 = []
					for (let val of res.data.data.golferScoreModelList[0].holeScoreList) {
						if (val.isOut == 0 && val.holeNo != 0 && val.holeNo != -1) {
							arr1.push({
								holeNo: val.holeNo,
								par: val.par
							})
						} else if (val.isOut == 1 || val.holeNo == 0) {
							arr2.push({
								holeNo: val.holeNo,
								par: val.par
							})
						}
					}
					this.scoreHole = [arr1, arr2]
					res.data.data.golferScoreModelList.map(item => {
						let arr3 = []
						let arr4 = []
						// item.holeScoreList=this.group(item.holeScoreList,11)
						for (let val of item.holeScoreList) {
								if (val.isOut == 0 && val.holeNo != 0 && val.holeNo != -1) {
								arr3.push(val)
							} else if (val.isOut == 1 || val.holeNo == 0) {
								arr4.push(val)
							}
						}
						item.holeScoreList = [arr3, arr4]
			
					})
					this.golfData.teeTime = res.data.data.golfTournament.teeTime
					this.golfData.tournamentRule = res.data.data.golfTournament.tournamentRule
					this.cardList = res.data.data
				});
			// this.$api.pTable
			// 	.scoreCard({
			// 		data: {
			// 			golfTournamentId: this.golfTournamentId
			// 		}
			// 	})
			// 	.then(res => {
			// 		let arr=[]
			// 		for (let val of res.data.data.golferScoreModelList[0].holeScoreList) {
			// 			arr.push({holeNo: val.holeNo,par: val.par})
			// 		}
			// 		this.scoreHole = arr
			// 		this.golfData.teeTime = res.data.data.golfTournament.teeTime
			// 		this.golfData.tournamentRule = res.data.data.golfTournament.tournamentRule
			// 		this.cardList=res.data.data
			// 	});
		},
		spgetPkList() {
			this.$api.score
				.spgetPkList({
					data: {
						golfTournamentId: this.golfTournamentId
					}
				})
				.then(res => {
					this.likeList=res.data.data.pkLikeModelList
				});
		},
		onClickItem(e) {
			if (this.current !== e.currentIndex) {
				this.current = e.currentIndex;
			}
		}
	},
	created() {},
	mounted() {}
};
</script>
<style lang="less" scoped>
	.onLine{
		display: flex;
		.onePieces{
			height: 98rpx;
			display: flex;
			.row{
				width: 62rpx;
				height:100%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;	
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				border: 1rpx solid rgba(238, 238, 238, 1);
				border-top: none;
				image {
					width: 36rpx;
					height: 36rpx;
				}
			}
		}
	}
	view{
		box-sizing: border-box;
	}
.onePiece {
	width: 100%;
	background: rgba(255, 255, 255, 1);
	.tabTitle {
		height: 70rpx;
		display: flex;
		padding: 0 35rpx 0 24rpx;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid rgba(238, 238, 238, 1);
		 image:nth-child(1) {
			width: 42rpx;
			height: 23rpx;
		}
		text {
			font-size: 22rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(0, 123, 255, 1);
			text-decoration: underline;
		}
	}
	.middle {
		height: 122rpx;
		display: flex;
		.most {
			width: 75%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: space-around;
			border-right: 1rpx solid rgba(238, 238, 238, 1);
			border-bottom: 1rpx solid rgba(238, 238, 238, 1);
			view {
				height: 100%;
				display: flex;
				flex: 1;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				text {
					display: inline-block;
					width: 100%;
					text-align: center;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
		.last {
			width: 25%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding-right: 12rpx;
			border-right: 1rpx solid rgba(238, 238, 238, 1);
			border-bottom: 1rpx solid rgba(238, 238, 238, 1);
		}
		image:nth-child(1) {
			width: 36rpx;
			height: 36rpx;
		}
		image:nth-child(2) {
			width: 22rpx;
			height: 22rpx;
			margin-right: 12rpx;
		}
	}
}
.golf-adjust {
	width: 108rpx;
	height: 44rpx;
	background: rgba(0, 193, 92, 1);
	border-radius: 4px;
	text-align: center;
	line-height: 44rpx;
	font-size: 24rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: rgba(255, 255, 255, 1);
	line-height: 44rpx;
	margin-left: 12rpx;
}
.golf-title {
	height: 40rpx;
	margin: 30rpx 0;
	margin-right: 24rpx;
}
.oneCard {
	// height: 128rpx;
	// height: 324rpx;
	display: flex;
	width: 100%;
	.scrollList {
		display: flex;
		flex: 1;
		width: 470rpx;
		height: 100%;
		white-space: nowrap;
		flex-direction: column;
		.contents {
			display: inline-flex;
			width: 62rpx;
			height: 100%;
			// display: flex;
			flex-direction: column;
			// border-right: 1rpx solid rgba(238,238,238,1);
			// border-left: 1rpx solid rgba(238,238,238,1);
			.top {
				width: 100%;
				height: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				background: rgba(255, 59, 48, 1);
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				border: 1rpx solid rgba(238, 238, 238, 1);
				image {
					width: 36rpx;
					height: 36rpx;
				}
			}
			.buttom {
				width: 100%;
				height:50%;
				display: flex;
				align-items: center;
				justify-content: center;
				background: rgba(15, 215, 98, 1);
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				border: 1rpx solid rgba(238, 238, 238, 1);
				border-top: none;
				image {
					width: 36rpx;
					height: 36rpx;
				}
			}
		}
	}
	.title {
		width: 140rpx;
		height: 100%;
		display: flex;
		flex-direction: column;
		
		.top {
			width: 100%;
			height: 64rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: rgba(255, 59, 48, 1);
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
			border-bottom: 1rpx solid rgba(238, 238, 238, 1);
			image {
				width: 36rpx;
				height: 36rpx;
			}
		}
		.buttom {
			width: 100%;
			height: 64rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: rgba(15, 215, 98, 1);
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
			border-bottom: 1rpx solid rgba(238, 238, 238, 1);
			image {
				width: 36rpx;
				height: 36rpx;
			}
		}
		.top1{
			height: 98rpx;
		}
		.buttom1{
			height: 98rpx;
			}			
	}
}
.twoCard {
	background: rgba(255, 255, 255, 1);
	.title {
		width: 140rpx;
		.top1 {
			flex-direction: column;
			background: rgba(255, 255, 255, 1);
			color: #333333;
			text {
				display: inline-block;
				width: 100%;
				text-align: center;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
		.buttom1 {
			flex-direction: column;
			background: rgba(255, 255, 255, 1);
			color: #333333;
			text {
				display: inline-block;
				width: 100%;
				text-align: center;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
	.scrollList {
		.contents {
			.top1 {
				background: rgba(255, 255, 255, 1);
				color: #333333;
			}
			.buttom1{
				background: rgba(255, 255, 255, 1);
				color: #333333;
			}
		}
	}
}
.golf-userTitle {
	padding: 18rpx 24rpx;
	background-color: #fff;
}
.attention {
	display: flex;
	flex-direction: column;
	height: 670rpx;
	width: 100%;
	font-size: 24rpx;
	align-items: center;
	justify-content: center;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: rgba(153, 153, 153, 1);
	line-height: 33rpx;
}
.bgc-green {
	width: 686rpx;
	height: 76rpx;
	background: rgba(0, 193, 92, 1);
	border-radius: 4rpx;
	margin: auto;
	line-height: 76rpx;
	text-align: center;
	font-size: 36rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: rgba(255, 255, 255, 1);
	margin-top: 24rpx;
}
.golf-set {
	font-size: 28rpx;
	font-weight: 400;
	color: #999;
}

.golf-rule {
	display: block;
	font-size: 24rpx;
	color: #999;
	margin-bottom: 30rpx;
}

.golf-scoreContent {
	margin: 32rpx auto;
}

.golf-scoreInfo {
	padding: 0 54rpx;
}

.golf-share,
.golf-scoring {
	width: 48rpx;
	height: 48rpx;
}

.golf-shareText {
	display: block;
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: rgba(51, 51, 51, 1);
	line-height: 40rpx;
}
.showNums {
	position: relative;
	image{
		width: 113rpx;
		height: 103rpx;
	}
}
.nums {
	position: absolute;
	color: white;
	font-size: 18rpx;
	/*height: 24rpx;改前*/
	min-height: 16rpx; /*改后新增的代码*/
	min-width: 40rpx; /*改后新增的代码*/
	line-height: 24rpx;
	right: -60%;
	top: -12rpx;
	text-align: center;
	-webkit-border-radius: 24rpx;
	padding: 2rpx;
	background: rgba(255, 59, 48, 1);
	border-radius: 8px;
	font-weight: 500;
}
.golf-siteInfo .golf-date {
	font-size: 26rpx;
	color: #333;
}

.golf-scoreTable {
	margin-top: 24rpx;
}

.golf-scoringPk {
	padding-left: 24rpx;
}
.golf-btn {
	width: 564rpx;
	height: 98rpx;
	// bottom: 24rpx;
	// position: absolute;
	// left: 24rpx;
	// background:rgba(13,213,97,1);
	border-radius: 6px;

	/* 		display: flex;
			flex-direction: column;
			align-items: center; */
	button {
		background: rgba(13, 213, 97, 1);
	}
}

.golf-btn button {
	border-radius: 6rpx;
	font-size: 36rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: rgba(255, 255, 255, 1);
}
</style>
