// https://github.com/kqtec/graphql-uni-app-client
import client from "@kqtec/graphql-uni-app-client";

var serverUrl;

if (process.env.NODE_ENV === "development") {
	console.log("开发环境");
	serverUrl = "http://localhost:8000/api/gql";
} else {
	console.log("生产环境");
	serverUrl = "https://dev-shop.o3o3o.com/api/gql";
}

export var gqlc = new client({
	uri: serverUrl,
	//TODO: add headers? or use lokka-transport-jwt-auth?
	headers: {}
});
//console.log(gqlc);

export default function updateJwtToken(token) {
	//TODO: update and refresh jwt token
	//https://github.com/kadirahq/lokka-transport-jwt-auth/blob/master/src/index.js
	gqlc.$client._transport._$headers.Authorization = "JWT " + token;
	// console.log("update to new token: ", gqlc.$client._transport._$headers);
}

export function execute(query, variables, name) {
	return new Promise((resolve, reject) => {
		gqlc
			.query(query, variables)
			.then(res => {
				console.log("execute " + name + " result: ", res);
				if (res.data && res.statusCode === 200) {
					if (res.data.errors) {
						return reject(res.data.errors[0]);
					}
					resolve(res.data.data[name]);
				} else if (res.statusCode === 400) {
					let err = res.data.errors;
					console.error(err);
					reject(err);
				} else {
					console.error(res);
					reject(res);
				}
			})
			.catch(err => reject(err));
	});
}

export function mutate_without_result(query, variables, name) {
	return new Promise((resolve, reject) => {
		execute(query, variables, name)
			.then(res => {
				console.log("mutate " + name + "without result: ", res);
				if (res.success) {
					resolve(name + ":ok");
				} else {
					reject(res.message);
				}
			})
			.catch(err => reject(err));
	});
}

export function testGql() {
	let gqlc = new client({
		uri: serverUrl
	});
	const query = `
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
