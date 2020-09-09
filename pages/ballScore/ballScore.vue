<template>
	<view class="wrapper">
		<view class="flex flex-between golf-userTitle">
			<view></view>
			<view class="golf-usernum">用户昵称、AAAA-傻梓木-生…</view>
			<view class="golf-set">设置</view>
		</view>

		<view class="golf-scoreContent text-center">
			<tabsControl :current="current" :values="items" @clickItem="onClickItem" style-type="button" active-color="#0fd762"></tabsControl>
			<text class="golf-rule">比赛规则:大流氓 果岭速度:8.5</text>
			<view class="flex flex-between align-center golf-scoreInfo">
				<view>
					<image class="golf-share" src="/static/image/share.png"></image>
					<text class="golf-shareText">围观邀请</text>
				</view>
				<view class="golf-siteInfo">
					<view>四川成都国际场</view>
					<view class="golf-date">周四 2020-07-23 13:42</view>
				</view>
				<view>
					<image class="golf-scoring" src="/static/image/date.png"></image>
					<text class="golf-shareText">计分卡</text>
				</view>
			</view>
			<view class="golf-scoringPk">
				<view v-if="current === 0">
					<!-- <p-table :tableData="tableData" :title="title" align="center"></p-table> -->
				</view>
				<view  v-if="current === 1">
					<ballScoreItem></ballScoreItem>

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import tabsControl from "@/components/tabs/tabs.vue"
	import pTable from '@/components/portrait-table/portrait-table.vue'
	import ballScoreItem from '@/components/ballScoreItem/ballScoreItem.vue'
	export default {
		components: {
			tabsControl,
			pTable,
			ballScoreItem
		},
		props: {},
		data() {
			return {
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
				tableData: [{
					num: 1,
					name: '男',
					age: 18,
				}, {
					num: 2,
					name: '男',
					age: 20,

				}, {
					num: 3,
					name: '男',
					age: 20,

				}, {
					num: 4,
					name: '男',
					age: 20,

				}, {
					num: 5,
					name: '男',
					age: 20,

				}, {
					num: 6,
					sex: '男',
					age: 20,

				}, {
					num: 7,
					name: '男',
					age: 20,

				}, {
					num: 8,
					name: '男',
					age: 20,

				}, {
					num: 9,
					name: '男',
					age: 20,

				}]
			}
		},
		watch: {},
		computed: {},
		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex;
				}
			}
		},
		created() {},
		mounted() {}
	}
</script>
<style lang="less" scoped>

	.golf-userTitle {
		padding: 18rpx 24rpx;
		background-color: #fff;
	}
	.attention{
		display: flex;
		flex-direction: column;
		height: 670rpx;
		width: 100%;
		font-size:24rpx;
		align-items: center;
		justify-content: center;		
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(153,153,153,1);
		line-height:33rpx;
	}
	.bgc-green{
		width:686rpx;
		height:76rpx;
		background:rgba(0,193,92,1);
		border-radius:4rpx;
		margin: auto;
		line-height: 76rpx;
		text-align: center;
		font-size:36rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(255,255,255,1);
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
			width:564rpx;
			height:98rpx;
			// bottom: 24rpx;
			// position: absolute;
			// left: 24rpx;
			// background:rgba(13,213,97,1);
			border-radius:6px;

	/* 		display: flex;
			flex-direction: column;
			align-items: center; */
			button{
				background:rgba(13,213,97,1);
			}
		}
	
	
		.golf-btn button {
			border-radius: 6rpx;
			font-size:36rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(255,255,255,1);
		}
</style>
