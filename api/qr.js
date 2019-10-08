// import { transferPay } from "@/api/wallet";

var parse = require("url-parse");
var queryString = require("query-string");

function preTransfer(query) {
	return {
		to: query.vendorId,
		toName: query.vendorName,
		note: "",
		amount: ""
	};
}

var qrRouter = {
	pay: preTransfer
};

export function handelQr(s) {
	let parsed = parse(s);
	if (parsed.protocol !== "bshop") {
		return;
	}
	//let query = queryString.parse(parsed.query);
	return qrAction(parsed.hostname, parsed.query);
}

export function qrAction(action, query) {
	if (action in qrRouter === false) {
		return;
	}
	return qrRouter[action](query);
}
