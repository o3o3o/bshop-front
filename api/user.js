import { execute } from "@/api/gql.js";

const me_query = `
			me{
			 	id
			 	avatarUrl: avatar
			 	nickName: nickname
			 	hasPaymentPassword
			 	isVendor
			  vendorName
			}
`;

export function getMe() {
	const query = "query _{" + me_query + "}";
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
	const query =
		"query _{" +
		me_query +
		`
        fund{
          total
          cash
          hold
        }
	}`;
	return execute(query);
}
