<template>
	<view class="container">
		<view class="photo">
			<view class="photo-box" v-for="item in data" @click="amplification(item)">
				<image :src="'https://dingqiang-golf.oss-cn-shenzhen.aliyuncs.com/'+item" mode=""></image>
			</view>
		</view>
		<view class="bg" v-if="isimgs" @click="amplificationCancel">
			<image :src="imgs" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: null,
				isimgs: false,
				imgs: "",
			}
		},
		onLoad(options) {
			if (options.golfCourseId) {
				this.golfCourseId = options.golfCourseId
			}
		},
		created() {},
		mounted() {
			this.getOneCourse();
		},
		// 下拉刷新
		onPullDownRefresh() {},
		methods: {
			amplificationCancel(){
				this.isimgs = false;
			},
			amplification(e) {
				this.isimgs = true;
				this.imgs = 'https://dingqiang-golf.oss-cn-shenzhen.aliyuncs.com/'+e;
			},
			//获取球场信息
			async getOneCourse() {
				const {
					data: res
				} = await this.$api.api.getCourseAlbumList({
					data: {
						courseId: this.golfCourseId
					}
				})
				if (res.code === 0) {
					// this.golfCourseList = res.data.records
					this.data = res.data;
					console.log(this.data)
				}
			},
		}
	}
</script>

<style scoped lang="less">
	.container {
		background-color: #f5f5f5;
		margin: 0;
		padding: 0;

		.photo {
			display: flex;
			flex-wrap: wrap;

			.photo-box {
				width: 31vw;
				height: 31vw;
				margin: 1vw;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		.bg{
			width: 100%;
			height: 100%;
			background-color: rgba(0,0,0,0.3);
			position: fixed;
			top: 0;
			image{
				width:100%;
				margin-top: 20%;
			}
		}
	}
</style>
