<template>
  <view>
    <view class="container">
      <view class="qrimg"
        ><tki-qrcode
          ref="qrcode"
          :val="val"
          :size="size"
          :onval="onval"
          :loadMake="loadMake"
        />
      </view>
    </view>
  </view>
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
      size: 700,
      show: true
    };
  },
  methods: {},
  onLoad() {
    // request for receivepay qr content
    //console.log("onload qr page");
    getReceivePayQr()
      .then(res => {
        this.val = res.qr;
        //console.log(this.val);
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

<style>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.qrimg {
  display: flex;
  justify-content: center;
  padding: 100upx;
}
</style>
