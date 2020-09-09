<template>
	<view class="wrapper">
		<bar :nav="setNav"></bar>
		<view class="flex flex-between golf-userTitle">
			<view></view>
			<view class="golf-usernum">{{nicknameStr}}</view>
			<view class="golf-set">
				<view class="" v-if="type === 1" @click="gameSetting">
					设置
				</view>
			</view>
		</view>
		<view class="golf-scoreContent text-center">
			<tabsControl :current="current" :values="items" @clickItem="onClickItem" style-type="button" active-color="#0fd762">
			</tabsControl>
			<text class="golf-rule">比赛规则:{{golfData.tournamentRule === 0 ? '一般规则' : (golfData.tournamentRule === 1 ? '大流氓' : '小流氓')}}</text>
			<view class="flex flex-between align-center golf-scoreInfo">
				<!-- <view class="golf-share">
				</view> -->
				<view class="golf-siteInfo" style="text-align: left;">
					<view>{{golfData.courseName}}</view>
					<view class="golf-date">周{{"日一二三四五六".charAt(new Date(golfData.teeTime.split(' ')[0]).getDay())}}
						{{golfData.teeTime}}</view>
				</view>
				<view @click="toScoreDetail" v-if="tournamentStatus > 0">
					<image class="golf-scoring" src="/static/image/date.png"></image>
					<text class="golf-shareText">计分卡</text>
				</view>
			</view>
			<view class="golf-scoringPk">
				<view v-if="current === 0 && tableData.length>0">
					<p-table :tableData="tableData" :firstHole="firstHole" :scoreHole="scoreHole" @setCore="setCore" align="center"></p-table>
				</view>
				<view v-show="current === 1 && tableData.length>1">
					<ballScoreItem :golfTournamentId="golfTournamentId" ref="child" :tournamentStatus="tournamentStatus" :type="type"></ballScoreItem>
				</view>
				<view class="addPlayer" @click="addGolfers" v-if="type === 1 && current === 0 && tableData.length < 4 && tournamentStatus < 1">
					添加球手
				</view>
				<view class="text" v-if="tableData.length<=1 && current === 1">
					<view class="buttom" @click="addPK" v-if="type === 1">
						添加PK
					</view>
					<view class="prompt">
						<view class="prompt-text">
							当前球局没有配置PK
						</view>
						本功能仅供球员进行比赛游戏，严谨赌博
					</view>
				</view>
			</view>
		</view>
		<view class="getAuth" v-if="authBool">
			<button type="primary" open-type="getUserInfo" @getuserinfo='getuserinfo' @click="getUser">点击授权</button>
		</view>

		<view class="playGame">
			<button id="onlookers" v-if="type === 1" class="playGameleft" hover-class='none' :plain='true' open-type="share">
				邀请围观
			</button>
			<button class="playGameright" hover-class='none' @click="startPlay" v-if="type === 1&& tournamentStatus < 1">
				<image src="../../static/image/green.png" mode=""></image>
				开球
			</button>
		</view>
		<!-- 弹框 start -->
		<view>
			<uni-popup ref="addBallFriend" type="center" :animation="true">
				<view class="popup-content golf-popup">
					<view class="golf-userText flex flex-between align-center" @click="bindAddManual('center')">
						<view>手动添加</view>
						<image src="/static/image/manual.png"></image>
					</view>
					<button type="primary" @click="jumpInvitedCompetitor" style="width: 50%;font-size: 30rpx;margin-top: 20rpx;">扫码邀请球手</button>
					<button id="golfers" type="primary" :plain="true" open-type="share" style="width: 50%;font-size: 30rpx; margin-top: 20rpx;">分享邀请球手</button>
				</view>
			</uni-popup>
			<uni-popup ref="addManual" :animation="true" :maskClick="false">
				<view class="popup-content golf-manualpopup">
					<view class="golf-manualMitle text-center">手动添加</view>
					<view class="golf-manualForm">
						<view class="flex flex-start golf-formItem">
							<text>姓名:</text>
							<input class="glof-formInput" placeholder="请输入姓名" v-model="addManualForm.nickname" />
						</view>
						<view class="flex flex-start golf-formItem">
							<text>性别:</text>
							<evan-radio-group class="glof-formInput" v-model="sexData">
								<evan-radio ﻿v-for="item in sexList" :key="item.value" primary-color="#0dd561" :label="item.value" @change="bindSex(item.value)">{{item.label}}</evan-radio>
							</evan-radio-group>
						</view>
						<view class="flex flex-start golf-formItem">
							<text>手机号:</text>
							<input class="glof-formPhoneInput" placeholder="请输入手机号" maxlength="11" v-model="addManualForm.mobile" />
						</view>
						<view class="golf-nabualBtn flex flex-between">
							<button type="default" size="mini" @click="bindManualCancel">取消</button>
							<button type="primary" size="mini" @click="bindManualConfirm">确定</button>
						</view>
					</view>
				</view>
			</uni-popup>
			<!-- 消息提示 start-->
			<uni-popup ref="popupMessage" type="message">
				<uni-popup-message :type="messageType" :message="message" :duration="2000"></uni-popup-message>
			</uni-popup>
			<!-- 提交信息 end-->
		</view>
	</view>
</template>

<script>
	import tabsControl from "@/components/tabs/tabs.vue"
	import pTable from '@/components/portrait-table/portrait-table.vue'
	import ballScoreItem from '@/components/ballScoreItem/ballScoreItem.vue'
	import bar from '../../components/bar/bar.vue'
	export default {
		components: {
			tabsControl,
			pTable,
			ballScoreItem,
			bar
		},
		props: {},
		data() {
			return {
				authBool: true,
				type: 0, // 当前身份
				firstHole: '',
				nicknameStr: '',
				golfTournamentId: '',
				tournamentStatus: 0,
				items: ['计分卡', 'PK'],
				current: 0,
				scoreHole: [],
				golfData: {
					teeTime: '',
					tournamentRule: '',
					courseName: ''
				},
				tableData: [],
				showTabs: 1,
				// 自定义导航栏对象
				setNav: {
					'bg': '#00D458', //背景色
					'color': 'white', //字体颜色
					'isdisPlayNavTitle': false, //是否显示返回按钮，由于导航栏是共用的，把所有的东西封装好，
					// 然后有些页面不需要的东西通过条件控制进行显示与隐藏
					'navTitle': '球局记分卡' //导航标题
				},
				sexData: 1, //性别默认选中
				sexList: [{ //性别 1-男,2-女
						label: '男',
						value: 1
					},
					{
						label: '女',
						value: 2
					}
				],
				addManualForm: { //手动添加表单字段
					nickname: '',
					sex: 1,
					mobile: ''
				},
				messageType: 'error', //消息提示框类型
				message: '', //消息提示框内容
				share: true, //围观分享和球手分享的区分值 true是围观分享 false是球手分享
			}
		},
		watch: {},
		computed: {},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				if (res.target.id == "onlookers") {
					return {
						title: '快来观战吧！',
						path: '/pages/onlooker/onlooker?golfTournamentId=' + this.golfTournamentId
					}
				} else if (res.target.id == "golfers") {
					return {
						title: '邀请你加入球局 周' + "日一二三四五六".charAt(new Date(this.golfData.teeTime.split(' ')[0]).getDay()) + this.golfData.teeTime +
							' 「' + this.golfData.courseName + '」！',
						path: '/pages/index/index?golfTournamentId=' + this.golfTournamentId
					}
				}
			}
		},
		onLoad(option) {
			this.golfTournamentId = option.golfTournamentId * 1
			this.type = Number(option.type) // 1.组织 2.球员
			let that = this
			uni.getSetting({
				success(res) {
					if (!res.authSetting['scope.userInfo']) {
						//这里调用授权
						that.authBool = true
					} else {
						that.authBool = false
						if (that.type === 2) {
							that.bindGall()
						}
					}
				}
			})
		},
		onShow() {
			if (this.golfTournamentId) {
				this.handleClick()
			}
			this.getScoreCard()
		},
		created() {},
		onUnload(e) {
			clearInterval(this.controlTiming);
		},
		mounted() {
			this.getScoreCard();
			this.controlTiming = setInterval((res) => {
				this.getScoreCard();
			}, 5000)
		},
		methods: {
			//围观分享和球手分享的区分值
			sharingMethod(i) {
				this.share = i;
			},
			//提交手动添加
			bindManualConfirm() {
				//检验姓名是否填写
				if (this.addManualForm.nickname === '') {
					uni.showToast({
						title: '姓名不能为空',
						duration: 2000,
						icon: "none"
					});
					return false
				}

				//检验电话号码格式是否正确
				if (this.addManualForm.mobile !== '' && !this.$utils.isMobilePhone(this.addManualForm.mobile)) {
					uni.showToast({
						title: '电话号码格式不正确',
						duration: 2000,
						icon: "none"
					});
					return false
				}
				let golfGalleryId = uni.getStorageSync('golfGalleryId');
				this.$api.api.manualAddPlayer({
					data: {
						creatorOpenId: Number(golfGalleryId),
						nickname: this.addManualForm.nickname,
						sex: this.addManualForm.sex,
						mobile: this.addManualForm.mobile,
						updatorOpenId: Number(golfGalleryId),
						golfTournamentId: this.golfTournamentId,
					}
				}).then(res => {
					if (res.data.code == 0) {
						this.$refs.addManual.close() //关闭手动添加弹框
						this.refresh();
					} else {
						this.$refs.addManual.close() //关闭手动添加弹框
						uni.showToast({
							title: res.data.detailMessage,
							duration: 2000,
							icon: "none"
						});
					}
				})
			},
			//取消手动添加
			bindManualCancel() {
				this.$refs.addManual.close() //关闭手动添加弹框
			},
			//手动添加弹框
			bindAddManual() {
				this.$refs.addBallFriend.close() //关闭添加球友弹框
				this.$refs.addManual.open() //打开手动添加弹框
				this.ResetHandMovebox();
			},
			//重置手动弹框数据事件
			ResetHandMovebox() {
				this.addManualForm = {
					nickname: '',
					sex: 1,
					mobile: ''
				}
			},
			//扫码邀请球手
			jumpInvitedCompetitor() {
				uni.navigateTo({ //跳入邀请比赛球手
					url: '/pages/invitedCompetitor/invitedCompetitor?golfTournamentId=' + this.golfTournamentId
				});
			},
			//添加PK
			addPK() {
				uni.showToast({
					title: '当前球手人数不足，无法添加pk',
					duration: 2000,
					icon: "none"
				});
			},
			//添加球手
			addGolfers() {
				this.$refs.addBallFriend.open() //打开添加球友弹框
			},
			refresh() {
				this.getScoreCard()
				this.handleClick()
			},
			//选择性别
			bindSex(e) {

				this.addManualForm.sex = e
			},
			getUser() {
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
			handleClick() {
				this.$refs.child.getPkInfo();
				this.$refs.child.getLikeList()
			},
			toScoreDetail() {
				uni.navigateTo({
					url: '/pages/addPk/scoreDetail?golfTournamentId=' + this.golfTournamentId
				})
			},
			setCore(msg) {
				if (this.tournamentStatus === 0) {
					uni.showToast({
						title: '当前球局未开始',
						duration: 2000
					});
					return
				} else if (this.tournamentStatus === 9) {
					uni.showToast({
						title: '当前球局已结束',
						duration: 2000
					});
					return
				}
				if (msg.holeNo < 1) {
					return
				}
				uni.navigateTo({
					url: '/pages/setScore/setScore?golfTournamentId=' + this.golfTournamentId + '&holeNo=' + msg.holeNo + '&par=' +
						msg.par
				})
			},
			gameSetting() {
				let _this = this
				uni.showActionSheet({
					itemList: ['修改球局', '结束球局'],
					success: async (res) => {
						if (res.tapIndex === 0) {
							uni.navigateTo({
								url: '/pages/modification/modification?golfTournamentId=' + this.golfTournamentId + '&golfData=' + JSON.stringify(
									this.golfData)
							})
						} else if (res.tapIndex === 1) {
							uni.showModal({
								title: '提示',
								content: '是否结束球局',
								success: function(res) {
									if (res.confirm) {
										_this.$api.score.tournamentEnd({ //获取openid
											data: {
												golfTournamentId: _this.golfTournamentId
											}
										}).then(res => {
											if (res.data.code === 0) {
												uni.showToast({
													title: '结束成功',
													duration: 2000
												});
												uni.switchTab({
													url: '/pages/index/index'
												});
											}
										})
									} else if (res.cancel) {}
								}
							});

						}
					}
				})
			},
			bindGall() {
				this.$api.match.bindGaller({
					data: {
						tournamentIdentity: 1,
						isOrganizer: 0,
						golfTournamentId: this.golfTournamentId,
						golfGalleryId: uni.getStorageSync('golfGalleryId'),
						tee: 3,
						kickoffOrder: 0,
					}
				}).then(res => {
					if (res.data.code == 0) {
						uni.setStorage({
							key: "golfTournamentGalleryId",
							data: res.data.data.golfTournamentGalleryId
						})
						this.getScoreCard()
					}
				})
			},
			async getScoreCard() {
				const {
					data: res
				} = await this.$api.pTable.scoreCard({
					data: {
						golfTournamentId: this.golfTournamentId
					}
				})
				if (res.code === 0) {
					this.tableData = res.data.golferScoreModelList
					this.tournamentStatus = Number(res.data.golfTournament.tournamentStatus)
					this.firstHole = res.data.golfTournament.firstHole
					let arr = []
					if (this.tableData.length >= 1) {
						for (let val of this.tableData[0].holeScoreList) {
							arr.push({
								holeNo: val.holeNo,
								par: val.par
							})
						}
						this.scoreHole = arr
					}

					// 获取昵称组合
					let str = []
					for (let val of this.tableData) {
						str.push(val.nickname)
					}
					this.nicknameStr = str.join(',')
					this.golfData.courseName = res.data.golfCourse.courseName
					this.golfData.teeTime = res.data.golfTournament.teeTime
					this.golfData.tournamentRule = res.data.golfTournament.tournamentRule
					// this.golfListNull = res.data.records
				}
			},
			onClickItem(e) {
				this.handleClick()
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
			startPlay() {
				uni.showModal({
					title: '提示',
					content: '开球后不能再添加pk和点赞。请确认所有球手到场后开球。',
					success: async (res) => {
						if (res.confirm) {
							const {
								data: res
							} = await this.$api.score.startPlay({
								data: {
									golfTournamentId: this.golfTournamentId
								}
							})
							if (res.code === 0) {
								this.tournamentStatus = 1
								uni.showToast({
									title: '开球成功',
									duration: 2000
								});
							}
						} else if (res.cancel) {}
					}
				});
			},
		},
		// onLoad(option) {
		// 	this.golfTournamentId = option.golfTournamentId
		// 	this.type = Number(option.type) // 1.组织 2.球员
		// 	// if(this.golfTournamentId){
		// 	// }
		// 	let that = this
		// 	uni.getSetting({
		// 		success(res) {
		// 			if (!res.authSetting['scope.userInfo']) {
		// 				//这里调用授权
		// 				that.authBool = true
		// 			} else {
		// 				that.authBool = false
		// 				if (that.type === 2) {
		// 					that.bindGall()
		// 				}
		// 			}
		// 		}
		// 	})
		// },

	}
</script>
<style scoped lang="less">
	.wrapper {
		overflow: hidden;
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

	.golf-usernum {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 600rpx;
		text-align: center;
	}

	.playGame {
		position: fixed;
		bottom: 40rpx;
		width: 80%;
		display: flex;
		height: 80rpx;
		margin-left: 10%;
	}

	.playGameleft {
		width: 60%;
		height: 100%;
		color: #ffffff;
		text-align: center;
		background-color: #0BCC5E;
		margin-right: 100rpx;
		border-radius: 40rpx;
		font-size: 36rpx;
		line-height: 80rpx !important;
		border: 0 !important;
	}

	.playGameright {
		width: 20%;
		height: 100%;
		text-align: center;
		position: relative;
		line-height: 140rpx;
		font-size: 24rpx;
	}

	.playGameright>image {
		width: 40rpx;
		height: 40rpx;
		font-size: 0;
		position: absolute;
		top: 10rpx;
		left: 40rpx;
	}

	button::after {
		border: none;
	}

	.golf-userTitle {
		padding: 18rpx 24rpx;
		background-color: #fff;
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
		margin: 0 auto;
	}

	.golf-scoreInfo {
		padding: 0 24rpx;
	}

	.golf-share,
	.golf-scoring {
		width: 48rpx;
		height: 48rpx;
	}

	.golf-shareText {
		display: block;
		font-size: 24rpx;
		color: #999;
		border: none !important;
	}

	.golf-siteInfo .golf-date {
		margin: auto;
		font-size: 26rpx;
		color: #333;
		text-align: left;
	}

	.golf-scoreTable {
		margin-top: 24rpx;
	}

	.golf-scoringPk {
		padding-left: 24rpx;

		.addPlayer {
			margin-top: 20rpx;
			width: 200rpx;
			height: 70rpx;
			border-radius: 4rpx;
			border: solid 2rpx #0fd762;
			color: #0fd762;
			font-size: 28rpx;
			line-height: 70rpx;
		}

		.text {
			.buttom {
				margin-top: 30rpx;
				margin-right: 24rpx;
				height: 80rpx;
				border-radius: 10rpx;
				color: #ffffff;
				font-size: 36rpx;
				line-height: 80rpx;
				text-align: center;
				background-color: #00C15C;
			}

			.prompt {
				padding-top: 300rpx;
				text-align: center;
				font-size: 24rpx;

				.prompt-text {}
			}

		}
	}

	.golf-formItem {
		>text {
			flex: 0 0 150rpx;
		}
	}

	.golf-playerSetting {
		padding-top: 20rpx;
		flex-wrap: nowrap;
		overflow-x: auto;
	}

	.golf-addPlayer {
		width: 160rpx;
		flex: 0 0 160rpx;
		height: 272rpx;
		background-color: #fff;
		margin: 5rpx 5rpx 5rpx 0;
	}

	.golf-add {
		width: 64rpx;
		height: 64rpx;
		line-height: 60rpx;
		background-color: #f1f0ff;
		border-radius: 50%;
		margin: 0 auto;
		text-align: center;
		color: #5570ff;
		font-size: 50rpx;
	}

	.golf-popup {
		width: 560rpx;
		height: 306rpx;
		border-radius: 16rpx;
		background-color: #fff;
		padding-top: 20rpx;
	}

	.golf-userText {
		padding: 24rpx;
		border-bottom: 2rpx solid #eee;
	}

	.golf-popup image {
		width: 46rpx;
		height: 46rpx;
	}

	.golf-manualpopup {
		margin: 200rpx auto;
		width: 560rpx;
		height: 464rpx;
		border-radius: 16rpx;
		background-color: #fff;
		padding: 32rpx 24rpx;
	}

	.golf-manualMitle {
		margin: 0 auto;
	}

	.golf-manualForm {
		margin-top: 32rpx;
	}

	.golf-formItem {
		padding: 25rpx 10rpx;
		border-bottom: 2rpx solid #eee;
	}

	.glof-formInput {
		margin-left: 52rpx;
	}

	.glof-formPhoneInput {
		margin-left: 24rpx;
	}

	evan-radio {
		margin-right: 56rpx;
	}

	.golf-nabualBtn {
		margin-top: 50rpx;
	}

	.golf-player {
		width: 160rpx;
		height: 272rpx;
		flex: 0 0 160rpx;
		background-color: #fff;
		margin: 5rpx 24rpx 5rpx 0;
	}

	.golf-recoverBg {
		background-color: rgba(0, 0, 0, 0.2);
	}

	.golf-playerInfo {
		width: 100%;
		text-align: center;
		position: relative;
	}


	.golf-del {
		position: absolute;
		right: 8rpx;
		top: -74rpx;
		width: 32rpx;
		height: 32rpx;
		background-image: url(../../static/image/del.png);
		background-size: 32rpx 32rpx;
	}

	.golf-recover {
		position: absolute;
		right: 8rpx;
		top: -74rpx;
		width: 32rpx;
		height: 32rpx;
		background-image: url(../../static/image/recover.png);
		background-size: 32rpx 32rpx;
		z-index: 99;
	}

	.golf-avatar img {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		overflow: hidden;
	}

	.golf-player text {
		height: 33rpx;
		line-height: 33rpx;
		font-size: 24rpx;
		color: #333;
		margin: 0 auto;
	}
</style>
