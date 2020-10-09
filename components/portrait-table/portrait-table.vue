<template>
	<view class="table">
		<view class="thead">
			<view class="golf-thead">
				<text class="golf-hole">球洞</text>
				<text class="golf-player">球手</text>
			</view>
			<view :style="{textAlign:align,backgroundColor:titleBg}" class="title" v-for="(item, index) in tableData" :key="index">
				<img class="imgs" style="" :src="item.avatar ? item.avatar : '../../static/image/default.png'">
				<text class="name" style="">{{ item.nickname }}</text>
				<text class="tee" style="" :class="[$utils.isColor(item.tee)]">{{teeList[item.tee - 1]}}</text>
			</view>
		</view>
		<view class="tbody_wrap">
			<view class="tbody">
				<view class="col" v-for="(item, index) in scoreHole" :key="index">
					<!-- <text>{{item}}</text> -->
					<view class="row" :style="{textAlign:align}" :class="[item.holeNo == firstHole ? 'firstCol' : 'baseBg', 'tbodyHead']">
						<!-- <text>{{ zItem.holeScoreList[index].handicap || '-' }}</text> -->
						<text :class="item.holeNo > 0 ? 'holeNo' : ''">{{item.holeNo > 0 ? item.holeNo : (item.holeNo === 0 ? 'TOT' : (item.holeNo === -1 ? 'IN' : 'OUT'))}}</text>
						<text>{{item.par}}</text>
					</view>
				</view>
			</view>
			<view class="tbody" v-for="(item, index) in tableData" :key="index">
				<view class="col" v-for="(item1, index1) in item.holeScoreList" :key="index1" @click="setScore(item1)">
					<view class="row" :style="{textAlign:align}" style="position: relative;">
						<view v-if="Number(item1.hit) > 0">
							<view v-if="item1.holeNo>0">
								<view class="bird" v-if="item1.handicap==0">
									{{ item1.handicap}}
								</view>
								<view class="bird birdc" v-if="item1.handicap>0">
									+{{ item1.handicap}}
								</view>
								<view class="bird birda" v-if="item1.handicap == -1">
									{{ item1.handicap}}
								</view>
								<view class="bird birdb" v-if="item1.handicap < -1">
									{{ item1.handicap}}
								</view>
							</view>
							<view v-else >
								<view class="bird" v-if="item1.handicap==0">
									{{ item1.handicap}}
								</view>
								<view class="birdc" v-if="item1.handicap>0">
									+{{ item1.handicap}}
								</view>
								<view class="birdd" v-if="item1.handicap == -1">
									{{ item1.handicap}}
								</view>
								<view class="birdd" v-if="item1.handicap < -1">
									{{ item1.handicap}}
								</view>
								<view style="position: absolute; font-size: 20rpx; color: #000000;top: -25rpx;right: 5rpx;">
									{{item1.hit}}
								</view>
							</view>
						</view>
						<view style="color: #999999;" v-else>
							<view v-if="item1.holeNo<=0">
								{{ item1.teeDistance }}
								<view style="position: absolute; font-size: 20rpx; color: #000000;top: -25rpx;right: 5rpx;">
									{{item1.hit}}
								</view>
							</view>
							<view v-else>
								{{ item1.teeDistance }}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				teeList: ['黑Tee', '金Tee', '蓝Tee', '白Tee', '红Tee']
			};
		},
		props: {
			tableData: {
				type: Array,
				required: true
			},
			scoreHole: {
				type: Array,
				required: true
			},
			align: {
				type: String,
				default: 'center'
			},
			firstHole: {
				type: String,
				default: 'center'
			},
			titleBg: {
				type: String,
				default: '#eee'
			}
		},
		methods: {
			setScore(item) {
				this.$emit('setCore', {
					par: item.par,
					holeNo: item.holeNo
				})
			}
		},
	};
</script>

<style scoped lang="less">
	.table {
		display: flex;
		margin-top: 24rpx;
	}

	.thead {
		border-bottom: 1rpx solid #e5e5e5;
		box-shadow: 5rpx 0 5rpx #eee;
	}

	.golf-thead {
		background-color: #eee;
		min-width: 200rpx;
		height: 16.8vw;
		line-height: 16.8vw;
		font-size: 24rpx;
		color: #666;
		border: 1rpx solid #e5e5e5;
		border-bottom: none;
		border-right: none;
		position: relative;
	}

	.golf-hole {
		display: block;
		position: absolute;
		right: 5rpx;
		top: -20rpx;
	}

	.golf-player {
		display: block;
		position: absolute;
		left: 5rpx;
		bottom: -20rpx;
	}

	.title {
		box-sizing: border-box;
		position: relative;
		padding: 0 20rpx;
		min-width:33.87vw;
		height: 16.8vw;
		line-height: 16.8vw;
		font-size: 24rpx;
		color: #666;
		border: 1rpx solid #e5e5e5;
		border-bottom: none;
		border-right: none;

		.imgs {
			position: absolute;
			top: 25rpx;
			left: 22rpx;
			width: 10.93vw;
			height: 10.93vw;
			border-radius: 50%;
			margin-right: 10rpx;
			vertical-align: middle;
		}

		.name {
			display: inline-block;
			width: 68rpx;
			left: 16.96vw;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			line-height: 100%;
			position: absolute;
			top: 3.87vw;
		}

		.tee {
			position: absolute;
			color: white;
			border-radius: 6rpx;
			width: 80rpx;
			height: 30rpx;
			line-height: 30rpx;
			top: 8.8vw;
			left: 16.96vw;
			color: #ffffff;
			font-size: 20rpx;
		}
	}

	.tbody_wrap {
		overflow-x: auto;
		border-right: 1rpx solid #e5e5e5;
		border-bottom: 1rpx solid #e5e5e5;
	}

	.tbody,
	.col {
		display: flex;
	}

	.tbody,
	.row {
		box-sizing: border-box;
		line-height: 16.8vw;
		font-size: 4.27vw;
		color: #666;
		min-width: 16.8vw;
		height: 16.8vw;
		border: 1rpx solid #e5e5e5;
		border-bottom: none;
		border-right: none;
		font-weight: 600;
		>text{
			margin-top: 2vw;
		}
		>.holeNo {
			width: 6.93vw;
			height: 6.93vw;
			border-radius: 50%;
			line-height: 6.93vw;
			background-color: rgba(153, 153, 153, 1);
			margin: 1.6vw auto 1.8vw;
			color: white;
		}
	}

	.tbodyHead {
		>text {
			display: block;
		}

		line-height: 40rpx;
	}

	.baseBg {
		background-color: #fff;
	}

	.firstCol {
		>.holeNo {
			background-color: rgba(15, 215, 98, 1);
		}

		// background-color: #007aff;
	}

	.bird {
		width: 6.93vw;
		height: 6.93vw;
		margin: 5.2vw auto;
		line-height: 6.93vw;
	}

	.birda {
		color: red;
		background: url(../../static/image/x.png);
		background-size: 100%;
	}

	.birdb {
		color: red;
		background: url(../../static/image/xx.png);
		background-size: 100%;
	}

	.birdc {
		color: #007AFF;
	}

	.birdd {
		color: red;
	}
</style>
