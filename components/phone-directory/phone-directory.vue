<template>
	<view class="phone-main" :style="{height: winHeight + 'px'}">
		<view class="phone-main-search">
			<navigator :url="'phone-search?phones=' + phonesEscape" hover-class="none">
				<input disabled="false" class="phone-main-input" type="text" placeholder-style="color:white;" placeholder="请输入要搜索的联系人" />
			</navigator>
		</view>
		<view class="phoneDirectory">
			<phone-list :phones="phones" :letter="letter" :scrollAnimationOFF="scrollAnimationOFF" @change="handlePhoneListIndex"
			 @reset="handleReset" @handleClick="handleClick" style="width: 100%;">
			</phone-list>
			<!-- <phone-alphabet :phones="phones" :phoneListIndex="phoneListIndex" @change="handleDatasetKey" @scrollAnimationOFF="handleScrollAnimationOFF"
			 @reset="handleReset">
			</phone-alphabet> -->
		</view>
	</view>
</template>

<script>
	import phoneList from './phone-list.vue'
	import phoneAlphabet from './phone-alphabet.vue'

	export default {
		name: "phone-directory",
		components: {
			phoneList,
			phoneAlphabet
		},
		props: {
			phones: Array,
			default: false
		},
		data() {
			return {
				winHeight: 0,
				letter: 'A',
				scrollAnimationOFF: true,
				phoneListIndex: 'A',
				reset: true
			}
		},
		computed: {
			phonesEscape() {
				return escape(JSON.stringify(this.phones))
			}
		},
		mounted() {
			let windowHeight = uni.getSystemInfoSync().windowHeight

			// #ifndef APP-PLUS
			this.winHeight = windowHeight
			//#endif

			//#ifdef APP-PLUS
			this.winHeight = windowHeight - 56
			//#endif

			if (!this.phones) {
				uni.showToast({
					title: '没有数据',
					icon: "none",
					mask: false,
					duration: 1500
				})
			}
		},
		methods: {
			handleClick(e) {
				this.$emit('paramClick', e)
			},
			handleDatasetKey(val) {
				this.letter = val
			},
			handleScrollAnimationOFF(val) {
				this.scrollAnimationOFF = val
			},
			handlePhoneListIndex(val) {
				if (this.reset) {
					this.phoneListIndex = val
				}
			},
			handleReset(val) {
				if (val) {
					this.letter = ''
				}
				this.reset = val
			}
		}
	}
</script>

<style scoped lang="less">
	.phone-main {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.phoneDirectory {
		display: flex;
		flex-direction: row;
		>view {
			width: 100%;
		}
	}

	.phone-main-search {
		background-color: rgba(13,213,97,1);
		padding: 10rpx 20rpx;
		border-bottom: 1px solid #e5e5e5;
	}

	.phone-main-input {
		font-size: 28rpx;
		background-color: rgba(0,0,0,0.04);
		// border: 1px solid #e5e5e5;
		border-radius: 30px;
		padding: 10rpx 20rpx 10rpx 20rpx;
	}
</style>
