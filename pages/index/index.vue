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
import { mapState, mapMutations } from "vuex";
import {
  loginWithProvider,
  verifyCode,
  requestVerificationCode
} from "@/api/auth";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["loginProvider", "hasLogin", "token", "userInfo"])
  },
  onLoad() {
    this.isLogin();
  },
  methods: {
    ...mapMutations(["updateUserInfo", "login"]),

    isLogin() {
      if (this.hasLogin) {
        return;
      }
      loginWithProvider(this.loginProvider)
        .then(data => {
          console.log("loginProvider: ", data);
          this.login(data.token);
          this.updateUserInfo(data.userInfo);
        })
        .catch(err => {
          console.log(err);
          uni.reLaunch({
            url: "/pages/login/login"
          });
        });
    },

    async scanQR(e) {
      console.log(e);

      uni.scanCode({
        //onlyFromCamera: true,
        success: res => {
          console.log("条码类型：" + res.scanType);
          console.log("条码内容：" + res.result);
        },
        fail: err => {
          console.log(err);
        }
      });
    },

    deposit(e) {
      uni.requestPayment({
        provider: "",
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
