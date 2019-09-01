<template>
	<view>
		<block v-if="hasLogin === false"><view class="uni-hello-text uni-center">请点击按钮登录</view></block>
		<view class="uni-btn-v uni- uni-common-mt">
			<button type="primary" class="page-body-button" v-for="(value, key) in providerList" @click="tologin(value)" :key="key">{{ value.name }}</button>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			providerList: []
		};
	},
	onLoad() {
		uni.getProvider({
			service: 'oauth',
			success: result => {
				this.providerList = result.provider.map(value => {
					let providerName = '';
					switch (value) {
						case 'weixin':
							providerName = '微信登录';
							break;
						case 'alipay':
							providerName = '支付宝登录';
							break;
					}
					return {
						name: providerName,
						id: value
					};
				});
			},
			fail: error => {
				console.log('获取登录通道失败', error);
			}
		});
	},
	methods: {
		...mapMutations(['login']),
		tologin(provider) {
			uni.login({
				provider: provider.id,
				// #ifdef MP-ALIPAY
				scopes: 'auth_user', //支付宝小程序需设置授权类型
				// #endif
				success: res => {
					console.log('login success:', res);
					// 更新保存在 store 中的登录状态
					this.login(provider.id);
					uni.navigateTo({
						url: "../index/index"
					})
				},
				fail: err => {
					console.log('login fail:', err);
				}
			});
		}
	}
};
</script>

<style>
button {
	background-color: #007aff;
	color: #ffffff;
}
</style>
