const scriptName = "夸克扫描王抓包";
const storeKey = "quark_scan_data";

function notify(title, body) {
    $notification.post(scriptName, title, body);
}

if ($request && $request.url.includes("scan-order.quark.cn") && $request.url.includes("WelFare")) {
    let data = {
        url: $request.url,
        headers: $request.headers,
        body: $request.body,
        ut: extractParam($request.url, "ut"),
        pc: extractParam($request.url, "pc"),
        kp: extractParam($request.url, "kp"),
        ts: Date.now()
    };
    $persistentStore.write(JSON.stringify(data), storeKey);
    notify("✅ 抓取成功", "已保存全部参数");
}

function extractParam(url, key) {
    const regex = new RegExp(`[?&]${key}=([^&]*)`, "i");
    const match = url.match(regex);
    return match ? decodeURIComponent(match[1]) : "";
}

$done({});
