<template>
	<view class="container">
		<view class="box" v-for="item in data">
			<image :src="item.avatar" mode=""></image>
			{{item.nickname}}
		</view>
		<view class="box-no" v-if="data.length == 0">
			当前没有围观群众
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: null
			}
		},
		onLoad(option) {
			this.golfTournamentId = option.golfTournamentId * 1
		},
		mounted() {
			this.onlookerList()
		},
		methods: {
			onlookerList() {
				this.$api.api.tournamentGalleries({
					data: {
						golfTournamentId: this.golfTournamentId,
						current: 1,
						size: 1000,
						galleryId: 1
					}
				}).then(res => {
					if (res.data.code == 0) {
						this.data = res.data.data.records;
						console.log(this.data)
					}
				})
			},
			
			
			
		}
	}
</script>

<style scoped lang="less">
	.container{
		.box{
			margin: auto;
			height: 15vw;
			line-height: 15vw;
			background-color: #ffffff;
			font-size: 4vw;
			color: #333333;
			padding-left: 15vw;
			position: relative;
			image{
				width: 8.5vw;
				height: 8.5vw;
				border-radius: 50%;
				position: absolute;
				top: 3.25vw;
				left: 4vw;
			}
		}
		.box-no{
			height: 15vw;
			line-height: 15vw;
			text-align: center;
			font-size: 4vw;
			color: #333333;
		}
	}
</style>
