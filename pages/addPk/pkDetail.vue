<template>
	<view class="">
		<view class="">
			<view class="up">
				{{pkTitle}}
			</view>
			<view class="title">
				<view v-for="(item,index) in likeList" :key="index" class="">
					<view v-for="(item1,index1) in item.groupGolferList" :key="index1" class="">
						<image class="headImgBorder" :src="item1.avatar?item1.avatar:'../../static/image/mine_0.png'" mode=""></image>
						<text>{{item1.nickname}}</text>
					</view>
				</view>
				<image class="pkImg" src='../../static/image/pkimg.png'></image>
			</view>
			<view class="contents">
				<view class="left">
					<view v-for="(item,index) in likeList[0].galleryLikeList" class="">
						<text>{{index+1}}</text>
						<view class="text">
							<image class="headImg headImgBorder" :src="item.galleryAvatar?item.galleryAvatar:'../../static/image/mine_0.png'"
							 mode=""></image>
							<text>{{item.galleryNickname}}</text>
						</view>
						<view class="top">
							<text>{{item.likeNumber}}</text>
							<image class="likeImg" src="../../static/image/goods.png" mode=""></image>
						</view>
						<view class="bottom">
							<text>{{item.loveNumber}}</text>
							<image class="likeImg" src="../../static/image/loveX.png" mode=""></image>
						</view>
					</view>
				</view>
				<view class="left right">
					<view v-for="(item,index) in likeList[1].galleryLikeList" class="">
						<text style="color: #FF3C3C;">{{index+1}}</text>
						<view class="text">
							<image class="headImg headImgBorder" :src="item.galleryAvatar?item.galleryAvatar:'../../static/image/mine_0.png'"
							 mode=""></image>
							<text>{{item.galleryNickname}}</text>
						</view>
						<view class="top">
							<text>{{item.likeNumber}}</text>
							<image class="likeImg" src="../../static/image/goods.png" mode=""></image>
						</view>
						<view class="bottom">
							<text>{{item.loveNumber}}</text>
							<image class="likeImg" src="../../static/image/loveX.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
			<view class="upButton">
				<button type="default" @click="giveThumbUp(1)">
					<image src="../../static/image/give.png" mode=""></image>
					给蓝队点赞
				</button>
				<button type="default" @click="giveThumbUp(2)">
					<image src="../../static/image/give.png" mode=""></image>
					给红队点赞
				</button>
			</view>
		</view>
		<view class="popupWindow" v-show="popupWindow">
			<view class="name">
				{{name}}
			</view>
			<view class="box">
				<view class="">
					<image @click="increasePraise(false)" src="../../static/image/reduce.png" mode=""></image>
					<view>{{praise}}</view>
					<image @click="increasePraise(true)" src="../../static/image/praise.png" mode=""></image>
				</view>
				<view class="">
					<image @click="increaseLove(false)" src="../../static/image/reduce.png" mode=""></image>
					<view>{{love}}</view>
					<image @click="increaseLove(true)" src="../../static/image/love.png" mode=""></image>
				</view>
			</view>
			<view class="button">
				<view class="" @click="upToCancel">
					取消
				</view>
				<view class="" @click="likeGroup">
					提交
				</view>
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
				popupWindow: false, //弹窗控制参数
				praise: 0, //点赞数
				love: 0, //爱心数
				name: "",
				groupNo: 0, //当前给哪个队添加  groupNo 1 为蓝 2为红
				pkTitle: "" //PK标题
			};
		},
		components: {
			goodsList
		},
		computed: {

		},
		props: {

		},
		onLoad(option) {
			this.pkId = option.id
			this.getLikeList()
		},
		created() {},
		watch: {

		},
		methods: {
			//点赞事件
			giveThumbUp(i) {
				this.popupWindow = true;
				this.groupNo = i;
				if (i == 1) {
					//给蓝队点赞
					this.name = "给蓝队点赞"
				} else if (i == 2) {
					//给红队点赞
					this.name = "给红队点赞"
				}
			},
			//点赞
			increasePraise(is) {
				if (is) {
					//增加
					this.praise++
				} else {
					//减少
					if (this.praise != 0) {
						this.praise--
					}
				}
			},
			//爱心
			increaseLove(is) {
				if (is) {
					//增加
					this.love++
				} else {
					//减少
					if (this.love != 0) {
						this.love--
					}
				}
			},
			//点赞弹窗取消按钮
			upToCancel() {
				this.popupWindow = false;
				this.praise = 0; //点赞数
				this.love = 0; //爱心数
				this.groupNo = 0;
			},
			//PK添加点赞
			likeGroup() {
				let _this = this;
				uni.showModal({
					title: '提示',
					content: '提交后点赞将新增点赞 数量 '+this.praise+' 个,爱心 数量 '+this.love+' 个,提交后将不能修改，是否确认提交',
					success: function(res) {
						if (res.confirm) {
							_this.$api.api.likeGroup({
									data: {
										galleryId: uni.getStorageSync('golfGalleryId'),
										pkId: _this.pkId,
										groupNo: _this.groupNo,
										likeNumber: _this.praise,
										loveNumber: _this.love
									}
								})
								.then(res => {
									if (res.data.code == 0) {
										_this.getLikeList();
										_this.upToCancel();
									} else {
										uni.showToast({
											title: res.data.detailMessage,
											duration: 2000,
											icon: "none"
										});
									}

								});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});

			},
			getLikeList() {
				this.$api.score
					.getLikeList({
						data: {
							pkId: this.pkId
						}
					})
					.then(res => {
						this.pkTitle = res.data.data.pkTitle
						this.likeList = res.data.data.groupLikeList
					});
			},
		}
	};
</script>

<style scoped lang="scss">
	.up {
		width: 702rpx;
		margin: 33rpx auto;
		font-size: 28rpx;
	}

	.title {
		width: 702rpx;
		height: 118rpx;
		border-radius: 4px;
		display: flex;
		justify-content: space-between;
		margin: auto;
		margin-top: 33rpx;
		margin-bottom: 24rpx;
		position: relative;

		.pkImg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			z-index: -999;
			height: 100%;
		}

		// background-image: url(../../static/image/pkimg.png);
		view {
			display: flex;
			width: 45%;
			justify-content: space-evenly;

			view {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				image {
					width: 36rpx;
					height: 36rpx;
				}

				text {
					font-size: 20rpx;
					color: rgba(255, 255, 255, 1);
					display: inline-block;
					width: 88rpx;
					text-align: center;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
	}

	.contents {
		width: 702rpx;
		height: 650rpx;
		display: flex;
		justify-content: space-between;
		margin: auto;

		.left {
			width: 50%;
			overflow-x: hidden;
			overflow-y: scroll;
			background-color: #D0E0FF;
			display: flex;
			flex-direction: column;

			>view {
				position: relative;
			}

			.text {
				position: absolute;
				left: 40rpx;
			}

			.top {
				position: absolute;
				top: -20rpx;
				right: 20rpx;
			}

			.bottom {
				position: absolute;
				top: 20rpx;
				right: 20rpx;
			}

			view {

				height: 98rpx;
				padding: 16rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				>text {
					font-size: 36rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: rgba(60, 126, 255, 1);
					line-height: 50rpx;
				}

				view {
					display: flex;
					align-items: center;

					.headImg {
						width: 34rpx;
						height: 34rpx;
					}

					.likeImg {
						width: 22rpx;
						height: 22rpx;
						margin-left: 17rpx;
					}

					text {
						display: block;
						overflow: hidden;
						/*溢出隐藏*/
						text-overflow: ellipsis;
						/*以省略号...显示*/
						white-space: nowrap;
						/*强制不换行*/
						font-size: 20rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: rgba(51, 51, 51, 1);
					}
				}
			}
		}

		.left::-webkit-scrollbar {
			display: none;
		}

		.right {
			width: 50%;
			background-color: #FFD5D5;
			overflow-x: hidden;
			overflow-y: scroll;

			>text {
				font-size: 36rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: rgba(60, 126, 255, 1);
				line-height: 50rpx;
			}
		}

		.right::-webkit-scrollbar {
			display: none;
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

	.upButton {
		height: 80rpx;
		width: 100%;
		position: fixed;
		bottom: 200rpx;
		display: flex;

		button {
			width: 300rpx;
			height: 80rpx;
			line-height: 80rpx;
			margin: 38rpx;
			font-size: 28rpx;
			color: #ffffff;
			text-align: center;

			image {
				width: 26rpx;
				height: 26rpx;
				margin-right: 10rpx;
			}
		}

		button:nth-child(1) {
			background-color: #3C7EFF;
		}

		button:nth-child(2) {
			background-color: #FF3C3C;
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

	.popupWindow {
		width: 100%;
		height: 520rpx;
		position: fixed;
		bottom: 0;
		z-index: 999;
		background-color: #ffffff;

		.name {
			font-size: 36rpx;
			line-height: 100rpx;
			height: 100rpx;
			border-bottom: 2rpx solid #E5E5E5;
			text-align: center;
			font-weight: 600;
		}

		.box {
			height: 260rpx;

			>view {
				width: 400rpx;
				height: 60rpx;
				margin: 60rpx auto;
				display: flex;

				>view {
					width: 280rpx;
					height: 60rpx;
					text-align: center;
					color: #000000;
					font-size: 60rpx;
				}

				>image {
					height: 60rpx;
					width: 60rpx;
				}
			}
		}

		.button {
			display: flex;
			height: 100rpx;
			line-height: 100rpx;

			view {
				width: 50%;
				height: 100%;
				text-align: center;
				font-size: 32rpx;
				color: #ffffff;
				background-color: #cccccc;
			}

			view:nth-child(2) {
				background-color: #0FD762;
			}
		}
	}
</style>
