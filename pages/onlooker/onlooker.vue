<template>
	<view class="wrapper">
		<view class="golf-scoreContent text-center">
			<text v-if="golfTournament.tournamentRule == 0" class="golf-rule">比赛规则:一般规则</text>
			<text v-if="golfTournament.tournamentRule == 1" class="golf-rule">比赛规则:大流氓</text>
			<text v-if="golfTournament.tournamentRule == 2" class="golf-rule">比赛规则:小流氓</text>
			<view class="flex flex-between align-center golf-scoreInfo">
				<view style="width: 72rpx" @click="refresh">
					<image src="../../static/image/refresh.png" mode="" style="width: 22rpx;height: 22rpx;"></image>
					<text style="color: rgba(87,137,254,1); font-size:20rpx;line-height: ;">刷新</text>
				</view>
				<view class="golf-siteInfo">
					<view>{{golfCourse.courseName}}</view>
					<view class="golf-date">周{{"日一二三四五六".charAt(new Date(golfData.teeTime.split(' ')[0]).getDay())}}
						{{golfData.teeTime}}</view>
				</view>
				<view class="showNums">
					<text class="golf-shareText">围观</text>
					<text class="nums">{{cardList.gallerNumber}}</text>
				</view>
			</view>
		</view>
		<view class="">
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
									<view v-if="item4.holeNo>0">
										<view class="bird" v-if="item4.handicap==0&&item4.hit==0">
											-
										</view>
										<view class="bird" v-if="item4.handicap==0&&item4.hit!==0">
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
									</view>
									<!-- <text>{{item4.handicap}}</text> -->
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="">
			<view class="golf-title flex align-center flex-between">
				本局PK
			</view>
			<view v-for="(item,index) in likeList" :key="index" class="onePiece">
				<view class="tabTitle">
					<text>{{item.pkTitle}}</text>
					<!-- <text class="golf-adjust align-center" v-if="tournamentStatus == 0" @click="toLike(item.golfTournamentPkId,item.golfTournamentGalleryId)">参与点赞</text> -->
				</view>
				<view @click="toDetail(item.golfTournamentPkId)" class="middle">
					<block v-for="(items,index) in item.groupModelList" :key="index" class="">
						<view v-for="(info, index) in items.golfTournamentGalleryList" :key="index" class="">
							<image class="headImgBorder" :src="info.avatar?info.avatar:'../../static/image/mine_0.png'" mode=""></image>
							<text>{{info.nickname}}</text>
						</view>
						<image id="PKmodel" v-if="index+1<item.groupModelList.length" src="../../static/image/pk.png" mode=""></image>
					</block>
					<uni-icons type="arrowright" :color="moreColor" size="20" />
				</view>
			</view>
			<view v-if="likeList.length == 0" class="empty-pages">
				暂无PK，等待发起人添加PK
			</view>
		</view>
		<view class="getAuth" v-if="authBool">
			<button type="primary" open-type="getUserInfo" @getuserinfo='getuserinfo' @click="getUser">点击授权</button>
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
				authBool: true,
				likeList: [],
				scoreHole: [],
				cardList: {},
				items: ['计分卡', 'PK'],
				current: 0,
				title: [{
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
				tournamentStatus: "", //当前比赛状态码
				golfCourse: "",
				golfTournament: "",
				
			};
		},
		watch: {},
		computed: {},
		onLoad(option) {
			this.golfTournamentId = option.golfTournamentId;
			let that = this
			uni.getSetting({
				success(res) {
					if (!res.authSetting['scope.userInfo']) {
						//这里调用授权
						that.authBool = true
						that.getTournamentGallery();
					} else {
						that.bindGall()
						that.authBool = false
						that.getTournamentGallery();
					}
				}
			}) 
		},
		onShow() {

			this.scordCard();
			this.spgetPkList();
		},
		methods: {
			refresh () {
				this.scordCard();
				this.spgetPkList();
			},
			getUser () {
				new Promise(resolve => {
					uni.getProvider({ //获取设备权限信息
						service: 'oauth',
						success: res => {
							resolve(res);
						}
					})
				}).then(res => {
					
					uni.showLoading({
						title: '正在加载中'
					})
					return new Promise(resolve => {
						uni.login({ //登录加载获取code
							provider: `${res.provider[res.provider.length-1]}`,
							success: res => {
								resolve(res);
							}
						});
					}).then(loginCode => {
						uni.hideLoading()
						return new Promise(resolve => {
							this.$api.login.openIdRequest({ //获取openid
								data: {
									code: loginCode.code
								}
							}).then(res => {
								resolve(res);
								this.openId = res.data.data.openid
								uni.setStorage({
									key: 'openId',
									data: res.data.data.openid,
								});
								this.$store.commit('openId', res.data.data.openid)
							})
						})
					})
				})
			},
			getuserinfo() {
				new Promise(resolve => {
					uni.getUserInfo({ //获取用户信息
						success: res => {
							resolve({
								nickName: res.userInfo.nickName, //昵称
								avatar: res.userInfo.avatarUrl, //头像
								sex: res.userInfo.gender, //性别 0未填 1 男性 2女性
							});
						}
					})
				}).then(resUserInfo => {
					uni.setStorage({
						key: 'userInfo',
						data: resUserInfo,
					});
					this.$store.commit('userInfo', resUserInfo) //保存至Vuex内存
					return new Promise(async resolve => {
						const {
							data: res
						} = await this.$api.login.loginRequest({
							data: {
								avatar: resUserInfo.avatar,
								creatorOpenId: uni.getStorageSync('openId'),
								nickname: resUserInfo.nickName,
								sex: resUserInfo.sex,
								openId: uni.getStorageSync('openId'),
								updatorOpenId: uni.getStorageSync('openId'),
							},
						})
						if (res.code === 0) {
							uni.setStorage({ //高尔夫球员ID存入本地
								key: 'golfGalleryId',
								data: res.data.golfGalleryId,
							});
							this.authBool = false
								// 这里进行绑定add
								this.bindGall()
						}
					})
				})
			},
			//进入围观 判断是否是球手或者创建者
			getTournamentGallery() {
				let _this = this;
				this.$api.match.getTournamentGallery({
					data: {
						galleryId: uni.getStorageSync('golfGalleryId'),
						golfTournamentId: this.golfTournamentId,
					}
				}).then(res => {
					if(res.data.data.tournamentIdentity == 1){
						//球手 
						
							uni.showModal({
							    title: '提示',
							    content: '您是球手，是否跳转记分页面',
							    success: function (res) {
							        if (res.confirm) {
										//初建项目 创建者进入
										uni.navigateTo({ //跳入记分卡
											url: '/pages/score/score?golfTournamentId=' + _this.golfTournamentId + '&type=' + 2
										});
							        } else if (res.cancel) {
							        }
							    }
							});
					}else if(res.data.data.isOrganizer == 1){
						//创建者
						uni.showModal({
						    title: '提示',
						    content: '您是创建者，是否跳转记分页面',
						    success: function (res) {
						        if (res.confirm) {
									//初建项目 创建者进入
									uni.navigateTo({ //跳入记分卡
										url: '/pages/score/score?golfTournamentId=' + _this.golfTournamentId + '&type=' + 1
									});
						        } else if (res.cancel) {
						        }
						    }
						});
					}
				})
			},
			toDetail(id) {
				uni.navigateTo({
					url: '/pages/addPk/pkDetail?id=' + id
				});
			},
			bindGall() {
				this.$api.match.bindGallerInvite({
					data: {
						tournamentIdentity: 0,
						isOrganizer: 0,
						golfTournamentId: this.golfTournamentId,
						golfGalleryId: uni.getStorageSync('golfGalleryId'),
						tee: 0,
						kickoffOrder: 0,
					}
				}).then(res => {
					if (res.data.code == 0) {
						uni.setStorage({
							key: "golfTournamentGalleryId",
							data: res.data.data.golfTournamentGalleryId
						})
					}
				})
			},
			toLike(id, ids) {
				//用户已经授权过了
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
			},
			group(array, subGroupLength) {
				let index = 0;
				let newArray = [];
				while (index < array.length) {
					newArray.push(array.slice(index, index += subGroupLength));
				}
				return newArray;
			},
			spgetPkList() {
				this.$api.score
					.spgetPkList({
						data: {
							golfTournamentId: this.golfTournamentId
						}
					})
					.then(res => {
						this.tournamentStatus = res.data.data.golfCardModel.golfTournament.tournamentStatus;//当前比赛状态码
						this.golfCourse = res.data.data.golfCardModel.golfCourse
						this.golfTournament = res.data.data.golfCardModel.golfTournament
						this.likeList = res.data.data.pkLikeModelList
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
	.wrapper {
		overflow: hidden;
	}

	#PKmodel {
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
	.bird{
		width: 40rpx;
		height: 40rpx;
		margin: 25rpx auto;
		line-height: 40rpx;
		text-align: center;
	}
	.birda{
		color: red; background: url(../../static/image/x.png); 
		background-size: 100%;
	}
	.birdb{
		color: red; background: url(../../static/image/xx.png); 
		background-size: 100%;
	}
	.birdc{
		color: #007AFF;
	}
	.birdd{
		color: red;
	}
	.empty-pages{
		font-size: 24rpx;
		text-align: center;
		margin-top: 100rpx;
	}
</style>
