// https://github.com/kqtec/graphql-uni-app-client
import client from '@kqtec/graphql-uni-app-client';


const serverUrl = 'http://localhost:8000/api/gql';

let gqlc = new client({
	uri: serverUrl,
});

export function execute(query, variables){
	var res = null;
	gqlc.query(query, variables).then(result => {
		res = result;
		console.log(result);
	});
	if(res !== null){
		return res.data;
	}else{
		return null;
	}
}

export function testGql() {
	var gqlc = new client({
		uri: serverUrl,
	});
	const query =
		`
	   query UserQuery {
	     Movie(title: "Inception") {
	       releaseDate
	       actors {
	         name
	       }
	     }
	     allMovies{
	       id
	       slug
	       title
	     }
	   }
	
	`;
	return execute(query);
}

export function requestVerificationCode(phone) {
	const mutation =
		`
		  mutation rvc($phone: String!) {
		          requestVerificationCode(phone: $phone) {
		                success
		                message
		               }
		        }
	
	`;
	const variables = {
		'phone': phone
	};
	return execute(mutation, variables);
}

export function verifyCode(phone, code) {
	const mutation =
		`mutation vc($phone: String!, $code: String!) {
			  verifyCode(phone: $phone, code: $code) {
					 success
					 message
					}
		  }`;
	const variables = {
		'phone': phone,
		'code': code
	};
	return execute(mutation, variables);
}
