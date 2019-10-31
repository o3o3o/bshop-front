<template>
  <view>
    <page-head :title="title"></page-head>
    <view class="uni-list">
      <view
        class="uni-list-cell"
        hover-class="uni-list-cell-hover"
        v-for="(value, index) in listData"
        :key="value.id"
      >
        <view>
          <view class="body">
            <view>
              订单：<text>{{ value.id }}</text>
            </view>
            <view>
              类型：<text>{{ typeMap[value.type] || "未知" }}</text>
            </view>
            <view>
              数量: {{ value.amount }}
              <text class="rmbLogo">￥</text>
            </view>
            <view>
              时间: <text>{{ formatTime(value.createdAt) }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <uni-load-more :status="status" :content-text="contentText" />
  </view>
</template>

<script>
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
/*
import uniList from "@/components/uni-list/uni-list.vue";
import uniListItem from "@/components/uni-list-item/uni-list-item.vue";
*/
import { getLedgers } from "@/api/wallet";
var util = require("@/common/util.js");
var moment = require("moment");

export default {
  components: {
    uniLoadMore
    /*,
    uniList,
    uniListItem
    */
  },
  data() {
    return {
      title: "账单历史",
      listData: [],
      lastId: "",
      hasNext: true,
      status: "more",
      contentText: {
        contentdown: "上拉加载更多",
        contentrefresh: "加载中",
        contentnomore: "没有更多"
      },
      typeMap: {
        WITHDRAW: "提现",
        DEPOSIT: "充值",
        CASHBACK: "返现",
        TRANSFER: "转账"
      }
    };
  },
  computed: {},
  onLoad() {
    util.showLoadingMask();
    this.getList().finally(() => {
      uni.hideLoading();
    });
  },
  onReachBottom() {
    if (this.hasNext) {
      this.status = "more";
      this.getList();
    } else {
      this.status = "nomore";
    }
  },
  onPullDownRefresh() {
    this.reload = true;
    this.lastId = "";
    this.getList();
  },
  methods: {
    getList() {
      /*
      this.listData = [
        { id: "idxxxxxx", type: "DEPOSIT", amount: "0.1" },
        { id: "idxxxxx2", type: "DEPOSIT", amount: "0.2" }
      ];
      return;
      */

      var that = this;
      return getLedgers(this.lastId)
        .then(data => {
          let list = that.toList(data["edges"]);
          that.hasNext = data["pageInfo"]["hasNextPage"];
          that.lastId = data["pageInfo"]["endCursor"];

          if (that.reload) {
            that.listData = that.listData.concat(list);
          } else {
            that.listData = list;
          }
          //console.log("listData: ", that.listData);
        })
        .catch(err => {
          util.showTip(err);
        });
    },
    toList(edges) {
      var newItems = [];
      edges.forEach(e => {
        newItems.push(e.node);
      });
      return newItems;
    },
    formatTime(value) {
      if (value) {
        return moment(value)
          .locale("zh_cn")
          .format("llll");
      }
      return "";
    }
  }
};
</script>

<style>
.rmbLogo {
  font-size: 40upx;
}
.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
}
</style>
