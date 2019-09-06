<template>
	<view class="qrimg"><tki-qrcode ref="qrcode" :cid="cid" :val="val" @result="qrcodeR" /></view>
</template>

<script>
// https://github.com/q310550690/uni-app-qrcode
import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';

export default {
	components: { tkiQrcode },
	data() {
		return {
			val: 'hello'
		};
	},
	methods: {
		qrcodeR(e) {
			console.log(e);
		}
	},
	onLoad: {
		// request for receivepay qr content
	}
};
</script>

<style></style>
