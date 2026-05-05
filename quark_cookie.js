// 夸克扫描王 Cookie & URL 抓取脚本
const STORAGE_KEY = "QuarkScan_FullCookie";
const URL_KEY = "QuarkScan_FullURL";

// 保存完整Cookie
const cookie = $request.headers["Cookie"] || $request.headers["cookie"] || "";
if (cookie) {
    $persistentStore.write(cookie, STORAGE_KEY);
    console.log("✅ Cookie已保存：" + cookie);
}

// 同时保存完整URL，包括所有参数
const fullUrl = $request.url;
if (fullUrl) {
    $persistentStore.write(fullUrl, URL_KEY);
    console.log("✅ 完整URL已保存：" + fullUrl);
}

$notification.post("夸克捕获", "Cookie和URL都已抓取成功", "可以直接用完整URL签到了");
$done({});