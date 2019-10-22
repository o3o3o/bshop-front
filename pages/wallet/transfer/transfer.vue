<template>
  <view>
    <page-head :title="title"></page-head>
    <view class="uni-padding-wrap">
      <view style="background:#FFF; padding:50upx 0;">
        <view class="uni-hello-text uni-center">
          <text v-if="vendorName && vendorId">{{ payTo }} </text>
          <text v-else>支付金额</text>
        </view>
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
          @click="requestPayment"
          :loading="loading"
          :disabled="disabled_pay_btn"
        >
          {{ payMethod }} 支付
        </button>
      </view>
      <view class="uni-list">
        <view><text>请选择支付方式</text></view>
        <radio-group @change="payMethodChange">
          <label
            class="uni-list-cell uni-list-cell-pd"
            v-for="(item, index) in payMethods"
            :key="item.value"
          >
            <view>
              <radio
                :value="item.value"
                :checked="index === payMethodCurrent"
                :disabled="zeroBalance && item.value === 'balance'"
              />
            </view>
            <view v-if="item.value === 'balance'">
              ({{ balance ? balance.total : 0 }} 元) {{ item.name }}
            </view>

            <view v-else>{{ item.name }}</view>
          </label>
        </radio-group>
      </view>

      <view v-if="payMethodCurrent === 0">
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
import { mapState, mapMutations, mapActions } from "vuex";
import {
  transferPay,
  createPayOrder,
  pay as payApi,
  getOrderState
} from "@/api/wallet";
import { execute } from "@/api/gql";
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
      disabled_pay_btn: true,
      note: "",
      paymentPassword: "",
      showInputPwd: false,
      payMethodCurrent: 0,
      payMethods: [
        {
          value: "balance",
          name: "余额"
        },
        {
          value: "weixin",
          name: "微信"
        } /*,
        {
          value: "alipay",
          name: "支付宝"
        }
        */
      ],
      intervalID: null
    };
  },
  computed: {
    ...mapState(["balance"]),
    payMethod: function() {
      return this.payMethods[this.payMethodCurrent].name;
    },
    payTo: function() {
      if (this.vendorName && this.vendorName.length > 0) {
        return "支付给 " + this.vendorName;
      } else {
        return "充值";
      }
    },
    zeroBalance() {
      if (this.balance && this.balance.total) {
        return this.balance.total <= 0;
      }
      return false;
    }
  },
  onLoad(option) {
    if (!option.vendorId || !option.vendorName) {
      console.error("cannot get vendorInfo from query:", option);
      return;
    }
    this.vendorId = option.vendorId;
    this.vendorName = decodeURI(option.vendorName);

    this.$store.dispatch("syncBalance");

    if (this.balance && this.balance.total > 0) {
      this.payMethodCurrent = 0;
    } else {
      //TODO: use value as key
      this.payMethodCurrent = 1;
    }
    //this.checkIfPaied("2b8af81a7d834cab841d0818b954abf2");
  },
  onUnload() {
    clearInterval(this.intervalID);
  },
  methods: {
    payMethodChange(evt) {
      for (let i = 0; i < this.payMethods.length; i++) {
        if (this.payMethods[i].value === evt.target.value) {
          this.payMethodCurrent = i;
          break;
        }
      }
    },
    amountChange(e) {
      this.amount = e.detail.value;
      if (this.amount > 0 && this.amount < 100000) {
        this.disabled_pay_btn = false;
      } else {
        this.disabled_pay_btn = true;
      }
    },
    togglePayment() {
      this.showInputPwd = !this.showInputPwd;
    },
    requestPayment() {
      if (this.payMethodCurrent === 0) {
        // pay with balance
        this.togglePayment();
      } else {
        // pay with weixin, alipay....
        var payment;
        createPayOrder(this.amount, this.vendorId)
          .then(data => {
            console.log(data);
            payment = JSON.parse(data.payment);
            return payApi(payment);
          })
          .then(res => {
            console.log("pay finished: ", res, payment);
            let orderId = payment.orderId;
            return this.checkIfPaied(orderId);
          })
          .catch(err => {
            console.log("pay err: ", err);
            util.showTip(err);
          });
      }
    },
    checkIfPaied(orderId) {
      var that = this;
      this.intervalID = setInterval(function() {
        that
          .isPaied(orderId)
          .then(data => {
            console.log("go to pay succcess page:", data);
            //TODO: 付款给{vendor_name}
            // * new page
            uni.showModal({
              title: "付款成功",
              content: this.payTo + " " + data.amount + "元",
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  //console.log("用户点击确定");
                  uni.navigateBack();
                }
              }
            });
          })
          .catch(err => {
            console.log("pay failed: ", err);
          });
      }, 1000);
    },

    isPaied(orderId) {
      var that = this;
      return getOrderState(orderId).then(data => {
        console.log("getOrderState: ", data);
        switch (data.state) {
          case "SUCCESS":
            clearInterval(that.intervalID);
            return Promise.resolve(data);
          case null:
          case "NOTPAY":
          case "USERPAYING":
            return Promise.reject(data.state);
          default:
            clearInterval(that.intervalID);
            return Promise.reject(data.state);
        }
      });
    },
    transfer(paymentPassword) {
      console.log("开始转账", this.payMethod, paymentPassword);
      this.paymentPassword = paymentPassword;
      this.showInputPwd = false;
      this.loading = true;
      //TODO: balance
      transferPay(this.vendorId, this.amount, this.paymentPassword, this.note)
        .then(res => {
          console.log("transfer success");
          uni.showModal({
            title: "转账成功",
            content: this.payTo + " " + this.amount + "元",
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
