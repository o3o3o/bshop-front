import { gqlc, execute } from "@/api/gql.js";

export function getMe() {
	const query = `
	  query _{
	         me{
							id
							avatarUrl: avatar
							nickName: nickname
							lastName
							firstName
							hasPaymentPassword
					 }
	}`;
	return execute(query);
}

export function getReceivePayQr() {
	const query = `
	 query {
	    vendorReceivePayQr {
				     qr
				   }
	}`;
	return execute(query);
}
