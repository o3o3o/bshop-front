<template>
  <view class="container">
    <view class="user-section">
      <image class="bg" src="/static/user-bg.jpg"></image>
      <view class="user-info-box">
        <view class="portrait-box"
          ><image
            class="portrait"
            :src="userInfo.avatarUrl || '/static/missing-face.png'"
          ></image
        ></view>
        <view class="info-box">
          <text class="username">{{ userInfo.nickName || "游客" }}</text>
        </view>
      </view>

      <view class="vip-card-box">
        <image class="card-bg" src="/static/vip-card-bg.png" mode=""></image>
        <view class="b-btn" @click="navTo('/pages/wallet/transfer/transfer')"
          >立即充值</view
        >
        <view class="tit">
          <text class="yticon icon-iLinkapp-"></text>
          会员
        </view>

        <text class="e-b">加入聚赢会员，消费得返现</text>
      </view>
    </view>

    <view
      class="cover-container"
      :style="[
        {
          transform: coverTransform,
          transition: coverTransition
        }
      ]"
    >
      <image class="arc" src="/static/arc.png"></image>

      <view class="tj-sction">
        <view class="tj-item">
          <text class="num">{{ balance ? balance.total : 0 }} 元</text>
          <text>余额</text>
        </view>
        <view class="tj-item">
          <text class="num">{{ balance ? balance.hold : 0 }} 元</text>
          <text>暂不可提现</text>
        </view>
      </view>
      <view></view>

      <view class="order-section">
        <view
          class="order-item"
          @click="navTo('/pages/wallet/withdraw/withdraw')"
          hover-class="common-hover"
          :hover-stay-time="50"
        >
          <text class="yticon icon-withdraw"></text>
          <text>提现</text>
        </view>
        <view
          class="order-item"
          @click="navTo('/pages/wallet/history/history')"
          hover-class="common-hover"
          :hover-stay-time="50"
        >
          <text class="yticon icon-bill"></text>
          <text>消费记录</text>
        </view>
        <view
          v-if="userInfo && userInfo.isVendor"
          class="order-item"
          @click="navTo('/pages/wallet/receivePay/receivePay')"
          hover-class="common-hover"
          :hover-stay-time="50"
        >
          <text class="yticon icon-receivePay"></text>
          <text>收款二维码</text>
        </view>
      </view>
      <view class="list-section">
        <list-cell
          icon="icon-settings"
          iconColor="#e07472"
          title="设置"
          border=""
          @eventClick="navTo('/pages/set/set')"
        ></list-cell>
      </view>
    </view>
  </view>
</template>
<script>
import listCell from "@/components/mix-list-cell";
import { mapState, mapMutations } from "vuex";
let startY = 0,
  moveY = 0,
  pageAtTop = true;
export default {
  components: {
    listCell
  },
  data() {
    return {
      coverTransform: "translateY(0px)",
      coverTransition: "0s",
      moving: false
    };
  },
  onLoad() {
    // console.log('Me: ', this.userInfo);
  },
  onShow() {
    //TODO: merge the request
    this.$store.dispatch("syncBalance");
    this.$store.dispatch("syncUserInfo");
  },

  computed: {
    ...mapState(["balance", "hasLogin", "userInfo"])
  },
  methods: {
    ...mapMutations(["navTo"])
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

.user-section {
  height: 550upx;
  padding: 100upx 30upx 0;
  position: relative;
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    filter: blur(1px);
    opacity: 0.7;
  }
}
.user-info-box {
  height: 180upx;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  .portrait {
    width: 130upx;
    height: 130upx;
    border: 5upx solid #fff;
    border-radius: 50%;
  }
  .username {
    font-size: $font-lg + 6upx;
    color: $font-color-dark;
    margin-left: 20upx;
  }
}

.vip-card-box {
  display: flex;
  flex-direction: column;
  color: #f7d680;
  height: 240upx;
  background: linear-gradient(left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8));
  border-radius: 16upx 16upx 0 0;
  overflow: hidden;
  position: relative;
  padding: 20upx 24upx;
  .card-bg {
    position: absolute;
    top: 20upx;
    right: 0;
    width: 380upx;
    height: 260upx;
  }
  .b-btn {
    position: absolute;
    right: 20upx;
    top: 16upx;
    width: 132upx;
    height: 40upx;
    text-align: center;
    line-height: 40upx;
    font-size: 22upx;
    color: #36343c;
    border-radius: 20px;
    background: linear-gradient(left, #f9e6af, #ffd465);
    z-index: 1;
  }
  .tit {
    font-size: $font-base + 2upx;
    color: #f7d680;
    margin-bottom: 28upx;
    .yticon {
      color: #f6e5a3;
      margin-right: 16upx;
    }
  }
  .e-b {
    font-size: $font-sm;
    color: #d8cba9;
    margin-top: 10upx;
  }
}
.cover-container {
  background: $page-color-base;
  margin-top: -150upx;
  padding: 0 30upx;
  position: relative;
  background: #f5f5f5;
  padding-bottom: 20upx;
  .arc {
    position: absolute;
    left: 0;
    top: -34upx;
    width: 100%;
    height: 36upx;
  }
}
.tj-sction {
  @extend %section;
  .tj-item {
    @extend %flex-center;
    flex-direction: column;
    height: 140upx;
    font-size: $font-sm;
    color: #75787d;
  }
  .num {
    font-size: $font-lg;
    color: $font-color-dark;
    margin-bottom: 8upx;
  }
}
.order-section {
  @extend %section;
  padding: 28upx 0;
  margin-top: 20upx;
  .order-item {
    @extend %flex-center;
    width: 120upx;
    height: 120upx;
    border-radius: 10upx;
    font-size: $font-sm;
    color: $font-color-dark;
  }
}
.yticon {
  font-size: 48upx;
  margin-bottom: 18upx;
}
.list-section {
  padding: 30upx 0 0;
  margin-top: 20upx;
  background: #fff;
  border-radius: 10upx;
}
</style>
