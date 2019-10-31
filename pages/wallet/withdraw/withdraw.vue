<template>
  <view>
    <page-head :title="title"></page-head>
    <view class="uni-padding-wrap">
      <view style="background:#FFF; padding:50upx 0;">
        <view class="uni-hello-text uni-center">
          <text>提现至零钱金额</text>
        </view>
        <view class="uni-h1 uni-center uni-common-mt">
          <text class="rmbLogo">￥</text>
          <input
            class="amount"
            type="digit"
            focus="true"
            v-model="amount"
            maxlength="8"
            @input="amountChange"
          />
          <view class="uni-text-small uni-badge-green" @click="withdrawAll"
            >全部提现</view
          >
        </view>
        <text> 可提现金额：{{ withdrawableAmount }}</text>
      </view>
      <view class="uni-btn-v uni-common-mt">
        <button
          type="primary"
          @click="requestWithdraw"
          :loading="loading"
          :disabled="disabled_pay_btn"
        >
          确认提现
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { withdraw } from "@/api/wallet";
var util = require("@/common/util.js");

export default {
  data() {
    return {
      title: "提现",
      amount: "",
      loading: false,
      disabled_pay_btn: true
    };
  },
  onLoad() {},
  onShow() {
    // sync balance
    util.showLoadingMask();
    this.$store.dispatch("syncBalance").finally(() => {
      uni.hideLoading();
    });
  },
  computed: {
    ...mapState(["balance"]),

    withdrawableAmount() {
      if (this.balance) {
        return this.balance.cash;
      }
      return 0;
    }
  },
  methods: {
    amountChange(e) {
      if (this.amount > 0 && this.amount <= this.withdrawableAmount) {
        this.disabled_pay_btn = false;
      } else {
        this.disabled_pay_btn = true;
      }
    },
    requestWithdraw() {
      if (this.amount > this.withdrawableAmount) {
        util.showTip("余额不足");
      }
      this.loading = true;
      var that = this;
      withdraw(this.amount)
        .then(res => {
          uni.showModal({
            title: "提示",
            content: `提现 ${that.amount}  元, 已加入提现队列,  可能有些许延迟，请稍后查看微信支付通知`,
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                uni.navigateBack();
              }
            }
          });
        })
        .catch(err => {
          console.log("pay err: ", err);
          uni.showModal({
            title: "提现失败",
            content: JSON.stringify(err.message || err),
            showCancel: false,
            success: function() {
              that.loading = false;
            }
          });
        });
    },
    withdrawAll() {
      this.amount = this.withdrawableAmount;
    }
  }
};
</script>

<style>
.rmbLogo {
  font-size: 40upx;
}

button {
  background-color: #007aff;
  color: #ffffff;
}

.uni-h1.uni-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
}

.amount {
  border-bottom: 1px solid #eee;
  width: 200upx;
  height: 80upx;
  padding-bottom: 4upx;
}
</style>
