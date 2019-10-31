import Vue from "vue";
import Vuex from "vuex";
import updateJwtToken from "@/api/gql";
import { loginWithProvider } from "@/api/auth";
import { getBalance } from "@/api/wallet";
import { getMe, getUserInfoWithBalance } from "@/api/user";

var util = require("@/common/util.js");

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		//TODO: provicder just for APP
		loginProvider: "WECHAT",
		token: null,
		userInfo: null,
		phone: null,
		balance: null
	},
	getters: {
		getUserInfo(state) {
			return state.userInfo || uni.getStorage({ key: "userInfo" });
		},
		getToken(state) {
			return state.token || uni.getStorage({ key: "token" });
		},
		hasSetPaymentPassword(state) {
			var res = Boolean(state.userInfo && state.userInfo.hasPaymentPassword);
			console.log("hasSetPaymentPassword", res);
			return res;
		}
	},
	mutations: {
		updateToken(state, token) {
			state.token = token;
			uni.setStorage({ key: "token", data: token });
			updateJwtToken(token);
		},
		updateUserInfo(state, res) {
			//console.log("updateUserInfo for", state.loginProvider);
			let userInfo = {
				avatarUrl: res.avatarUrl,
				nickName: res.nickName,
				gender: res.gender,
				country: res.country,
				hasPaymentPassword: res.hasPaymentPassword,
				isVendor: res.isVendor
			};
			uni.setStorage({
				key: "userInfo",
				data: userInfo
			});
			state.userInfo = userInfo;

			//console.log("Updated userinfo：" + state.userInfo);
		},
		login(state, token) {
			state.hasLogin = true;
			this.commit("updateToken", token);
		},
		logout(state) {
			state.hasLogin = false;
			state.token = null;
		},
		updateBalance(state, data) {
			state.balance = data;
		},
		/**
		 * 统一跳转接口,拦截未登录路由
		 * navigator标签现在默认没有转场动画，所以用view
		 */
		navTo(state, url) {
			if (!state.hasLogin) {
				this.dispatch("tryLoginWithProvider").catch(err => {
					url = "/pages/login/login";
				});
			}
			uni.navigateTo({
				url
			});
		}
	},
	actions: {
		async getAuthCode({ commit, state }) {
			return await new Promise((resolve, reject) => {
				uni.login({
					success: data => {
						console.log("getAuthCode: ", data);
						return resolve(data.code);
					},
					fail: err => {
						console.error(
							"uni.login 接口调用失败，将无法正常使用开放接口等服务",
							err
						);
						reject(err);
					}
				});
			});
		},
		tryLoginWithProvider({ commit, state }) {
			if (state.hasLogin) {
				return "already login";
			}
			return loginWithProvider(state.loginProvider)
				.then(data => {
					//console.log(data);
					commit("login", data.token);
					commit("updateUserInfo", data.userInfo);
					// console.log("loginProvider, success: ", data);
					return "success";
				})
				.catch(err => {
					//TODO: handle request:fail request connect error
					console.log("tryLoginWithProvider: ", err);
					return Promise.reject(err);
				});
		},
		syncBalance({ commit, state }) {
			return getBalance().then(data => {
				commit("updateBalance", data);
				return Promise.resolve(data);
			});
		},
		syncUserInfo({ commit, state }) {
			return getMe().then(data => {
				commit("updateUserInfo", data);
				return Promise.resolve(data);
			});
		},
		syncUserInfoWithBalance({ commit, state }) {
			return getUserInfoWithBalance().then(data => {
				commit("updateUserInfo", data.me);
				commit("updateBalance", data.fund);
				return Promise.resolve(data);
			});
		}
	}
});

export default store;
