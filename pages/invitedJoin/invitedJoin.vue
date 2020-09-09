<template>
	<view class="container">
		<view class="box" v-if="invited">
			<image src="../../static/image/Invited_join.png" mode=""></image>
			<view class="p">
				{{name}}邀请您加入他的球局
			</view>
			<view class="buttom" @click="confirmJoin">
				确认加入
			</view>
		</view>
		<view class="box" v-else>
			<image src="../../static/image/Invite_and_wait.png" mode=""></image>
			<view class="p">
				加入成功
			</view>
			<view class="p">
				球局正在创建中,创建后可在首页进入积分卡页面
			</view>
			<view class="buttom" @click="returnHome">
				返回首页
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		data() {
			return {
				invited:true,
				name: ""
			}
		},
		onLoad (option) {
			this.id = option.id;
			this.golfGalleryId = option.golfGalleryId;
		},
		mounted() {
			this.obtainNickname();
			
		},
		methods: {
			confirmJoin(){
				this.$api.match.bindGaller({
					data: {
						tee: 3,
						golfTournamentId: this.id,
						golfGalleryId: this.golfGalleryId,
						isOrganizer: 0,
						kickoffOrder: 0,
						tournamentIdentity: 1
					}
				}).then(res => {
				})
				this.invited = false
			},
			returnHome(){
				uni.switchTab({ //跳入球员设置页面
					url: '/pages/index/index'
				});
			},
			obtainNickname(){
				var res = {};
				res = this.$api.invitedCompetitor.tournamentInfo({
					data: {
						golfTournamentId: this.id
					},
				})
				
				
				res.then(data => { 
					this.name = data.data.data.organizerNickname;
				})
			}
			
			
			
		}
	}
</script>

<style scoped lang="less">
	.container{
		.box{
			text-align: center;
			image{
				font-size: 0;
				margin: 128rpx auto;
			}
			.p{
				margin: 70rpx 0;
				font-size: 24rpx;
				color: #999999;
				
			}
			.buttom{
				width: 680rpx;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 36rpx;
				color: #FFFFFF;
				background-color: #00C15C;
			}
		}
	}
</style>
