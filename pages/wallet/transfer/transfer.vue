<template>
  <view>
    <page-head :title="title"></page-head>
    <view class="uni-padding-wrap">
      <view style="background:#FFF; padding:50upx 0;">
        <view class="uni-hello-text uni-center">
          <text v-if="vendorName && vendorId"
            >支付给 {{ decodeURI(vendorName) }}
          </text>
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
          :disabled="disabled"
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
              />
            </view>
            <view v-if="item.value === 'balance'">
              ({{ balance }} 元) {{ item.name }}
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
      balance: 0,
      vendorId: "",
      vendorName: "",
      vendorImg: "",
      loading: false,
      disabled: true,
      note: "",
      paymentPassword: "",
      showInputPwd: false,
      //TODO: if balance>0, set default paymethod into balance
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
    payMethod: function() {
      return this.payMethods[this.payMethodCurrent].name;
    }
  },
  onLoad(option) {
    if (!option.vendorId || !option.vendorName) {
      console.error("cannot get vendorInfo from query:", option);
      return;
    }
    this.vendorId = option.vendorId;
    this.vendorName = option.vendorName;
    this.getBalance().then(data => {
      this.balance = data.cash;
    });
    if (this.balance > 0) {
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
    getBalance() {
      const query = `
      query{
        fund{
          cash
        }
      }
      `;
      return execute(query);
    },
    payMethodChange(evt) {
      for (let i = 0; i < this.payMethods.length; i++) {
        if (this.payMethods[i].value === evt.target.value) {
          this.payMethodCurrent = i;
          break;
        }
      }
    },
    amountChange(e) {
      //console.log(e.detail.value);
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
    requestPayment() {
      if (this.payMethodCurrent === 0) {
        // pay with balance
        togglePayment();
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
            this.checkIfPaied(orderId);
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
              content: "成功付款" + " " + float(data.amount) + "元",
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
