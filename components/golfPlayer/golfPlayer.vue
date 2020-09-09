<template>
	<!-- 球员组件 -->
	<view class="golf-player flex align-center" ref="playerMoudle" :data-index="index">
		<view class="golf-playerInfo">
			<!-- 删除按钮 start -->
			<!-- <view class="golf-del" @click="bindDel" v-if="delShow"></view> -->
			<view class="golf-avatar">
				<img :src="golfPlayerList[index].avatar===''?defaultAvatar:golfPlayerList[index].avatar">
			</view>
			<text>{{golfPlayerList[index].nickName}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			index: {
				type: Number,
				required: true
			},
			golfPlayerList: {
				type: Array,
				default: Array
			}
		},
		watch: {
			golfPlayerList () {
			}
		},
		data() {
			return {
				defaultAvatar: '/static/image/default.png',
				recoverShow: false,
				delShow: false
			}
		},
		computed: {},
		methods: {
			//点击删除
			bindDel() {
				this.$emit('deleteIndex', this.index)
			}
		},
		created() {},
		mounted() {
			if (this.golfPlayerList.length > 0) {
				this.delShow = true
			}
		}
	}
</script>
<style scoped>
	.golf-player {
		width: 160rpx;
		height: 272rpx;
		background-color: #fff;
		margin: 5rpx 24rpx 5rpx 0;
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
