<template>
  <view>
    <ws-auth
      :phoneNumberChecked="isChecked"
      :pinSended="isSendPin"
      @sendPin="sendVerifyCode"
      @checkPhoneNumber="verifyCode"
    ></ws-auth>
  </view>
</template>

<script>
import wsAuth from "@/components/wsure-authorize/authorize.vue";
import {
  signUpBindAccount,
  verifyCodeApi,
  requestVerificationCode,
  updateUserInfoApi
} from "@/api/auth";
var util = require("@/common/util.js");
import { mapState, mapMutations } from "vuex";

//TODO: get phone number
// https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html
export default {
  data() {
    return {
      isChecked: 0,
      isSendPin: 0
    };
  },
  components: {
    wsAuth
  },
  computed: {
    ...mapState(["userInfo", "hasLogin"])
  },
  onLoad() {},
  methods: {
    ...mapMutations(["login", "cleanAuthCode"]),

    sendVerifyCode(e) {
      uni.hideKeyboard();
      console.log(e.phoneNumber);
      requestVerificationCode(e.phoneNumber)
        .then(() => {
          //1：成功发送
          this.isSendPin = 1;
        })
        .catch(err => {
          //2：发送失败（若发送失败，请自行处理相关提示）
          console.error("Error for sendVerifyCode: ", err);
          this.isSendPin = 2;
        });
    },

    verifyCode(e) {
      console.log(e.phoneNumber + " _ " + e.code);
      var that = this;
      verifyCodeApi(e.phoneNumber, e.code)
        .then(() => {
          var userInfo = {
            nickname: that.userInfo.nickName,
            avatarUrl: that.userInfo.avatarUrl
          };
          return signUpBindAccount(e.phoneNumber, userInfo).then(res => {
            console.log("signUp with phone: ", res);
            that.login(res.token);

            // isChecked: 0:未验证 1:验证成功 2:验证失败
            that.isChecked = 1;

            //TODO: go to next page?

            //FIXME: global login state
            /*
            if (!res.me.avatarUrl || !res.me.nickName) {
              updateUserInfoApi(
                that.userInfo.nickName,
                that.userInfo.avatarUrl
              );
            }
            */
          });
        })
        .catch(err => {
          util.showTip(err);
          this.isChecked = 2;
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
