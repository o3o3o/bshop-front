import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		loginProvider: "",
		openid: null,
		userInfo: null
	},
	getters: {
		getUserInfo(state) {
			return uni.getStorage({key: 'userInfo'});
		}
	},
	mutations: {
 		updateUserInfo(state, infoRes) {
 			console.log("updateUserInfo for", state.loginProvider);
			let userInfo = {
				'avatarUrl': infoRes.userInfo.avatarUrl,
				'nickName': infoRes.userInfo.nickName,
				'gender': infoRes.userInfo.gender,
				'country': infoRes.userInfo.country
			};
			uni.setStorage({
				key: 'userInfo',
				data: userInfo,
			});
			state.userInfo = userInfo;

			console.log('Updated userinfo：' + state.userInfo);
 
 		},
		logout(state) {
			state.hasLogin = false
			state.openid = null
		},
		setOpenid(state, openid) {
			state.openid = openid
		}
	},
	actions: {

		// lazy loading openid
		getUserOpenId: async function({
			commit,
			state
		}) {
			return await new Promise((resolve, reject) => {
				if (state.openid) {
					resolve(state.openid)
				} else {
					uni.login({
						success: (data) => {
							// res 对象格式
							//     
							//     "code":"***",
							//     "authResult":
							//         "openid":"***",
							//         "scope":"snsapi_userinfo",
							//         "refresh_token":"**",
							//         "code":"****",
							//         "unionid":"***",
							//         "access_token":"***",
							//         "expires_in":7200
							//     ,
							//     "errMsg":"login:ok"
							// 
							//"errMsg":"login:ok"
							console.log('ulogin resutl, ', data, data.authResult);
							let openid = data.authResult.openid;
							commit('setOpenid', openid);
							resolve(openid);
						},
						fail: (err) => {
							console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
							reject(err)
						}
					})
				}
			})
		}
	}
})

export default store
