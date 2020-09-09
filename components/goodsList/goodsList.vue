<template>
	<view class="">
		<view class="container">
			<block v-for="(items,index) in likeList" :key="index">
		<view v-for="(item,index) in items.groupLikeList"  :key="index" class="oneGoods" >
			<image :src="item.galleryAvatar" mode=""></image>
			<text>{{item. galleryNickname}}</text>
			<view class="">
				<image src="../../static/image/goods.png" mode=""></image>
				<text>* {{item.likeNumber}}</text>
			</view>
			<text>{{item.groupName}}</text>
		</view>
			</block>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		props:{
			likeList:{
				type:Array,
				default:[]
			}
		}
	}
</script>

<style scoped lang="scss">

	.container{
		// width:702rpx;
		height:411rpx;
		margin: auto;
		background:rgba(255,255,255,1);
		.oneGoods{
			height: 25%;
			width: 100%;
			border-bottom: 1px solid rgba(238,238,238,1);
			display: flex;
			justify-content: space-between;
			align-items: center;
			>image{
				width:54rpx;
				height:54rpx;
			}
			>text{
				display: block;
				width: 170rpx;
				overflow: hidden; /*溢出隐藏*/
				text-overflow: ellipsis; /*以省略号...显示*/
				white-space: nowrap; /*强制不换行*/
				font-size:28rpx;
				font-family:PingFangSC-Regular,PingFang SC;
				font-weight:400;
				color:rgba(51,51,51,1);
			}
			>view{
				image{
					width: 22rpx;
					height: 22rpx;
				}
			}
		}
	}
</style>
