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
            focus="true"
            v-model="amount"
            maxlength="8"
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
          :disabled="disablePayBtn"
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
            v-if="isTransfer || item.value !== 'balance'"
            :key="item.value"
          >
            <view>
              <radio
                :value="item.value"
                :checked="item.value === payMethodCurrent"
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

      <view v-if="payMethodCurrent === 'balance'">
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
import { mapState, mapGetters, mapActions } from "vuex";
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
      vendorId: null,
      vendorName: null,
      vendorImg: "",
      loading: false,
      disablePayBtn: true,
      note: "",
      paymentPassword: "",
      showInputPwd: false,
      payMethodCurrent: "balance",
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
    ...mapGetters(["hasSetPaymentPassword"]),

    payMethod() {
      for (var i = 0, len = this.payMethods.length; i < len; i++) {
        let item = this.payMethods[i];
        if (this.payMethodCurrent === item.value) {
          return item.name;
        }
      }
      if (this.isTransfer) {
        return "balance";
      } else {
        return "weixin";
      }
    },
    payTo() {
      if (this.vendorName && this.vendorName.length > 0) {
        return "支付给 " + this.vendorName;
      } else {
        return "充值";
      }
    },
    zeroBalance() {
      let res = Boolean(
        this.balance && this.balance.total && this.balance.total <= 0
      );
      console.log("zeroBalance: ", res);
      return res;
    },
    isTransfer() {
      return this.vendorId !== null && this.vendorName !== null;
    }
  },
  onLoad(option) {
    if (option.vendorId && option.vendorName) {
      this.vendorId = option.vendorId;
      this.vendorName = decodeURI(option.vendorName);
    }
  },
  onUnload() {
    clearInterval(this.intervalID);
  },
  onShow() {
    if (!this.isTransfer) {
      this.payMethodCurrent = "weixin";
      return;
    }
    var that = this;

    util.showLoadingMask();

    this.$store
      .dispatch("syncUserInfoWithBalance")
      .then(() => {
        if (that.zeroBalance) {
          console.log("switch to weixin");
          that.payMethodCurrent = "weixin";
        } else {
          console.log("switch to balance");
          that.payMethodCurrent = "balance";
        }

        console.log(that.hasSetPaymentPassword, that.hasSetPaymentPassword);
        if (that.hasSetPaymentPassword === false) {
          uni.showModal({
            title: "提示",
            content: "未设置支付密码",
            showCancel: false,
            confirmText: "去设置",
            success: function(res) {
              uni.navigateTo({
                url: "/pages/settings/payment-password/payment-password"
              });
            }
          });
        }
      })
      .finally(res => {
        uni.hideLoading();
      });
  },
  methods: {
    //TODO: async call blockly?
    async asyncUserInfoWithBalance() {
      return await this.$store.dispatch("syncUserInfoWithBalance");
    },
    payMethodChange(evt) {
      this.payMethodCurrent = evt.target.value;
    },
    amountChange(e) {
      this.amount = e.detail.value;
      if (this.amount > 0 && this.amount < 100000) {
        this.disablePayBtn = false;
      } else {
        this.disablePayBtn = true;
      }
    },
    togglePayment() {
      this.showInputPwd = !this.showInputPwd;
    },
    requestPayment() {
      this.loading = true;
      this.disablePayBtn = true;
      if (this.payMethodCurrent === "balance") {
        /* pay with balance */
        this.togglePayment();
      } else {
        /* pay with weixin, alipay.... */
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
            this.loading = false;
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
              content: that.payTo + " " + data.amount + "元",
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  //console.log("用户点击确定");
                  uni.navigateBack();
                }
              },
              complete() {
                that.disablePayBtn = false;
              }
            });
          })
          .catch(err => {
            console.log("pay failed: ", err);
          });
      }, 3000);
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
      // console.log("开始转账", this.payMethod);
      this.paymentPassword = paymentPassword;
      this.showInputPwd = false;
      this.loading = true;
      var that = this;
      //TODO: balance
      transferPay(this.vendorId, this.amount, this.paymentPassword, this.note)
        .then(res => {
          console.log("transfer success", res);
          uni.showModal({
            title: "转账成功",
            content: that.payTo + " " + that.amount + "元",
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                console.log("用户点击确定");
                uni.navigateBack();
              }
            }
          });
        })
        .catch(err => {
          this.loading = false;
          util.showFailModal("转账失败", err);
        })
        .finally(() => {
          this.paymentPassword = "";
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
