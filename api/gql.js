// https://github.com/kqtec/graphql-uni-app-client
import client from "@kqtec/graphql-uni-app-client";

const serverUrl = "http://localhost:8000/api/gql";

export var gqlc = new client({
	uri: serverUrl
});

function execute(query, variables, name) {
	return new Promise((resolve, reject) => {
		gqlc
			.query(query, variables)
			.then(res => {
				console.log("execute: ", res);
				if (res.data && res.statusCode === 200) {
					resolve(res.data.data[name]);
				} else {
					reject(res.data.errMsg);
				}
			})
			.catch(err => reject(err));
	});
}

export function mutate_without_result(query, variables, name) {
	return new Promise((resolve, reject) => {
		execute(query, variables, name)
			.then(res => {
				console.log("mutate without result: ", res);
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
