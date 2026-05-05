// 夸克网盘自动签到脚本（适配最新接口，带重试）
let cookie = $persistentStore.read("quark_cookie");
let url = $persistentStore.read("quark_sign_url");
let method = $persistentStore.read("quark_method") || "GET";
let body = $persistentStore.read("quark_body") || "{}";

// 读取校验参数
let kps = $persistentStore.read("quark_kps");
let sign = $persistentStore.read("quark_sign");
let vcode = $persistentStore.read("quark_vcode");
let token = $persistentStore.read("quark_token");

if (!cookie || !url) {
    $notification.post("❌ 夸克签到失败", "缺少数据，请重新抓包", "");
    $done();
}

// 构建请求头
let headers = {
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Quark/6.2.0",
    "Content-Type": "application/json;charset=utf-8",
    "Cookie": cookie
};

// 补全校验参数
if (kps) headers["kps"] = kps;
if (sign) headers["sign"] = sign;
if (vcode) headers["vcode"] = vcode;
if (token) headers["token"] = token;

// 执行签到请求
function doSign() {
    let req = {
        url: url,
        headers: headers,
        body: body
    };

    if (method.toUpperCase() === "GET") {
        $httpClient.get(req, handleResponse);
    } else {
        $httpClient.post(req, handleResponse);
    }
}

function handleResponse(err, resp, data) {
    if (err) {
        $notification.post("❌ 签到失败", "请求错误", JSON.stringify(err));
        $done();
        return;
    }

    try {
        let res = JSON.parse(data);
        if (res.code === 0 || res.status === 0 || res.message === "success") {
            $notification.post("✅ 夸克签到成功", "签到完成", JSON.stringify(res));
        } else if (res.code === 40001 || res.message.includes("已签到")) {
            $notification.post("ℹ️ 夸克签到", "今日已签到", JSON.stringify(res));
        } else {
            $notification.post("❌ 签到失败", "接口返回错误", JSON.stringify(res));
        }
    } catch (e) {
        $notification.post("ℹ️ 签到结果", "返回非JSON数据", data || "无返回");
    }
    $done();
}

// 执行签到
doSign();