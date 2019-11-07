<template>
  <view>
    <view class="container">
      <view class="uni-page-head">
        <view class="uni-page-head-title">{{ title }}</view>
      </view>
      <view class="qrimg"
        ><tki-qrcode
          ref="qrcode"
          :val="val"
          :size="size"
          :onval="onval"
          :icon="iconPath"
          :loadMake="loadMake"
        />
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
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
      size: 500,
      iconPath: "",
      show: true
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    title() {
      if (this.userInfo && this.userInfo.vendorName) {
        return this.userInfo.vendorName;
      } else {
        return "";
      }
    }
  },
  methods: {},
  onLoad() {
    var that = this;
    // request for receivepay qr content
    //console.log("onload qr page");
    getReceivePayQr()
      .then(res => {
        uni.downloadFile({
          url: that.userInfo.avatarUrl,
          success: res => {
            if (res.statusCode === 200) {
              that.iconPath = res.tempFilePath;
              console.log("download path: ", that.iconPath);
            }
          },
          complete() {
            that.val = res.qr;
          }
        });
        //console.log(that.iconPath);
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
