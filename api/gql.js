// https://github.com/kqtec/graphql-uni-app-client
import client from "@kqtec/graphql-uni-app-client";
var { parse } = require("parse-graphql");

var serverUrl;

if (process.env.NODE_ENV === "development") {
	console.log("开发环境");
	serverUrl = "http://192.168.1.107:8000/api/gql";
} else {
	console.log("生产环境");
	serverUrl = "https://bshop.o3o3o.com/api/gql";
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

export function execute(query, variables = null, name = null) {
	return gqlc
		.query(query, variables)
		.then(res => {
			if (name === null) {
				name = parseQueryName(query);
			}

			console.log("execute " + name + " result: ", res);
			if (res.data && res.statusCode === 200) {
				if (res.data.errors) {
					let err1 = res.data.errors[0];
					if (
						err1.message === "You do not have permission to perform this action"
					) {
						console.log("need login");
						return uni.navigateTo({ url: "/pages/login/login" });
					} else {
						console.error("gql error: ", res);
						return Promise.reject(err1);
					}
				}
				if (name) {
					return res.data.data[name];
				} else {
					return res.data.data;
				}
			} else if (res.statusCode === 400) {
				let err = res.data.errors;
				console.error("execute 400 faile: ", err);
				Promise.reject(err);
			} else {
				console.error("execute failed with other code: ", res);
				Promise.reject(res);
			}
		})
		.catch(err => {
			console.error("execute gql failed: ", err);
			Promise.reject(err);
		});
}

export function mutate_without_result(query, variables, name) {
	return execute(query, variables, name).then(res => {
		console.log("mutate " + name + " without result: ", res);
		if (res.success) {
			return name + ":ok";
		} else {
			Promise.reject(res.message);
		}
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

function parseQueryName(query) {
	var r = parse(query);
	var selections = r.definitions[0].selectionSet.selections;
	if (selections.length === 1) {
		return selections[0].name.value;
	} else {
		return null;
	}
}
