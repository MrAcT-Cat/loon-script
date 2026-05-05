// 夸克扫描王专用签到脚本（纯净版，无额外参数）
let cookie = $persistentStore.read("scan_cookie");
let url = $persistentStore.read("scan_sign_url");
let body = $persistentStore.read("scan_body");

if (!cookie || !url) {
    $notification.post("夸克扫描签到", "失败｜未捕获数据", "请先手动签到一次抓包");
    $done();
}

// 仅用抓包时保存的原始Cookie和请求体，不额外添加任何参数
let headers = {
    "Cookie": cookie,
    "Content-Type": "application/json"
};

$httpClient.post({
    url: url,
    headers: headers,
    body: body
}, (err, resp, data) => {
    if (err) {
        $notification.post("夸克扫描签到", "请求失败", JSON.stringify(err));
    } else {
        try {
            let res = JSON.parse(data || "{}");
            if (res.code === 0) {
                $notification.post("夸克扫描签到", "✅ 签到成功", "");
            } else if (res.msg?.includes("已签到") || res.message?.includes("已签到")) {
                $notification.post("夸克扫描签到", "今日已签到", "无需重复签到");
            } else {
                $notification.post("夸克扫描签到", "签到失败", res.msg || res.message || data);
            }
        } catch (e) {
            $notification.post("夸克扫描签到", "返回异常", data);
        }
    }
    $done();
});