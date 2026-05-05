// 夸克扫描王 Cookie & 完整URL 抓取脚本
const STORAGE_KEY = "QuarkScan_FullCookie";
const URL_KEY = "QuarkScan_FullURL";

// 保存Cookie
const cookie = $request.headers["Cookie"] || $request.headers["cookie"] || "";
if (cookie) {
    $persistentStore.write(cookie, STORAGE_KEY);
    console.log("✅ Cookie已保存：" + cookie);
}

// 关键修复：保存完整的带参URL，而不是裸地址
const fullUrl = $request.url;
if (fullUrl) {
    $persistentStore.write(fullUrl, URL_KEY);
    console.log("✅ 完整带参URL已保存：" + fullUrl);
}

$notification.post("夸克捕获", "Cookie和带参URL都已抓取成功", "现在可以直接用完整URL签到了");
$done({});