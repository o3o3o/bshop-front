<template>
  <view>
    <page-head :title="title"></page-head>
    <view v-if="vendorName && vendorId">
      {{ decodeURI(vendorName) }}
    </view>
    <view class="uni-padding-wrap">
      <view style="background:#FFF; padding:50upx 0;">
        <view class="uni-hello-text uni-center"><text>支付金额</text></view>
        <view class="uni-h1 uni-center uni-common-mt">
          <text class="rmbLogo">￥</text>
          <input
            class="amount"
            type="digit"
            v-model="amount"
            maxlength="4"
            @input="amountChange"
          />
        </view>
        <!--
        <input class="note" type="text" :value="note" />
        -->
      </view>
      <view class="uni-btn-v uni-common-mt">
        <button
          type="primary"
          @click="togglePayment"
          :loading="loading"
          :disabled="disabled"
        >
          开始转账
        </button>
        <best-payment-password
          :show="showInputPwd"
          :forget="false"
          v-model="paymentPassword"
          digits="6"
          @submit="transfer"
          @cancel="togglePayment"
        ></best-payment-password>
      </view>
    </view>
  </view>
</template>

<script>
import { transferPay } from "@/api/wallet";
import bestPaymentPassword from "@/components/best-payment-password/best-payment-password.vue";

var util = require("@/common/util.js");
export default {
  components: {
    bestPaymentPassword
  },
  data() {
    return {
      title: "转账",
      amount: "",
      vendorId: "",
      vendorName: "",
      vendorImg: "",
      loading: false,
      disabled: true,
      note: "",
      paymentPassword: "",
      showInputPwd: false
    };
  },
  onLoad(option) {
    if (!option.vendorId || !option.vendorName) {
      console.error("cannot get vendorInfo from query:", option);
      return;
    }
    this.vendorId = option.vendorId;
    this.vendorName = option.vendorName;
  },
  methods: {
    amountChange(e) {
      console.log(e.detail.value);
      this.amount = e.detail.value;
      if (this.amount > 0 && this.amount < 100000) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    togglePayment() {
      this.showInputPwd = !this.showInputPwd;
    },
    transfer(paymentPassword) {
      console.log("开始转账", paymentPassword);
      this.paymentPassword = paymentPassword;
      this.showInputPwd = false;
      this.loading = true;
      transferPay(this.vendorId, this.amount, this.paymentPassword, this.note)
        .then(res => {
          console.log("transfer success");
          uni.showModal({
            title: "转账成功",
            content: "付款给" + this.vendorName + " " + this.amount + "元",
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                console.log("用户点击确定");
                //TODO: go to last page?
              }
            }
          });
        })
        .catch(err => {
          uni.showModal({
            title: "转账失败",
            content: err,
            showCancel: false
          });
        });
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
