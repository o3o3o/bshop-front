import store from "@/store";
import { execute, mutate_without_result } from "@/api/gql.js";

export function requestVerificationCode(phone) {
	const mutation = `
		  mutation rvc($phone: String!) {
		          requestVerificationCode(phone: $phone) {
		                success
		                message
		               }
		        }
	
	`;
	let variables = {
		phone: phone
	};
	return mutate_without_result(mutation, variables);
}

export function verifyCodeApi(phone, code) {
	const mutation = `
	mutation vc($phone: String!, $code: String!) {
			  verifyCode(phone: $phone, code: $code) {
					 success
					 message
					}
		  }`;
	let variables = {
		phone: phone,
		code: code
	};
	return mutate_without_result(mutation, variables);
}

var providerMap = {
	weixin: "WECHAT",
	wxpay: "WECHAT"
};

function getLoginProvider(key) {
	if (key in providerMap) {
		return providerMap[key];
	} else {
		return key.toUpperCase();
	}
}

export function signIn(phone = null, authCode = null, provider = null) {
	const mutation = `
	mutation signIn($phone: String, $authCode: String, $provider: LoginProvider) {
			  signIn(phone: $phone, authCode: $authCode, provider: $provider) {
						token
						me{
						  id
						  avatar
							nickname
							phone
							hasPaymentPassword
						}
					}
		  }`;
	if (provider) {
		provider = getLoginProvider(provider);
	}

	let variables = {
		phone: phone,
		authCode: authCode,
		provider: provider
	};
	return execute(mutation, variables);
}

export function signUp(phone) {
	const mutation = `
	mutation signUp($phone: String!) {
			  signUp(phone: $phone) {
						token
						me{
						  id
						  avatarUrl: avatar
							nickName: nickname
							phone
						}
						refreshToken
					}
		  }`;

	let variables = {
		phone: phone
	};
	return execute(mutation, variables);
}
export function verifyToken(token) {
	const mutation = `
	mutation _($token: String!) {
			  verifyToken(token: $token) {
					 payload
					}
		  }`;
	let variables = {
		token: token
	};
	return execute(mutation, variables);
}

export function setPaymentPasswordApi(password) {
	const mutation = `
	  mutation ($password: String!){
		      setPaymentPassword(password: $password){
					          success
						      }
									  }
		  `;
	let variables = {
		password: password
	};
	return mutate_without_result(mutation, variables);
}

export function bindThirdAccountApi(authCode, provider) {
	const mutation = `
	mutation _($authCode: String!, $provider: LoginProvider!) {
			  bindThirdAccount(authCode: $authCode, provider: $provider) {
						success
						message
					}
		  }`;
	let variables = {
		provider: getLoginProvider(provider),
		authCode: authCode
	};
	return mutate_without_result(mutation, variables);
}

export function bindAccount() {
	return store.dispatch("getAuthCode").then(authCode => {
		return bindThirdAccountApi(authCode, store.state.loginProvider);
	});
}

export function loginWithProvider(provider) {
	return store.dispatch("getAuthCode").then(authCode => {
		return signIn(null, authCode, provider).then(res => {
			console.log("signIn with authcode: ", res);
			if (res.me) {
				var data = {
					token: res.token,
					userInfo: {
						id: res.me.id,
						avatarUrl: res.me.avatar,
						nickName: res.me.nickname,
						phone: res.me.phone,
						hasPaymentPassword: res.me.hasPaymentPassword
					}
				};
				return data;
			}
			return Promise.reject("loginProvider failed");
		});
	});
}

export function updateUserInfoApi(nickName = null, avatarUrl = null) {
	if (nickName === null && avatarUrl === null) {
		console.error("cannot clean up userinfo");
		return;
	}
	const mutation = `
	mutation _($input: UpdateUserInfoInput!) {
			  updateUserInfo(input: $input) {
						success
						message
					}
		  }`;
	let variables = { input: {} };
	if (nickName) {
		variables.input.nickname = nickName;
	}
	if (avatarUrl) {
		variables.input.avatarUrl = avatarUrl;
	}
	return mutate_without_result(mutation, variables);
}
