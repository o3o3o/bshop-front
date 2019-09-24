<template>
  <view>
    <ws-auth
      :phoneNumberChecked="isChecked"
      :pinSended="isSendPin"
      @sendPin="sendVerifyCode"
      @checkPhoneNumber="verifyCode"
    ></ws-auth>

    <!---
		<view class="uni-btn-v uni- uni-common-mt">
			<button type="primary" class="page-body-button" v-for="(value, key) in providerList" @click="tologin(value)" :key="key">{{ value.name }}</button>
		</view>
        -->
  </view>
</template>

<script>
import wsAuth from "@/components/wsure-authorize/authorize.vue";
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
  onLoad() {},
  computed: {
    ...mapState(["hasLogin"])
  },
  methods: {
    sendVerifyCode(e) {
      console.log(e.phoneNumber);
      //模拟发送请求 1：成功发送，2：发送失败（若发送失败，请自行处理相关提示）
      setTimeout(() => {
        this.isSendPin = 1;
      }, 1000);
    },

    verifyCode(e) {
      console.log(e.phoneNumber + " _ " + e.code);
      //模拟发送请求 1：成功发送，2：发送失败（若发送失败，请自行处理相关提示）
      this.hasLogin = true;
      this.$store.dispatch("getUserOpenId");
      setTimeout(() => {
        this.isChecked = 1;
      }, 1000);
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
