<template>
  <view class="myCenter" style="margin-top:150upx ;">
    <swiper
      class="mySwiper"
      :indicator-dots="false"
      :autoplay="false"
      :current="swiperCurrent"
      @change="swiperChange"
    >
      <swiper-item class="myCenter">
        <view class="logo">
          <view class="img">
            <image mode="widthFix" :src="Style"></image>
          </view>
        </view>
        <view class="form re">
          <view class="res">
            <view>{{ NickName }}</view>
          </view>
          <block v-if="!HasAuthUserInfo">
            <button
              class="btn"
              open-type="getUserInfo"
              @getuserinfo="getUserInfoData"
            >
              获取个人信息
            </button>
            <view>
              <button class="btn-nologin" @click="doNotLogin">暂不登录</button>
            </view>
          </block>
          <block v-else>
            <button class="btn" @tap="nextSwiper(1)">下一步</button>
          </block>
        </view>
      </swiper-item>
      <swiper-item class="myCenter">
        <view class="form re">
          <view class="username">
            <view
              class="get-code"
              :style="{ color: getCodeBtnColor }"
              @click="getCode()"
              >{{ getCodeText }}</view
            >
            <input
              placeholder="请输入手机号"
              v-model="phoneNumber"
              placeholder-style="color: rgba(255,255,255,0.8);"
            />
          </view>
          <view class="code">
            <input
              placeholder="请输入验证码"
              v-model="code"
              placeholder-style="color: rgba(255,255,255,0.8);"
            />
          </view>
          <button class="btn" @tap="doReg" v-if="phoneNumberChecked !== 1">
            立即绑定
          </button>
          <button
            class="btn"
            @tap="nextSwiper(2)"
            v-if="phoneNumberChecked === 1"
          >
            下一步
          </button>
        </view>
      </swiper-item>
      <swiper-item class="myCenter">
        <view class="form re">
          <block v-if="!HasAuthUserInfo">
            <view class="res">
              <view>您还没有授权</view>
            </view>
            <button
              class="btn"
              @tap="nextSwiper(0)"
              v-if="phoneNumberChecked !== 1"
            >
              去授权
            </button>
          </block>
          <block v-if="phoneNumberChecked !== 1">
            <view class="res">
              <view>您还没有绑定手机号</view>
            </view>
            <button
              class="btn"
              @tap="nextSwiper(1)"
              v-if="phoneNumberChecked !== 1"
            >
              去绑定
            </button>
          </block>
          <block v-if="phoneNumberChecked === 1 && HasAuthUserInfo">
            <view class="logo">
              <view class="img">
                <image mode="widthFix" :src="Style"></image>
              </view>
            </view>
            <view class="res">{{ NickName }}</view>
            <view class="res">
              <view>恭喜您已完成注册！</view>
            </view>
            <button class="btn" @tap="toIndex()">回到首页</button>
          </block>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: {
    headimg: {
      type: String,
      default:
        "data:image/png;base64,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"
    },
    userName: {
      type: String,
      default: "未登录"
    },
    phoneNumberChecked: {
      type: Number,
      default: 0
    },
    pinSended: {
      type: Number,
      default: 0
    },
    codeLength: {
      type: Number,
      default: 6
    },
    url: {
      type: String,
      default: "/pages/index/index"
    }
  },
  data() {
    return {
      swiperCurrent: 0,
      phoneNumber: "",
      countryCode: "+86",
      code: "",
      passwd: "",
      getCodeText: "获取验证码",
      getCodeBtnColor: "#ffffff",
      getCodeisWaiting: false
    };
  },
  onLoad() {},
  computed: {
    ...mapState(["loginProvider", "userInfo", "hasLogin", "phone"]),

    fullPhoneNumber() {
      return this.countryCode + this.phoneNumber;
    },
    Style() {
      var headimg =
        this.userInfo && this.userInfo.avatarUrl
          ? this.userInfo.avatarUrl
          : this.headimg;
      // var style = `background-image:url(${headimg});`;
      return headimg;
    },
    NickName() {
      var nickName =
        this.userInfo && this.userInfo.nickName
          ? this.userInfo.nickName
          : this.userName;
      return nickName;
    },
    HasAuthUserInfo() {
      return this.userInfo && this.userInfo.nickName;
    }
  },
  watch: {
    phoneNumberChecked(newValue, OldValue) {
      if (newValue === 1) {
        uni.hideLoading();
        uni.showToast({ title: "注册成功", icon: "success" });
      }
      if (newValue === 2) {
        uni.showToast({ title: "注册失败", icon: "success" });
      }
    },
    pinSended(nv, ov) {
      if (nv === 1) {
        uni.showToast({ title: "验证码已发送", icon: "none" });
        this.setTimer();
      }
      if (nv === 2) {
        uni.showToast({ title: "验证码发送失败", icon: "none" });
      }
    }
  },
  methods: {
    ...mapMutations(["updateUserInfo"]),
    swiperChange(e) {
      console.log(e);
      this.swiperCurrent = e.detail.current;
    },
    Timer() {},
    doNotLogin() {
      uni.navigateBack();
    },
    getCode() {
      uni.hideKeyboard();
      if (this.getCodeisWaiting) {
        return;
      }
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber)) {
        uni.showToast({ title: "请填写正确手机号码", icon: "none" });
        return false;
      }
      this.getCodeText = "发送中...";
      this.getCodeisWaiting = true;
      this.getCodeBtnColor = "rgba(255,255,255,0.5)";
      this.$emit("sendPin", {
        phoneNumber: this.fullPhoneNumber
      });
    },
    setTimer() {
      let holdTime = 60;
      this.getCodeText = "重新获取(60)";
      this.Timer = setInterval(() => {
        if (holdTime <= 0) {
          this.getCodeisWaiting = false;
          this.getCodeBtnColor = "#ffffff";
          this.getCodeText = "获取验证码";
          clearInterval(this.Timer);
          return;
        }
        this.getCodeText = "重新获取(" + holdTime + ")";
        holdTime--;
      }, 1000);
    },
    doReg() {
      uni.hideKeyboard();
      if (this.pinSended !== 1) {
        uni.showToast({ title: "请先获取验证码", icon: "none" });
        return false;
      }
      //模板示例部分验证规则
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phoneNumber)) {
        uni.showToast({ title: "请填写正确手机号码", icon: "none" });
        return false;
      }
      //非空校验
      if (this.code === "") {
        uni.showToast({ title: "验证码不能为空", icon: "none" });
        return false;
      }
      let regstr = new RegExp("\\d{" + parseInt(this.codeLength) + "}");
      if (!regstr.test(this.code)) {
        uni.showToast({ title: "验证码不正确", icon: "none" });
        return false;
      }
      uni.showLoading({
        title: "提交中..."
      });
      this.$emit("checkPhoneNumber", {
        phoneNumber: this.fullPhoneNumber,
        code: this.code
      });
    },
    toIndex() {
      console.log("toindex, ", this.url);
      uni.hideKeyboard();
      uni.reLaunch({ url: this.url });
      //uni.navigateBack();
    },
    nextSwiper(index) {
      this.swiperCurrent = index;
    },
    getUserInfoData(e) {
      console.log(e);
      this.updateUserInfo(e.detail.userInfo);
    },
    getUserPhoneNumber(e) {
      console.log(e);
    }
  },
  mounted() {
    if (process.env.NODE_ENV === "development") {
      this.phoneNumber = "13812345679";
      this.code = "123456";
    }

    // 获取用户信息
    if (!this.userInfo || !this.userInfo.nickName) {
      //#ifdef MP
      uni.showLoading({
        title: "加载中..."
      });
      //#endif
      uni.getUserInfo({
        //provider: this.loginProvider,
        success: infoRes => {
          this.updateUserInfo(infoRes);
        },
        fail: function(res) {},
        complete() {
          uni.hideLoading();
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "login.scss";
</style>
