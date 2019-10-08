// import { transferPay } from "@/api/wallet";

var parse = require("url-parse");
var queryString = require("query-string");

function preTransfer(s) {
	return s;
	/*
	let query = queryString.parse(s);
	console.log("preTransfer: query, ", query);
	return {
		vendorId: query.vendorId,
		vendorName: query.vendorName
	};
	*/
}

var qrRouter = {
	pay: preTransfer
};

export function handelQr(s) {
	let parsed = parse(s);
	if (parsed.protocol !== "bshop:") {
		return;
	}
	return qrAction(parsed.hostname, parsed.query);
}

export function qrAction(action, query) {
	if (action in qrRouter === false) {
		return;
	}
	return qrRouter[action](query);
}
