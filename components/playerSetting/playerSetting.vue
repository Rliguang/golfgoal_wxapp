<template>
	<view class="golf-playerSetting flex flex-wrap">
		<!-- 创建者 start -->
		<view class="golf-player flex align-center" :class="{'golf-recoverBg': isActive }">
			<view class="golf-playerInfo">
				<view :class="[isActive ? 'golf-recover' : 'golf-del']" @click="bindRecover" v-if="recoverShow"></view>
				<view class="golf-avatar">
					<img :src="creator.avatar">
				</view>
				<text>{{creator.nickName}}</text>
			</view>
		</view>
		<!-- 创建者 end -->

		<!-- 球手信息 start -->
		<golfPlayer v-if="golfPlayer" v-for="(item,index) in golfPlayerList" :key="index" :index="index" :golfPlayerList="golfPlayerList"
		 @deleteIndex="bindDelete"></golfPlayer>
		<!-- 球手信息 end -->

		<!-- 添加球手 start -->
		<view class="golf-addPlayer flex align-center" @click="bindAddPlayer" v-if="hideAddPlayer">
			<view class="golf-add">+</view>
		</view>
		<!-- 添加球手 end -->

		<!-- 弹框 start -->
		<view>
			<uni-popup ref="addBallFriend" type="center" :animation="true">
				<view class="popup-content golf-popup">
					<!-- <view class="golf-userText flex flex-between align-center" @click="bindBallFriend">
						<view>我的球友</view>
						<image src="/static/image/myBall.png"></image>
					</view> -->
					<view class="golf-userText flex flex-between align-center" @click="bindAddManual('center')">
						<view>手动添加</view>
						<image src="/static/image/manual.png"></image>
					</view>


					<button type="primary" @click="jumpInvitedCompetitor" style="width: 50%;font-size: 30rpx;margin-top: 20rpx;">扫码邀请球手</button>
					<button type="primary"  :plain="true" open-type="share" style="width: 50%;font-size: 30rpx; margin-top: 20rpx;">分享邀请球手</button>
					<!-- <view class="golf-userText flex flex-between align-center" @click="bindAddCode">
						<view>邀请好友</view>
						<image src="/static/image/code.png"></image>
					</view> -->
				</view>
			</uni-popup>
			<uni-popup ref="addManual" type="center" :animation="true">
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
		<!-- 弹框 start -->
	</view>
</template>

<script>
	import Vue from 'vue'
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex';

	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import golfPlayer from '@/components/golfPlayer/golfPlayer.vue'

	export default {
		data() {
			return {
				creator: {}, //创建者对象
				golfPlayerList: [], //球手设置数组
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
				aaa: [],
				messageType: 'error', //消息提示框类型
				message: '', //消息提示框内容
				hideAddPlayer: true,
				recoverShow: false, //恢复按钮初始状态
				golfPlayer: false, //球手组件是否显示
				isActive: false //创建者恢复遮罩层
			}
		},
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog,
			golfPlayer
		},
		created() {
			this.getBallPlayer()
			uni.$on('addPlayer1', (data) => {
				this.golfPlayer = true
				if (this.golfPlayerList.length === 0) {
					this.$set(this.golfPlayerList, 0, {
						avatar: data.avatar,
						nickName: data.nickname,
						sex: data.sex
					})
				} else {
					this.golfPlayerList.push({
						avatar: data.avatar,
						nickName: data.nickname,
						sex: data.sex
					});
					
				}
				if (this.golfPlayerList.length > 0) { //添加球手人数大于0 显示创建者恢复按钮
					this.recoverShow = true
				}

				if (this.golfPlayerList.length === 4) { //添加球手人数等于4 创建者置灰 隐藏添加按钮/恢复按钮
					this.isActive = true
					this.hideAddPlayer = this.recoverShow = false
				}
				this.$refs.addBallFriend.close()
			})
		},
		props: {
			golfTournamentId: {
				type: String,
				default: '0'
			}
		},
		mounted() {
			this.$nextTick(function() {
				this.$on('childMethod', function() {})
			})
		},
		beforeDestroy() {
			uni.$off('addPlayer1')
		},
		methods: {
			callMethod() {
				var _this = this;
				//刷新
				this.$api.arrange.getGolfer({
					data: {
						golfTournamentId: this.golfTournamentId
					}
				}).then(res => {
					let golfersList = res.data.data;
					
					let golfPlayerList = [];
					golfersList.forEach(function(value) {
						if (value.isOrganizer !== 1) {
							let list = {
								avatar: value.avatar,
								nickName: value.nickname,
								sex: value.sex
							}
							golfPlayerList.push(list)
						}
					})
					let arr = _this.golfPlayerList.concat(golfPlayerList);
					let array = this.unique(arr)
					this.golfPlayerList = array;
					if (_this.golfPlayerList.length >= 1) {
						_this.golfPlayer = true;
					}
				})
			},
			//去重方法
			unique(arr) {
				for (var i = 0, len = arr.length; i < len; i++) {
					for (var j = i + 1, len = arr.length; j < len; j++) {
						if (arr[i].nickName === arr[j].nickName) {
							arr.splice(j, 1);
							j--; // 每删除一个数j的值就减1
							len--; // j值减小时len也要相应减1（减少循环次数，节省性能）   
						}
					}
				}
				return arr;
			},
			//获取两个数组不同的值
			accessDifferent(array1, array2) {
				var result = [];
				for (var i = 0; i < array2.length; i++) {
					var obj = array2[i];
					var num = obj.USER_ID;
					var flag = false;
					for (var j = 0; j < array1.length; j++) {
						var aj = array1[j];
						var n = aj.USER_ID;
						if (n == num) {
							flag = true;
							break;
						}
					}
					if (!flag) {
						result.push(obj);
					}
				}
				return result
			},
			//获取创建者数据
			getBallPlayer() {
				this.creator = {
					nickName: this.$store.getters.userInfo.nickName,
					avatar: this.$store.getters.userInfo.avatar,
					sex: this.$store.getters.userInfo.sex
				}
			},

			//添加球员弹框
			bindAddPlayer(e) {
				this.$refs.addBallFriend.open() //打开添加球友弹框
			},

			//我的球友列表
			bindBallFriend() {
				uni.navigateTo({
					url: "/pages/ballFriend/ballFriend" //跳转我的球友页面
				})
			},

			//手动添加弹框
			bindAddManual() {
				this.$refs.addBallFriend.close() //关闭添加球友弹框
				this.$refs.addManual.open() //打开手动添加弹框
			},

			//选择性别
			bindSex(e) {
				this.addManualForm.sex = e
			},

			//取消手动添加
			bindManualCancel() {
				this.$refs.addManual.close() //关闭手动添加弹框
			},

			//提交手动添加
			async bindManualConfirm() {
				//检验姓名是否填写
				if (this.addManualForm.nickname === '') {
					this.messageType = 'error'
					this.message = '姓名不能为空'
					this.$refs.popupMessage.open()
					return false
				}

				//检验电话号码格式是否正确
				if (this.addManualForm.mobile !== '' && !this.$utils.isMobilePhone(this.addManualForm.mobile)) {
					this.messageType = 'error'
					this.message = '电话号码格式不正确'
					this.$refs.popupMessage.open()
					return false
				}
				//手动添加球友请求
				let addManualData = {
					'creatorMobile': null, //创建人mobile
					'creatorOpenId': this.$store.getters.openId, //创建人openId true
					'creatorUnionId': null, //创建人unionId
					'mobile': this.addManualForm.mobile || null, //手机号
					'nickname': this.addManualForm.nickname, //观众昵称 true
					'sex': this.addManualForm.sex, //性别, 0-保密,1-男,2-女 true
					'updatorMobile': null, //修改人mobile
					'updatorOpenId': this.$store.getters.openId, //修改人openId true
					'updatorUnionId': null, //修改人unionId
				}

				const {
					data: res
				} = await this.$api.player.addManualRequest({
					data: addManualData
				});

				if (res.code === 0) {
					this.aaa.push({
						id: '123',
						money: '456'
					});
					this.messageType = 'success'
					this.message = '手动添加球友成功'
					this.$refs.popupMessage.open() //打开消息提示框
					this.$refs.addManual.close() //关闭手动添加弹框
					this.addManualForm = {
							nickname: '',
							sex: 1,
							mobile: ''
						},
						this.golfPlayerList.push({
							avatar: res.data.avatar,
							nickName: res.data.nickname,
							sex: res.data.sex
						});

					this.golfPlayer = true
					uni.$emit('addPlayer', res.data)

					if (this.golfPlayerList.length > 0) { //添加球手人数大于0 显示创建者恢复按钮
						this.recoverShow = true
					}

					if (this.golfPlayerList.length === 4) { //添加球手人数等于4 创建者置灰 隐藏添加按钮/恢复按钮
						this.isActive = true
						this.hideAddPlayer = this.recoverShow = false
					}
				}
			},

			//恢复创建者
			bindRecover() {
				this.isActive = !this.isActive
				uni.$emit('changeIsActive', this.isActive)
			},

			//删除球员
			async bindDelete(index) {
				//球局创建者不能删除
				// let aa = {
				// 	golfTournamentGallery: {
				// 		golfTournamentGalleryId: null
				// 	}
				// }

				// const {
				// 	data: res
				// } = await this.$api.player.deletePlayerRequest({
				// 	data: aa
				// })
				uni.$emit('deletePlayer', index)
				this.golfPlayerList.splice(index, 1) //删除选择球手信息
				if (this.golfPlayerList.length < 4) { //添加球手人数小于4 创建者不强制置灰 显示添加按钮
					this.isActive = false
					this.hideAddPlayer = this.recoverShow = true
				}
				if (this.golfPlayerList.length === 0) { //添加球手人数等于0 隐藏创建者恢复状态 不置灰
					this.recoverShow = this.isActive = false
				}
			},

			//扫码添加
			bindAddCode() {

				uni.navigateTo({
					url: '/pages/invite/invite'
				})
			},

			jumpInvitedCompetitor() {
				uni.navigateTo({ //跳入邀请比赛球手
					url: '/pages/invitedCompetitor/invitedCompetitor?golfTournamentId=' + this.golfTournamentId
				});
			}

		},

		computed: {
			// ...mapGetters(['userInfo'])
		},
	}
</script>

<style scoped lang="less">
	/* 	.scroll {
		width: 940rpx;
		overflow: hidden;
		white-space: nowrap;
	} */
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
