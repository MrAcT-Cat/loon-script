// 夸克扫描王 Cookie 自动抓取 & 拼接脚本（完整版）
const STORAGE_KEY = "QuarkScan_FullCookie";

// 1. 从请求头读取 Cookie（兼容大小写）
let rawCookie = $request.headers["Cookie"] || $request.headers["cookie"] || "";

// 2. 把 Cookie 拆分成多个键值对
const cookieParts = rawCookie.split(/;\s*/).filter(part => part.trim());

// 3. 去重 + 拼接成完整的 Cookie 字符串
const uniqueCookieParts = [...new Set(cookieParts)];
const fullCookie = uniqueCookieParts.join("; ");

// 4. 保存到 Loon 持久化存储
if (fullCookie) {
    $persistentStore.write(fullCookie, STORAGE_KEY);
    console.log("✅ Cookie 拼接完成，共 " + uniqueCookieParts.length + " 个字段");
    $notification.post("夸克Cookie", "抓取成功", `已保存完整Cookie（${uniqueCookieParts.length}个字段）`);
} else {
    console.log("❌ 未从请求头中读取到 Cookie");
    $notification.post("夸克Cookie", "抓取失败", "请求头中无Cookie字段");
}

$done({});