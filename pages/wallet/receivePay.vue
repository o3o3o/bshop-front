<template>
  <view class="qrimg"
    ><tki-qrcode
      ref="qrcode"
      :val="val"
      :size="size"
      :background="background"
      :foreground="foreground"
      :pdground="pdground"
      :onval="onval"
      :loadMake="loadMake"
      @result="qrcodeR"
  /></view>
</template>

<script>
// https://github.com/q310550690/uni-app-qrcode
import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue";

export default {
  components: { tkiQrcode },
  data() {
    return {
      val: "hello",
      loadMake: true,
      onval: true,
      background: "#000000",
      foreground: "#ffffff",
      pdground: "#ffffff",
      size: 600,
      show: true
    };
  },
  methods: {
    qrcodeR(e) {
      console.log(e);
    }
  },
  onLoad() {
    // request for receivepay qr content
    console.log("onload qr page");
  }
};
</script>

<style></style>
