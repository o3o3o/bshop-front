<template>
  <view class="uni-padding-wrap uni-common-mt">
    <view class="uni-form-item uni-column">
      <view class="title">设置新密码</view>
      <view class="with-fun">
        <input
          class="uni-input"
          type="number"
          name="input"
          maxlength="6"
          focus
          placeholder="请输入6位数字密码"
          :password="showPassword"
          v-model="password"
        />
        <view
          class="uni-icon uni-icon-eye"
          :class="[!showPassword ? 'uni-active' : '']"
          @click="toggleShowPassword"
        ></view>
      </view>
      <view class=".uni-text-gray .uni-text-small"> * 密码为6位数字</view>
      <view class="uni-btn-v primary">
        <button type="primary" @click="setPassword">完成</button>
      </view>
    </view>
  </view>
</template>

<script>
var util = require("@/common/util.js");
import { setPaymentPasswordApi } from "@/api/auth";

export default {
  data() {
    return {
      showPassword: true,
      password: ""
    };
  },
  onLoad() {},
  methods: {
    setPassword(e) {
      console.log(e);
      if (!util.isNumber(this.password)) {
        console.log(util.isNumber(this.password), this.password);
        util.showTip("只允许为数字");
        this.password = "";
        return;
      }
      setPaymentPasswordApi(this.password)
        .then(() => {
          util.showTip("设置密码成功");
          uni.navigateBack();
        })
        .catch(err => {
          util.showTip(err);
        });
    },
    toggleShowPassword: function(e) {
      this.showPassword = !this.showPassword;
    }
  }
};
</script>

<style>
.uni-icon-eye {
  color: #999;
}
</style>
