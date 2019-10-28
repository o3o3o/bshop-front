function showToast(msg, duration = 2500) {
	uni.showToast({
		title: msg,
		icon: "none",
		duration: duration
	});
}

var errMap = {
	wrong_verification_code: "验证码不正确",
	need_verify_phone: "需要短信认证",
	code_been_used: "验证码已失效",
	invalid_phone: "手机号码格式不合法",
	too_much_retry: "尝试次数过多",
	not_vendor: "未入住商户, 不能收款",
	already_exist_payment_password: "支付密码已设置, 请联系客户反馈",
	wrong_password: "密码错误",
	not_enough_balance: "可用余额不足",
	not_enough_balance: "提现失败"
};

function showTip(err, duration = 2500) {
	console.log(err);
	if (typeof err !== "string") {
		showToast(JSON.stringify(err));
		return;
	}
	if (err in errMap) {
		showToast(errMap[err], duration);
	} else {
		showToast(err, duration);
	}
}

function showFailModal(title, err) {
	var msg;
	if (err.message in errMap) {
		msg = errMap[err.message];
	} else {
		msg = JSON.stringify(err);
	}
	uni.showModal({
		title: title,
		content: msg,
		showCancel: false
	});
}

function isNumber(s) {
	let r = new RegExp("\\d{6}");
	return r.test(s);
}

module.exports = {
	showToast: showToast,
	showTip: showTip,
	showFailModal: showFailModal,
	isNumber: isNumber
};
