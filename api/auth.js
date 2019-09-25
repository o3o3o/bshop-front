import { gqlc, execute, mutate_without_result } from "@/api/gql.js";

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
	return mutate_without_result(mutation, variables, "requestVerificationCode");
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
	return mutate_without_result(mutation, variables, "verifyCode");
}

export function signIn(phone = null, authCode = null, provider = null) {
	const mutation = `
	mutation signIn($phone: String, $authCcode: String, $provider: LoginProvider) {
			  signIn(username: $phone, authCode: $code, provider: $provider) {
					 success
					 message
					}
		  }`;
	let variables = {
		phone: phone,
		authCode: authCode,
		provider: provider
	};
	return mutate_without_result(mutation, variables, "signIn");
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
	return execute(mutation, variables, "verifyToken");
}

export function bindThirdAccount(authCode, provider) {
	const mutation = `
	mutation _($authCode: String!, provider: LoginProvider!) {
			  bindThirdAccount(authCode: $authCode, provider: $provider) {
						success
						message
					}
		  }`;
	let variables = {
		provider: provider,
		authCode: authCode
	};
	return mutate_without_result(mutation, variables, "bindThirdAccount");
}
