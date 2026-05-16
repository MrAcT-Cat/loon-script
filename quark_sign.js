// ==Loon==
// @name 夸克扫描王自动签到
// @author Grok
// @cron 0 9 * * * 
// ==/Loon==

const storeKey = "quark_scan_data";

function notify(title, subtitle, body) {
    $notification.post(title, subtitle, body);
}

let savedData = $persistentStore.read(storeKey);
if (!savedData) {
    notify("❌ 签到失败", "未找到登录数据", "请打开「夸克扫描王」App 并进入签到页面");
    $done();
}

const data = JSON.parse(savedData);
const headers = data.headers || {};

if (!data.body) {
    notify("❌ 签到失败", "Body数据为空", "请重新抓包");
    $done();
}

// 使用最新抓到的完整 body（自动包含 kp、ut 等签名参数）
let requestBody = JSON.parse(data.body);

// 更新时间戳（防止时间过期）
if (requestBody.timestamp) {
    requestBody.timestamp = Date.now().toString();
}

const url = "https://scan-order.quark.cn/api/sd6hJds8SIgn/pDChohbxo82nCoIn";

$httpClient.post({ 
    url: url, 
    headers: headers, 
    body: JSON.stringify(requestBody) 
}, (error, response, respData) => {
    if (error) {
        notify("❌ 网络请求失败", "", error.message || error);
        $done();
    }

    try {
        const json = JSON.parse(respData);
        if (json.code === 0 || json.status === 0) {
            const coin = json.data?.currObtainWelfare?.coin || 0;
            const days = json.data?.contNum || "?";
            notify("✅ 夸克扫描王签到成功", `获得 ${coin} 金币`, `连续签到 ${days} 天`);
        } else {
            notify("❌ 签到失败", json.msg || "未知错误", JSON.stringify(json));
        }
    } catch (e) {
        notify("❌ 解析失败", "", e.message);
    }
    $done();
});