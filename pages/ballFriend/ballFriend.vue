<template>
	<view>
		<phone-directory :phones="phones" @paramClick="paramClick"></phone-directory>
	</view>
</template>

<script>
	import phoneDirectory from '@/components/phone-directory/phone-directory.vue'
	export default {
		name: "ballFriend",
		components: {
			phoneDirectory
		},
		data() {
			return {
				//示例数据
				phones: []
			}
		},
		methods: {
			paramClick(e) {
			}
		},
		mounted () {
			this.$api.ballFriend.getMygolfer({
				data: {
					galleryId: uni.getStorageSync('golfGalleryId'),
					size: 10000
					
				}
			}).then(res=>{
				this.phones = res.data.data.records
			})
			
		}
	}
</script>

<style>

</style>
