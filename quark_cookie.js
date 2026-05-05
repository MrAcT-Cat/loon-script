// 夸克扫描王 Cookie 自动抓取 & 拼接脚本
const STORAGE_KEY = "QuarkScan_FullCookie";

// 从请求头提取Cookie字段
const rawCookies = [];
for (const key in $request.headers) {
    if (key.toLowerCase() === "cookie") {
        // 拆分并处理Cookie字段
        const cookieParts = $request.headers[key].split(/;\s*/);
        rawCookies.push(...cookieParts);
    }
}

// 去重、过滤空值，拼接成完整Cookie
const uniqueCookies = [...new Set(rawCookies.filter(part => part.trim()))];
const fullCookie = uniqueCookies.join("; ");

// 保存到Loon持久化存储并通知
if (fullCookie) {
    $persistentStore.write(fullCookie, STORAGE_KEY);
    console.log("✅ 夸克扫描王Cookie更新成功，共", uniqueCookies.length, "个字段");
    $notification.post("夸克Cookie", "抓取成功", `已保存完整Cookie（${uniqueCookies.length}个字段）`);
}

$done({});