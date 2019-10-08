<script>
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState(["userInfo"])
  },
  methods: {
    ...mapMutations(["login"])
  },
  onLaunch: function() {
    this.userInfo = uni.getStorageSync("userInfo") || {};
    // if(userInfo.provider){
    // 	//更新登陆状态
    // 	uni.getStorage({
    // 		key: 'userInfo',
    // 		success: (res) => {
    // 			this.login(res.data);
    // 		}
    // 	});
    // }
  },
  onLaunch: function() {
    console.log("App Launch");
    //TODO: checkSession 检查登录状过期情况
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
</script>

<style lang="scss">
@import "./common/uni.css";
@font-face {
  font-family: "yticon";
  font-weight: normal;
  font-style: normal;
  src: url("https://at.alicdn.com/t/font_1447394_iuovhqmzpgp.ttf")
    format("truetype");
}

.yticon {
  font-family: "yticon" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon-settings:before {
  content: "\e771";
}
.icon-iLinkapp-:before {
  content: "\e654";
}
.icon-receivePay:before {
  content: "\e606";
}
.icon-bill:before {
  content: "\e619";
}
.icon-withdraw:before {
  content: "\e616";
}
.icon-deposit:before {
  content: "\e683";
}
.icon-balance:before {
  content: "\e62a";
}
.icon-scanqr:before {
  content: "\e69f";
}
.common-hover {
  background: #f5f5f5;
}
</style>
