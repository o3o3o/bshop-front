<template>
	<view>
		<view class="uni-padding-wrap">
			<view class="uni-flex uni-column">
				<view class="uni-flex-item flex-item-V uni-bg-red" @tap="scanQR">
					<text class="text">扫码付款</text>
				</view>
				<view class="uni-flex-item flex-item-V uni-bg-green" @tap="deposit"><text class="text">充值</text></view>
				<view class="uni-flex-item flex-item-V uni-bg-blue" @tap="withdraw"><text class="text">提现</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '聚赢农产品'
			}
		},
		onLoad() {
			uni.getProvider({
				service: 'oauth',
				success: (result) => {
					this.providerList = result.provider.map((value) => {
						let providerName = '';
						switch (value) {
							case 'weixin':
								providerName = '微信登录'
								break;
							case 'qq':
								providerName = 'QQ登录'
								break;
							case 'sinaweibo':
								providerName = '新浪微博登录'
								break;
							case 'xiaomi':
								providerName = '小米登录'
								break;
							case 'alipay':
								providerName = '支付宝登录'
								break;
							case 'baidu':
								providerName = '百度登录'
								break;
							case 'toutiao':
								providerName = '头条登录'
								break;
						}
						return {
							name: providerName,
							id: value
						}
					});
			
				},
				fail: (error) => {
					console.log('获取登录通道失败', error);
				}
			});
		},
		methods: {

			scanQR(e) {
				console.log(e);
				 
				uni.scanCode({
					//onlyFromCamera: true,
					success: function(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					},
					fail: function(res){
						console.log(res);
					},
				});
			},
			
			deposit(e) {
				uni.requestPayment({
					provider: '',
					orderInfo: '',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
			
			
		}
	}
</script>

<style>
	.flex-item-V {

		width: 100%;
		height: 350rpx;
		line-height: 350rpx;
		justify-content: center;
		align-items: center;
		text-align: center;
		align-content: space-around;
	}

	.text {
		font-size: 50rpx;
	}
</style>
