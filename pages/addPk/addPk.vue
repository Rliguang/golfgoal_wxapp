<template>
	<view class="container">
		<view class="golf-sequence">
			<ul>
				<li class="flex flex-between align-center golf-seqLi" v-for="(item,index) in sequenceList" :key="index">
					<view class="flex flex-start align-center">
						<view class="golf-avatar">
							<img src="../../static/image/home_1.png">
						</view>
						<text>{{item.name}}</text>
					</view>
					<view class=" flex flex-between">
						<picker @change="bindNumChange" mode='selector' range-key="name" :value="index" :range="ruleList">
						<text>选择分组</text>
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
						name: '一组',
						value: 0
					},
					{
						name: '二组',
						value: 1
					}
				],
				sequenceList: [{
					num: 1,
					name: '张三',
					tee: '蓝Tee'
				}, {
					num: 2,
					name: '李四',
					tee: '蓝Tee'
				}, {
					num: 3,
					name: '王五',
					tee: '蓝Tee'
				}, {
					num: 4,
					name: '赵六',
					tee: '蓝Tee'
				}],
				teeList: ['黑Tee', '蓝Tee', '白Tee', '红Tee', '金Tee'],
				pickerIndex: '1', //默认选中 蓝Tee下标
			}
		},
		created() {
			this.getNowDate()
		},
		watch: {},
		computed: {},
		methods: {
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
			bindSaveChangesBtn(e) {
			}
		},

		mounted() {}
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
	.golf-text{
		display: block;
		width: 100%;
		height: 33rpx;
		font-size:24rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(153,153,153,1);
		line-height:33rpx;
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
</style>
