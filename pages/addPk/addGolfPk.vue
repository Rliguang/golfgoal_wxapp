<template>
	<view class="container">
		<view class="inputPKname">
			<input type="text" v-model="namePK" placeholder="请输入PK名称" />
		</view>
		<view class="golf-sequence">
			<ul>
				<li class="flex flex-between align-center golf-seqLi" v-for="(item,index) in sequenceList" :key="index">
					<view class="flex flex-start align-center">
						<view class="golf-avatar">
							<img v-if="item.avatar" :src="item.avatar" mode=""></img>
							<img v-else src="../../static/image/default.png">
						</view>
						<text>{{item.nickname}}</text>
					</view>
					<view class=" flex flex-between">
						<picker @change="bindNumChange($event,item.golfTournamentGalleryId)" mode='selector' range-key="name" :value="index"
						 :range="ruleList">
							<text v-if="item.teamNum==0">选择分组</text>
							<text v-else>{{item.teamName}}</text>
							<uni-icons type="forward"></uni-icons>
						</picker>
					</view>
				</li>
			</ul>
		</view>
		<view class="">
		</view>
		<view class="golf-btn">
			<text class="golf-text">点击确定创建,即可对本场PK进行点赞</text>
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
						name: '红队',
						value: 2,
						roleGroup: []
					},
					{
						name: '蓝队',
						value: 1,
						roleGroup: []
					}
				],
				golfTournamentGalleryList: [],
				addinfo: {
					golfTournamentId: '',
					groupList: [

					]
				},
				sequenceList: [],
				pickerIndex: '1', //默认选中 蓝Tee下标
				namePK: ""
			}
		},
		created() {
			this.getNowDate()
		},
		onLoad(option) {
			this.golfTournamentId = option.id
			this.getGolfer()
		},
		watch: {},
		computed: {},
		methods: {
			bindNumChange(val, id) {
				this.sequenceList.map(item => {
					if (item.golfTournamentGalleryId == id) {
						item.teamName = this.ruleList[val.detail.value].name
						item.teamNum = this.ruleList[val.detail.value].value
					}
				})
			},
			getGolfer() {
				this.$api.arrange.getGolfer({
					data: {
						golfTournamentId: this.golfTournamentId
					}
				}).then(res => {
					res.data.data.map(item => {
						item.teamNum = 0
						item.teamName = ''
					})
					// this.ruleList=this.ruleList.slice(0,res.data.data.length)
					this.sequenceList = res.data.data
				})
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
				this.time = e.detail.value;
				this.$emit('gamesTime', `${this.date} ${this.time}`);
			},

			//切换规则
			bindRuleChange(e) {
				this.index = e.detail.value;
			},

			//修改
			bindSaveChangesBtn() {
				if (this.namePK == "") {
					uni.showToast({
						title: 'PK名称不能为空',
						icon: "none",
						duration: 2000
					});
					return
				} else if (this.namePK.length > 60) {
					uni.showToast({
						title: 'PK名称过长',
						icon: "none",
						duration: 2000
					});
					return
				}
				this.addinfo.pkTitle = this.namePK;
				this.addinfo.groupList = []
				this.addinfo.golfTournamentId = this.golfTournamentId
				this.ruleList.map(info => {
					info.roleGroup = []
				})
				this.ruleList.map(item => {
					this.sequenceList.map(items => {
						if (item.value === items.teamNum)
							item.roleGroup.push(items)
					})
				})
				this.ruleList.map(val => {
					let names = []
					if (val.roleGroup.length != 0) {
						val.roleGroup.map(name => {
							names.push(name.nickname)
						})
						this.addinfo.groupList.push({
							golfTournamentGalleryList: val.roleGroup,
							groupName: names.join(),
							groupNo: val.value
						})
					}
				})
				let isOrNo = true
				this.ruleList.map(item => {
					if (item.roleGroup.length == 0) {
						uni.showToast({
							title: "请保证两队至少有一个成员",
							icon: "none"
						})
						isOrNo = false
					}
				})
				if (isOrNo) {
					this.$api.score.addPk({
						data: this.addinfo
					}).then(res => {
						if (res.data.code == 0) {
							uni.navigateBack()
						}
					})
				}
			}
		},

	}
</script>
<style scoped>
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
		background-color: #027aff;
		color: #fff;
		border-radius: 4rpx;
		padding: 6rpx 30rpx;
	}

	.golf-btn {
		width: 100%;
		position: absolute;
		bottom: 0;
		left: 0;
		/* 		display: flex;
		flex-direction: column;
		align-items: center; */
	}


	.golf-btn button {
		border-radius: 0;
	}

	.inputPKname {
		height: 60rpx;
		background-color: #ffffff;
		padding: 0 20rpx;
	}

	.inputPKname>input {
		height: 60rpx;
		line-height: 60rpx;
	}
</style>
