<template>
	<view class="">
		<view v-if="type==1&&tournamentStatus<1" @click="toAddPk" class="bgc-green">添加PK</view>
		<view v-if="showTabs == 1" class="">
			<view class="" style="padding-bottom: 200rpx;">
				<view class="golf-title flex align-center flex-between">
					本局PK
				</view>
				<view v-for="(item,index) in likeList" :key="index" class="onePiece">
					<view class="tabTitle">
						<text>{{item.pkTitle}}</text>
						<!-- <text class="golf-adjust align-center" v-if="tournamentStatus == 0" @click="toLike(item.golfTournamentPkId,item.golfTournamentGalleryId)">参与点赞</text> -->
					</view>
					<view @click="toDetail(item.golfTournamentPkId)" v-if="item.pkType == 0" class="middle">
						<block v-for="(items,subscript) in item.groupModelList" :key="index" class="">
							<view v-if="subscript == 0" v-for="(info, index) in items.golfTournamentGalleryList" :key="index" class="">
								<image class="headImgBorder" style="border:#007AFF 1px solid;" :src="info.avatar?info.avatar:'../../static/image/mine_0.png'" mode=""></image>
								<text>{{info.nickname}}</text>
							</view>
							<view v-if="subscript == 1" v-for="(info, index) in items.golfTournamentGalleryList" :key="index" class="">
								<image class="headImgBorder" style="border:red 1px solid;" :src="info.avatar?info.avatar:'../../static/image/mine_0.png'" mode=""></image>
								<text>{{info.nickname}}</text>
							</view>
							<image class="PKmodel" v-if="subscript+1<item.groupModelList.length" src="../../static/image/pk.png" mode=""></image>
						</block>
						<uni-icons type="arrowright" :color="moreColor" size="20" />
					</view>
					<view @click="toDetail(item.golfTournamentPkId)" v-if="item.pkType == 1" class="middle catch_bird">
							<view>
								{{item.birdsNum}}.5
							</view>
							<view class="">
								次抓鸟
							</view>
							<uni-icons style="color: #000000; position: absolute; right: 0;" type="arrowright" :color="moreColor" size="20" />
					</view>
				</view>
				<view class="prompt" v-if="likeList.length==0">
					<view class="prompt-text">
						当前球局没有配置PK
					</view>
					本功能仅供球员进行比赛游戏，严谨赌博
				</view>
			</view>
		</view>
		<view v-if="showTabs == 2" class="">
			<view class="attention">
				<text>当前球局没有配置PK</text>
				<text>当前球局没有配置PK 本功能仅供球员进行比赛游戏,严禁赌博</text>
			</view>
		</view>
	</view>
</template>

<script>
	import goodsList from '@/components/goodsList/goodsList.vue';
	export default {
		data() {
			return {
				tabIndex: 0,
				tabsList: [],
				showTabs: 1,
				pkId: '',
				groupList: [],
				likeList: [],
				flag: 0,
				text: '',
				lastX: 0,
				lastY: 0,
			};
		},
		components: {
			goodsList
		},
		computed: {
			nums: function() {
				let num = 0
				this.groupList.map(res => {
					num = res.golfTournamentGalleryList.length + num
				})
				return num
			}
		},
		props: {
			golfTournamentId: {
				type: Number,
				default: 0
			},
			type: {
				type: Number,
				default: 0
			},
			tournamentStatus: {
				type: Number,
				default: 0
			}
		},
		created() {
			
		},
		mounted() {
		
		},
		watch: {
			pkId() {
				if (this.pkId) {
					this.getPkInfo();
				}
				this.getLikeList()
			}
		},
		methods: {
			toDetail(id) {
				uni.navigateTo({
					url: '/pages/addPk/pkDetail?id=' + id
				});
			},
			toLike(id, ids) {
				//用户已经授权过了
				uni.navigateTo({
					url: '/pages/addPk/addLike?id=' + id + "&&ids=" + ids
				});
			},
			deletePk() {
				uni.showModal({
					title: '提示',
					content: '确认删除这场PK？',
					success: (res) => {
						if (res.confirm) {
							this.$api.score.deletePk({
								data: {
									pkId: this.pkId
								}
							}).then(info => {
								if (info.data.code == 0) {
									this.getPkList()
								}
							})
						} else if (res.cancel) {
						}
					}
				});
			},
			handletouchmove: function(event) {
				if (this.flag !== 0) {
					return;
				}
				let currentX = event.touches[0].pageX;
				let currentY = event.touches[0].pageY;
				let tx = currentX - this.lastX;
				let ty = currentY - this.lastY;
				let text = '';
				this.mindex = -1;
				//左右方向滑动
				if (Math.abs(tx) > Math.abs(ty)) {
					if (tx < 0) {
						text = '向左滑动';
						this.flag = 1;
						if (this.tabIndex < this.tabsList.length - 1) {

							this.tabIndex = this.tabIndex + 1
							this.pkId = this.tabsList[this.tabIndex].golfTournamentPkId
						}
						//  this.getList();  //调用列表的方法
					} else if (tx > 0) {
						text = '向右滑动';
						this.flag = 2;
						if (this.tabIndex > 0) {

							this.tabIndex = this.tabIndex - 1
							this.pkId = this.tabsList[this.tabIndex].golfTournamentPkId
						}
					}
				}
				//上下方向滑动
				else {
					if (ty < 0) {
						text = '向上滑动';
						this.flag = 3;
						//  this.getList();  //调用列表的方法
					} else if (ty > 0) {
						text = '向下滑动';
						this.flag = 4;
					}
				}

				//将当前坐标进行保存以进行下一次计算
				this.lastX = currentX;
				this.lastY = currentY;
				this.text = text;
			},
			handletouchstart: function(event) {
				this.lastX = event.touches[0].pageX;
				this.lastY = event.touches[0].pageY;
			},
			handletouchend: function(event) {
				this.flag = 0;
				this.text = '没有滑动';
			},

			changeTab(index, id) {
				this.tabIndex = index;
				this.pkId = id
			},
			toAddPk() {
				uni.navigateTo({
					url: '/pages/addPk/addGolfPk?id=' + this.golfTournamentId
				});
			},
			getLikeList() {
				this.$api.score
					.spgetPkList({
						data: {
							golfTournamentId: this.golfTournamentId,
							golfGalleryId: uni.getStorageSync('golfGalleryId'),
						}
					})
					.then(res => {
						this.likeList = res.data.data.pkLikeModelList
					});
			},
			getPkInfo() {
				if (this.pkId) {
					if (this.pkId) {
						this.$api.score
							.getPkInfo({
								data: {
									pkId: this.pkId
								}
							})
							.then(res => {
								this.groupList = res.data.data.groupList;
							});
					}
				}
			},
			getPkList() {
				this.$api.score
					.getPkList({
						data: {
							golfTournamentId: this.golfTournamentId
						}
					})
					.then(res => {
						this.showTabs = res.data.data.total == 0 ? 2 : 1;
						this.tabsList = res.data.data.records;
						if (res.data.data.total != 0) {
							this.pkId = res.data.data.records[0].golfTournamentPkId;
						}
					});
			}
		}
	};
</script>
<style lang="less" scoped>
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
	}
	
	.golf-title {
		height: 40rpx;
		margin: 30rpx 0;
		margin-right: 24rpx;
	}
	
	.totals {
		display: flex;
		width: 100%;
		font-size: 36rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: rgba(51, 51, 51, 1);
		height: 100%;
		align-items: center;
	
		.onePiece {
			flex: 1;
			height: 100%;
			align-items: center;
			justify-content: center;
		}
	
		// .threePiece{
		// 	flex: 1;
		// 	align-items: center;
		// 	height: 100%;
		// 	background:rgba(244,244,244,1);
		// 	justify-content: center;
		// }
	}
	
	.content {
		width: 702rpx;
		height: 368rpx;
		background: rgba(255, 255, 255, 1);
		margin: auto;
		display: flex;
	
		.oneLeft {
			height: 100%;
			border-left: 1rpx solid rgba(238, 238, 238, 1);
			border-right: 1rpx solid rgba(238, 238, 238, 1);
			width: 96rpx;
	
			.one {
				height: 172rpx;
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-bottom: 1rpx solid rgba(238, 238, 238, 1);
	
				image {
					width: 32rpx;
					height: 32rpx;
					margin-bottom: 6rpx;
				}
	
				text {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(51, 51, 51, 1);
				}
			}
	
			.two,
			.three {
				width: 100%;
				height: 97rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
				border-bottom: 1rpx solid rgba(238, 238, 238, 1);
			}
		}
	
		.twoLeft {
			height: 100%;
			border-right: 1rpx solid rgba(238, 238, 238, 1);
			display: flex;
			flex-direction: column;
	
			image {
				width: 84rpx;
				height: 84rpx;
				margin-bottom: 12rpx;
			}
	
			.hedaLine {
				display: flex;
				height: 172rpx;
	
				view {
					display: flex;
					width: 100%;
					height: 100%;
					flex-direction: column;
					align-items: center;
					justify-content: center;
				}
			}
	
			.nums {
				display: flex;
				width: 100%;
				height: 97rpx;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 36rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: rgba(51, 51, 51, 1);
			}
		}
	}
	
	.tabList {
		width: 50%;
		height: 62rpx;
		display: flex;
		justify-content: space-between;
		margin: auto;
		align-items: center;
	
		text {
			display: block;
			width: 60rpx;
			height: 6rpx;
			background: rgba(238, 238, 238, 1);
			border-radius: 3rpx;
		}
	}
	
	.showgreen {
		width: 60rpx;
		height: 6rpx;
		background: rgba(0, 193, 92, 1) !important;
		border-radius: 3rpx;
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
	
	.footButton {
		display: flex;
	
		.today {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			flex: 1;
	
			text {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(51, 51, 51, 1);
			}
	
			image {
				width: 44rpx;
				height: 44rpx;
				margin-bottom: 8rpx;
			}
		}
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
	
	.golf-text {
		display: block;
		width: 100%;
		height: 33rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		line-height: 33rpx;
		text-align: center;
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
	.wrapper {
		overflow: hidden;
	}

	.PKmodel {
		width: 42rpx;
		height: 26rpx;
	}

	.getAuth {
		width: 100%;
		height: 100vh;
		position: absolute;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);

		>button {
			position: absolute;
			bottom: 0;
			width: 100%;
		}
	}

	.onLine {
		display: flex;

		.onePieces {
			height: 98rpx;
			display: flex;

			.row {
				width: 54rpx;
				height: 100%;
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

	view {
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
			text-align: left;
			image:nth-child(1) {
				width: 42rpx;
				height: 23rpx;
			}

			text:nth-child(1) {
				font-size: 24rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: rgba(51, 51, 51, 1);
			}

			text {
				font-size: 22rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
			}
		}

		.middle {
			height: 122rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 24rpx;
			// view{
			// 	display: flex;
			// 	flex-direction: column;
			// 	align-items: center;
			// 	justify-content: center;
			// }


			view {
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				text {
					display: inline-block;
					width: 88rpx;
					text-align: center;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}

			.last {
				width: 25%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				padding-right: 12rpx;
				border-bottom: 1rpx solid rgba(238, 238, 238, 1);
			}

			image:nth-child(1) {
				width: 40rpx;
				height: 40rpx;
				
			}

			image:nth-child(2) {
				width: 36rpx;
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
		;
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

			view {
				view {
					justify-content: space-around;
				}
			}

			.contents {
				display: inline-flex;
				width: 54rpx;
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
					height: 50%;
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

			.top1 {
				height: 98rpx;
			}

			.buttom1 {
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

				.buttom1 {
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
	}

	.nums {
		position: absolute;
		color: white;
		font-size: 18rpx;
		/*height: 24rpx;改前*/
		min-height: 16rpx;
		/*改后新增的代码*/
		min-width: 40rpx;
		/*改后新增的代码*/
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
	.prompt {
		padding-top: 300rpx;
		text-align: center;
		font-size: 24rpx;
	}
	.catch_bird{
		font-size: 4.8vw;
		color: #999999;
		height: 6.4vw;
			position: relative;
			>view:nth-child(1){
				font-size: 8vw;
				color: #333333;
				font-weight: 600;
				right: 48vw;
				text-align: right;
			}
			>view{
				width: 15vw;
				position: absolute;
				right: 31vw;
			}
			
	}
</style>
