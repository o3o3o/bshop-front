<script>
import { mapState, mapMutations } from 'vuex';
export default {
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		...mapMutations(['login'])
	},
	onLaunch: function() {
		this.userInfo = uni.getStorageSync('userInfo') || {};
		// if(userInfo.provider){
		// 	//更新登陆状态
		// 	uni.getStorage({
		// 		key: 'userInfo',
		// 		success: (res) => {
		// 			this.login(res.data);
		// 		}
		// 	});
		// }
	},
	onLaunch: function() {
		console.log('App Launch');
		//TODO: checkSession 检查登录状过期情况
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
@import './common/uni.css';
</style>
