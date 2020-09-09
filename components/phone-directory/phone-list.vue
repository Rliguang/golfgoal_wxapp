<template>
	<view class="phoneList">
		<scroll-view class="scroll-list" :scroll-top="1" scroll-y="true" :scroll-with-animation="scrollAnimationOFF"
		 :scroll-into-view="scrollViewId" :style="{height:winHeight + 'px'}" @scroll="handleScroll">
			<view class="phone-list">
				<!-- <view class="list-item" v-for="(item, key) in phones" :index="key" :id="key"> -->
					<!-- <view class="list-item-title">{{key}}</view> -->
					<view class="list-item-phone" @click="handleClick" hover-class="commonly-hover" :hover-start-time="20"
					 :hover-stay-time="70" v-for="innerItem in phones" :data-id='innerItem.golfGalleryId' :data-sex='innerItem.sex' :data-avatar='innerItem.avatar' :data-nickname='innerItem.nickname'>
						<image :src="innerItem.avatar ? innerItem.avatar : '/static/image/default.png'" mode="" style="width: 40rpx;height: 40rpx;vertical-align: middle;border-radius: 40rpx;"></image>
						<text style="vertical-align: middle;margin-left: 30rpx;">{{innerItem.nickname}}</text>
					</view>
				<!-- </view> -->
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: "phone-list",
		props: {
			phones: Array,
			letter: String,
			scrollAnimationOFF: Boolean
		},
		watch: {
			phones () {
			}
		},
		data() {
			return {
				winHeight: 0,
				scrollTop: 0,
				letterDetails: [],
				timer: null
			}
		},
		computed: {
			scrollViewId() {
				return this.letter
			}
		},
		mounted() {
			// #ifndef APP-PLUS
			this.winHeight = uni.getSystemInfoSync().windowHeight - 49.50
			//#endif

			//#ifdef APP-PLUS
			this.winHeight = uni.getSystemInfoSync().windowHeight - 100
			//#endif

		},
		methods: {
			handleClick(e) {
				uni.$emit('addPlayer', {golfGalleryId: e.currentTarget.dataset.id})
				uni.$emit('addPlayer1', {sex: e.currentTarget.dataset.sex || 1,avatar: e.currentTarget.dataset.avatar || '/static/image/default.png',nickname: e.currentTarget.dataset.nickname})
				uni.navigateBack({
					delta:1
				})
			},
			handleScroll(e) {
				if (this.letterDetails.length === 0) {
					let view = uni.createSelectorQuery().selectAll('.list-item')
					view.boundingClientRect(data => {
						if (data.length !== 0) {
							let top = data[0].top
							data.forEach((item, index) => {
								item.top = item.top - top
								item.bottom = item.bottom - top
								this.letterDetails.push({
									id: item.id,
									top: item.top,
									bottom: item.bottom
								})
							})
						}
					}).exec()
				}

				const scrollTop = e.detail.scrollTop
				this.letterDetails.some((item, index) => {
					if (scrollTop >= item.top && scrollTop <= item.bottom - 5) {
						this.$emit('change', item.id)
						this.$emit('reset', true)
						return true
					}
				})
			}
		}

	}
</script>

<style>
	.phoneList {
		width: 100%;
	}
	.commonly-hover {
		background-color: #eee;
	}

	.scroll-list {
		flex: 1;
		height: 100vh;
		overflow-y: hidden;
	}

	.phone-list {
		display: flex;
		background-color: #fff;
		flex-direction: column;
		position: relative;
		width: 100%;
	}

	.list-item {
		width: 100%;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		height: 92rpx;
		background-color: #fff;
		height: 100%;

	}

	.list-item>.list-item-phone {
		font-weight: normal;
	}

	.list-item-title {
		background-color: #eee;
	}

	.list-item-title,
	.list-item-phone {
		/* width: 100%; */
		height: 112rpx;
		line-height: 112rpx;
		font-size: 32rpx;
		font-weight: bold;
		margin: 0 20rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #e5e5e5;
	}
</style>
