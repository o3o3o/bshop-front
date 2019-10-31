<template>
  <view class="container">
    <view class="tool-section">
      <view
        class="tool-item"
        hover-class="common-hover"
        :hover-stay-time="50"
        @tap="scanQR"
      >
        <text class="yticon icon-scanqr"></text>
        <text>扫码付款</text>
      </view>

      <view
        v-if="isDevelop"
        class="tool-item"
        hover-class="common-hover"
        :hover-stay-time="50"
        @tap="mockScanQR"
      >
        <text class="yticon icon-scanqr"></text>
        <text>mock扫码</text>
      </view>

      <view
        class="tool-item"
        hover-class="common-hover"
        :hover-stay-time="50"
        @tap="navTo('/pages/wallet/transfer/transfer')"
      >
        <text class="yticon icon-deposit"></text>
        <text>充值</text>
      </view>
      <view
        class="tool-item"
        hover-class="common-hover"
        :hover-stay-time="50"
        @tap="navTo('/pages/wallet/withdraw/withdraw')"
      >
        <text class="yticon icon-withdraw"></text>
        <text>提现</text>
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
  computed: {
    isDevelop() {
      return process.env.NODE_ENV === "development";
    }
  },
  onLoad() {
    util.showLoadingMask();

    this.isLogin()
      .catch(err => {
        console.log("网络请求错误", err);
      })
      .finally(res => {
        uni.hideLoading();
      });
  },
  methods: {
    ...mapMutations(["navTo"]),
    ...mapActions(["tryLoginWithProvider"]),

    isLogin() {
      return this.$store.dispatch("tryLoginWithProvider").catch(err => {
        console.log("isLogin error: ", err);
        uni.reLaunch({ url: "/pages/login/login" });
        return;
      });
    },
    mockScanQR() {
      let res =
        "bshop://pay/?vendorId=a9aa9239-8be7-4d32-aff9-b855b898a510&vendorName=Michael%27s+%E5%B0%8F%E5%BA%97";
      let parsed = parse(res);
      console.log(parsed);
      if (parsed.protocol === "bshop:") {
        let query = handelQr(res);
        console.log("qr query: ", query);
        let url = "/pages/wallet/transfer/transfer" + query;
        console.log("url:", url);
        uni.navigateTo({ url: url });
      } else {
        //TODO: show webview?
        util.showTip(res);
      }
    },
    async scanQR(e) {
      console.log(e);

      uni.scanCode({
        //onlyFromCamera: true,
        success: res => {
          console.log("条码类型：" + res.scanType);
          console.log("条码内容：" + res.result);

          let parsed = parse(res.result);

          if (res.scanType === "QR_CODE" && parsed.protocol === "bshop:") {
            let query = handelQr(res.result);
            console.log("qr query: ", query);
            let url = "/pages/wallet/transfer/transfer" + query;
            console.log("url:", url);
            uni.navigateTo({ url: url });
          } else {
            //TODO: show webview?
            util.showTip(res.result);
          }
        },
        fail: err => {
          console.log(err);
          util.showTip("识别二维码失败");
        }
      });
    }
  }
};
</script>

<style lang="scss">
%flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
%section {
  display: flex;
  justify-content: space-around;
  align-content: center;
  background: #fff;
  border-radius: 10upx;
}

.tool-section {
  @extend %section;
  padding: 50upx 0;
  margin-top: 20upx;
  background: #f5f5f5;
  .tool-item {
    @extend %flex-center;
    width: 150upx;
    height: 180upx;
    border-radius: 10upx;
    font-size: $font-sm;
    color: $font-color-dark;
    background-color: #ffffff;
  }
}
.yticon {
  font-size: 48upx;
  margin-bottom: 18upx;
}
</style>
