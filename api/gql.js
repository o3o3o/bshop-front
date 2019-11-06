import store from "@/store";

var { parse } = require("parse-graphql");

console.log("store: ", store);
//console.log(store, store.state.gqlc);

export function execute(query, variables = null, name = null) {
	console.log("store in execute ", store);
	return store.state.gqlc
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

function parseQueryName(query) {
	var r = parse(query);
	var selections = r.definitions[0].selectionSet.selections;
	if (selections.length === 1) {
		return selections[0].name.value;
	} else {
		return null;
	}
}
