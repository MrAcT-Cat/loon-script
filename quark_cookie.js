// 夸克网盘Cookie&签到请求捕获脚本（适配最新接口）
let url = $request.url;
let method = $request.method;
let headers = $request.headers;
let body = $request.body || "";

// 兼容Cookie大小写
let cookie = headers.Cookie || headers.cookie;

if (cookie) {
    $persistentStore.write(cookie, "quark_cookie");
}

// 匹配夸克签到相关接口
if (url.includes("/clouddrive/capacity/growth/info") || 
    url.includes("/clouddrive/capacity/growth/sign") ||
    url.includes("/clouddrive/user/get")) {

    // 保存关键请求信息
    $persistentStore.write(url, "quark_sign_url");
    $persistentStore.write(method, "quark_method");
    $persistentStore.write(body, "quark_body");

    // 保存校验参数
    let kps = headers.kps || headers.Kps;
    let sign = headers.sign || headers.Sign;
    let vcode = headers.vcode || headers.Vcode;
    let token = headers.token || headers.Token;

    if (kps) $persistentStore.write(kps, "quark_kps");
    if (sign) $persistentStore.write(sign, "quark_sign");
    if (vcode) $persistentStore.write(vcode, "quark_vcode");
    if (token) $persistentStore.write(token, "quark_token");

    $notification.post("✅ 夸克捕获成功", "已保存Cookie+签到请求", "");
}

$done({});