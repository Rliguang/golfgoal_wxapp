<template>
	<view class="alphabet">
		<view class="alphabet-item" v-for="(item, key) of phones" :key="key" :data-key="key" :class="activeClass == key ? 'active' : ''"
		 @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd" @touchcancel="handleTouchCancel">
			{{key}}
		</view>
		<view class="alphabet-alert" v-if="touchmove">
			{{activeClass}}
		</view>
	</view>
</template>

<script>
	export default {
		name: "phone-alphabet",
		props: {
			phones: Array,
			phoneListIndex: String
		},
		data() {
			return {
				touchStatus: false,
				timer: null,
				activeClass: 'A',
				phonesArr: [],
				touchmove: false
			};
		},
		mounted() {
			let phonesArr = Object.keys(this.phones)
			this.phonesArr = phonesArr
		},
		watch: {
			phoneListIndex(index) {
				this.activeClass = index
			}
		},
		methods: {
			handleTouchStart(e) {
				this.$emit('reset', false)
				let key = e.target.dataset.key
				this.activeClass = key
				this.$emit('change', e.target.dataset.key)
				this.touchStatus = true
			},
			handleTouchMove(e) {
				this.$emit('scrollAnimationOFF', false)
				if (this.touchStatus) {
					this.touchmove = true
					if (this.timer) {
						clearTimeout(this.timer)
					}
					this.timer = setTimeout(() => {
						const touchY = e.touches[0].clientY - 54
						const index = Math.floor(touchY / 20)
						if (index >= 0 && index < this.phonesArr.length) {
							this.activeClass = this.phonesArr[index]
							this.$emit('change', this.phonesArr[index])
						}
					}, 16)
				}
			},
			handleTouchEnd(e) {
				this.$emit('scrollAnimationOFF', true)
				this.touchStatus = false
				this.touchmove = false
			}
		}
	}
</script>

<style>
	.alphabet>.active,
	.hover {
		color: #fff;
		background-color: #0dd561;
		border-radius: 40rpx;
	}

	.alphabet {
		display: flex;
		flex-direction: column;
		text-align: center;
		z-index: 10;
		padding: 10rpx 10rpx 0 10rpx;
	}

	.alphabet-item {
		width: 40rpx;
		font-size: 24rpx;
		height: 40rpx;
		line-height: 40rpx;

	}

	.alphabet-alert {
		position: absolute;
		z-index: 20;
		width: 160rpx;
		height: 160rpx;
		left: 50%;
		top: 50%;
		margin-left: -80rpx;
		margin-top: -80rpx;
		border-radius: 80rpx;
		text-align: center;
		line-height: 160rpx;
		font-size: 70rpx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
