<template>
	<view :class="[styleType === 'text'?'segmented-control--text' : 'segmented-control--button' ]" :style="{ borderColor: styleType === 'text' ? '' : activeColor }"
	 class="segmented-control">
		<view v-for="(item, index) in values" :class="[ styleType === 'text'?'segmented-control__item--text': 'segmented-control__item--button' , index === currentIndex&&styleType === 'button'?'segmented-control__item--button--active': '' , index === 0&&styleType === 'button'?'segmented-control__item--button--first': '',index === values.length - 1&&styleType === 'button'?'segmented-control__item--button--last': '' ]"
		 :key="index" :style="{
        backgroundColor: index === currentIndex && styleType === 'button' ? activeColor : '',borderColor: index === currentIndex&&styleType === 'text'||styleType === 'button'?activeColor:'transparent'
      }"
		 class="segmented-control__item" @click="_onClick(index)">
			<text :style="{color:
          index === currentIndex
            ? styleType === 'text'
              ? activeColor
              : '#fff'
            : styleType === 'text'
              ? '#000'
              : activeColor}"
			 class="segmented-control__text">{{ item }}</text>
		</view>
		<view class="slotView">
			<slot name="refresh"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'tabsControl',
		props: {
			current: { //初始值下标
				type: Number,
				default: 0
			},
			values: {
				type: Array, //选项卡
				default () {
					return []
				}
			},
			activeColor: { //选中颜色
				type: String,
				default: '#0fd762'
			},
			styleType: { //默认选项类型
				type: String,
				default: 'button'
			}
		},
		data() {
			return {
				currentIndex: 0
			}
		},
		watch: {
			current(val) {
				if (val !== this.currentIndex) {
					this.currentIndex = val
				}
			}
		},
		created() {
			this.currentIndex = this.current
		},
		methods: {
			_onClick(index) {
				if (this.currentIndex !== index) {
					this.currentIndex = index
					this.$emit('clickItem', {
						currentIndex: index
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/uni.scss';

	.segmented-control {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		flex-direction: row;
		overflow: hidden;
		width: 240rpx;
		height: 56rpx;
		margin: 24rpx auto 12rpx;
		>.slotView {
			position: absolute;
			right: 24rpx;
			font-size: 22rpx;
		}
	}

	.segmented-control__item {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		box-sizing: border-box;
		/* #endif */
		position: relative;
		flex: 1;
		justify-content: center;
		align-items: center;
	}

	.segmented-control__item--button {
		border-style: solid;
		border-top-width: 1rpx;
		border-bottom-width: 1rpx;
		border-right-width: 1rpx;
		border-left-width: 0;
	}

	.segmented-control__item--button--first {
		border-left-width: 1rpx;
		border-top-left-radius: 4rpx;
		border-bottom-left-radius: 4rpx;
	}

	.segmented-control__item--button--last {
		border-top-right-radius: 4px;
		border-bottom-right-radius: 4px;
	}

	.segmented-control__item--text {
		border-bottom-style: solid;
		border-bottom-width: 3rpx;
	}

	.segmented-control__text {
		font-size: 24rpx;
		text-align: center;
	}
</style>
