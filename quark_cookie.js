const scriptName = "夸克扫描王抓包";
const storeKey = "quark_scan_data";

function notify(title, body) {
    $notification.post(scriptName, title, body);
}

// 只抓取签到接口
if ($request && $request.url.includes("scan-order.quark.cn") && $request.url.includes("WelFare")) {
    let data = {
        url: $request.url,
        headers: $request.headers,
        body: $request.body,
        ts: Date.now()
    };
    $persistentStore.write(JSON.stringify(data), storeKey);
    notify("✅ 抓取成功", "签到参数已保存");
}

$done({});
