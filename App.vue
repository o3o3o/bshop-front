<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			//TODO: checkSession 检查登录状过期情况
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import './common/uni.css';
</style>
