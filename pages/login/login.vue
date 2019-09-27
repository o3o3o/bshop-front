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
  signIn,
  signUp,
  verifyCodeApi,
  requestVerificationCode,
  bindThirdAccount,
  updateUserInfoApi
} from "@/api/auth";
var util = require("@/common/util.js");
import { mapState, mapMutations } from "vuex";
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
    ...mapState(["userInfo", "hasLogin", "authCode", "loginProvider"])
  },
  onLoad() {},
  methods: {
    ...mapMutations(["login", "cleanAuthCode"]),

    sendVerifyCode(e) {
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
      verifyCodeApi(e.phoneNumber, e.code)
        .then(() => {
          // isChecked: 0:未验证 1:验证成功 2:验证失败

          signUp(e.phoneNumber)
            .then(res => {
              console.log("signUp with phone: ", res);
              this.login(res.token);

              if (!res.me.avatarUrl || !res.me.nickName) {
                updateUserInfoApi(
                  this.userInfo.nickName,
                  this.userInfo.avatarUrl
                );
              }

              //TODO: sync useinfo from server
              bindThirdAccount(this.authCode, this.loginProvider)
                .then(() => {
                  this.isChecked = 1;
                })
                .catch(err => {
                  if (err.message === "code_been_used") {
                    this.cleanAuthCode();
                  }
                  util.showTip(err.message);
                });
            })
            .catch(err => {
              util.showTip(err);
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
