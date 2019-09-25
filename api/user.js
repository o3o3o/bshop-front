import { gqlc, execute } from "@/api/gql.js";

export function getMe() {
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
	        }
	`;
	return execute(query);
}
