import store from "@/store";
import { execute, mutate_without_result } from "@/api/gql.js";

const uuidv4 = require("uuid/v4");

export function createPayOrderApi(provider, code, amount, to_uuid = null) {
	const mutation = `
	 mutation _($input: CreatePayOrderInput!){
					 createPayOrder(input: $input){
							payment
					}
	}`;
	let variables = {
		input: {
			code: code,
			provider: provider,
			to: to_uuid,
			amount: amount,
			requestId: uuidv4()
		}
	};
	return execute(mutation, variables, "createPayOrder");
}

export function createPayOrder(amount, to_uuid = null) {
	return store.dispatch("getAuthCode").then(authCode => {
		return createPayOrderApi(
			store.state.loginProvider,
			authCode,
			amount,
			to_uuid
		);
	});
}

export function pay(data) {
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			timeStamp: data.timeStamp,
			nonceStr: data.nonceStr,
			package: data.package,
			signType: "MD5",
			paySign: data.paySign,
			success: res => {
				resolve(res);
			},
			fail: res => {
				reject(res);
			}
		});
	});
}

export function transferPay(to_uuid, amount, paymentPassword, note = null) {
	const mutation = `
	 mutation _($input: TransferInput!){
					 transfer(input: $input){
									success
					}
	}`;
	let variables = {
		input: {
			to: to_uuid,
			amount: amount,
			paymentPassword: paymentPassword,
			note: note,
			requestId: uuidv4()
		}
	};
	return mutate_without_result(mutation, variables, "transfer");
}
