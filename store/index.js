import Vue from "vue";
import Vuex from "vuex";
import updateJwtToken from "@/api/gql";
import { loginWithProvider } from "@/api/auth";

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		//TODO: provicder just for APP
		loginProvider: "weixin",
		token: null,
		userInfo: null,
		phone: null,
		authCode: null
	},
	getters: {
		getUserInfo(state) {
			return state.userInfo || uni.getStorage({ key: "userInfo" });
		},
		getToken(state) {
			return state.token || uni.getStorage({ key: "token" });
		}
	},
	mutations: {
		cleanAuthCode(state) {
			state.authCode = null;
		},
		updateAuthCode(state, code) {
			state.authCode = code;
		},
		updateToken(state, token) {
			state.token = token;
			uni.setStorage({ key: "token", data: token });
			console.log(updateJwtToken);
			updateJwtToken(token);
		},
		updateUserInfo(state, res) {
			console.log("updateUserInfo for", state.loginProvider);
			let userInfo = {
				avatarUrl: res.avatarUrl,
				nickName: res.nickName,
				gender: res.gender,
				country: res.country
			};
			uni.setStorage({
				key: "userInfo",
				data: userInfo
			});
			state.userInfo = userInfo;

			console.log("Updated userinfo：" + state.userInfo);
		},
		login(state, token) {
			state.hasLogin = true;
			this.commit("updateToken", token);
		},
		logout(state) {
			state.hasLogin = false;
			state.token = null;
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
						commit("updateAuthCode", data.code);
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
			return new Promise((resolve, reject) => {
				if (state.hasLogin) {
					return resolve();
				}
				loginWithProvider(state.loginProvider)
					.then(data => {
						commit("login", data.token);
						commit("updateUserInfo", data.userInfo);
						console.log("loginProvider, success: ", data);
						return resolve();
					})
					.catch(err => {
						//TODO: handle request:fail request connect error
						console.log("tryLoginWithProvider: ", err);
						return reject(err);
					});
			});
		}
	}
});

export default store;
