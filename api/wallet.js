import { execute, mutate_without_result } from "@/api/gql.js";

const uuidv4 = require("uuid/v4");

export function pay() {
	console.log("pay");
	/*
	const query = `
	  query _{
	         me{
							id
							avatar
							nickname
							lastName
							firstName
							phone
					 }
	}`;
	return execute(query, null, "me");
	*/
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
