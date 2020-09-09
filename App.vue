<script>
	export default {
		onLaunch() {
			// this.$api.login.toeknRequest({ //获取token值
			// 	data: {
			// 		clientId: '23ajqbxews94av3tz9otrtz0',
			// 		clientSecret: '8jqmoew9u9d3hbx0goahjdk44n8p5ehc',
			// 	},
			// 	success: res => {
			// 		uni.setStorage({
			// 			key: 'token',
			// 			data: `Bearer ${res.data.data.access_token}`,
			// 		});
			// 	}
			// })
			
			
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function(res2) {
						uni.showModal({
							title: '更新提示',
							content: '发现新版本，是否重启应用?',
							cancelColor: '#eeeeee',
							confirmColor: '#FF0000',
							success(res2) {
								if (res2.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate();
								}
							}
						});
					});
				}
			});
					
			updateManager.onUpdateFailed(function(res) {
				// 新的版本下载失败
				uni.showModal({
					title: '提示',
					content: '检查到有新版本，但下载失败，请检查网络设置',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			});
		},
		onShow() {},
		onHide() {}
	};
</script>

<style>
	/* 解决头条小程序组件内引入字体不生效的问题 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		src: url('/static/font/uni.ttf');
	}

	/* #endif */
	.red {
		background-color: #FF3B30;
	}
	.black {
		background-color: black;
	}
	.blue {
		background-color: #027AFF;
	}
	.gold {
		background-color: #FFD051;
	}
	.white {
		background-color: white;
		color: black !important;
	}
	.headImgBorder{
		border-radius: 50%;
		margin: 6rpx;
	}
</style>
