<template>
  <view>
    <view class="uni-padding-wrap">
      <view class="uni-flex uni-column">
        <view class="uni-flex-item flex-item-V uni-bg-red" @tap="scanQR"
          ><text class="text">扫码付款</text></view
        >
        <view class="uni-flex-item flex-item-V uni-bg-green" @tap="deposit"
          ><text class="text">充值</text></view
        >
        <view class="uni-flex-item flex-item-V uni-bg-blue" @tap="withdraw"
          ><text class="text">提现</text></view
        >
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import {
  loginWithProvider,
  verifyCode,
  requestVerificationCode
} from "@/api/auth";
import { handelQr } from "@/api/qr";

var parse = require("url-parse");
var util = require("@/common/util.js");

export default {
  data() {
    return {};
  },
  computed: {},
  onLoad() {
    this.isLogin();
  },
  methods: {
    ...mapActions(["tryLoginWithProvider"]),

    isLogin() {
      this.$store.dispatch("tryLoginWithProvider").catch(err => {
        uni.reLaunch({ url: "/pages/login/login" });
      });
    },
    async scanQR(e) {
      console.log(e);

      uni.scanCode({
        //onlyFromCamera: true,
        success: res => {
          console.log("条码类型：" + res.scanType);
          console.log("条码内容：" + res.result);

          let parsed = parse(res.result);

          if (res.scanType === "QR_CODE" && parsed.provider === "bshop") {
            let query = handelQr(res.result);
            console.log("qr query: ", query);
            uni.navigateTo({ url: "/pages/wallet/transfer/transfer?" + query });
          } else {
            //TODO: show webview?
            util.showTip(res.result);
          }
        },
        fail: err => {
          console.log(err);
        }
      });
    },

    deposit(e) {
      uni.navigateTo({ url: "/pages/wallet/deposit/deposit" });
      uni.requestPayment({
        //provider: "",
        orderInfo: "",
        success: res => {},
        fail: () => {},
        complete: () => {}
      });
    }
  }
};
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
