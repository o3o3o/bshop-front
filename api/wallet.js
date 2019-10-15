import { execute, mutate_without_result } from "@/api/gql.js";

const uuidv4 = require("uuid/v4");

export function requestDeposit(code, amount) {
	const mutation = `
	 mutation _($input: CreateDepositOrderInput!){
			createDepositOrder(input: $input){
				payment
			}
	 }
	`;
	let variables = {
		input: {
			amount: amount,
			provider: provider,
			code: code
		}
	};
	return mutate_without_result(mutation, variables, "createDepositOrder");
}

export function requestPay(code, amount, to_uuid) {}

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
