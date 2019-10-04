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
import { getReceivePayQr } from "@/api/user";
var util = require("@/common/util.js");

export default {
  components: { tkiQrcode },
  data() {
    return {
      val: "",
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
    //console.log("onload qr page");
    getReceivePayQr()
      .then(res => {
        this.val = res.qr;
      })
      .catch(err => {
        if (err.message) {
          util.showTip(err.message);
        } else {
          util.showTip(err);
        }
      });
  }
};
</script>

<style></style>
