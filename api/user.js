import { execute } from "@/api/gql.js";

export function getMe() {
	const query = `
	  query _{
			me{
			 	id
			 	avatarUrl: avatar
			 	nickName: nickname
			 	hasPaymentPassword
			 	isVendor
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

export function getUserInfoWithBalance() {
	const query = `
	  query _{
				me{
				 	id
				 	avatarUrl: avatar
				 	nickName: nickname
				 	hasPaymentPassword
				 	isVendor
				}
        fund{
          total
          cash
          hold
        }
	}`;
	return execute(query);
}
