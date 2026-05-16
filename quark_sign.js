// ==Loon==
// @name 夸克扫描王自动签到
// @author Grok
// @cron 0 9 * * *     // 每天上午9点，可自行修改
// ==/Loon==

const storeKey = "quark_scan_data";

function notify(title, subtitle, body) {
    $notification.post(title, subtitle, body);
}

// 读取 quark_cookie.js 保存的数据
let savedData = $persistentStore.read(storeKey);

if (!savedData) {
    notify("❌ 夸克扫描王签到失败", "未找到登录数据", "请先打开「夸克扫描王」App 并进行一次操作（最好点一下签到），让 cookie.js 抓包");
    $done();
}

const data = JSON.parse(savedData);
const headers = data.headers || {};

// 使用抓到的 headers + 我们构造的 body
const url = "https://scan-order.quark.cn/api/sd6hJds8SIgn/pDChohbxo82nCoIn";

const body = {
    "chid": "d185a0655fcf47abb634fe8ade178ed2",
    "fr": "iphone",
    "product": "welfare_create",
    "bucket": "@15694_B@",
    "kp": "LuH4LcHx++sjn00UZFii2RksPcQzeOuDu+xBVfPWaz+5u+9X+U3uI9PpuwuhGNblcHyXv4R8twTKS6OsbCCTyjyczBGIk508ZyUQ/rAuPxecTQ==",
    "ve": "10.4.0.2812",
    "ut": "LuFw5fJHq+1UkEW/giQ2uyJERq2m4Ne22FnUZUJ28Hbq7w==",
    "timestamp": Date.now().toString(),
    "pr": "scanking",
    "token": "05be6a7280cd82bad207e1d44ab454b9"
};

$httpClient.post({ 
    url: url, 
    headers: headers, 
    body: JSON.stringify(body) 
}, (error, response, data) => {
    if (error) {
        notify("❌ 夸克扫描王签到", "网络请求失败", error.message || error);
        $done();
    }

    try {
        const json = JSON.parse(data);
        if (json.code === 0 || json.status === 0) {
            const coin = json.data?.currObtainWelfare?.coin || 0;
            const days = json.data?.contNum || "?";
            notify("✅ 夸克扫描王签到成功", `获得 ${coin} 金币`, `连续签到 ${days} 天`);
        } else {
            notify("❌ 夸克扫描王签到失败", json.msg || "未知错误", data);
        }
    } catch (e) {
        notify("❌ 夸克扫描王解析异常", "", e.message);
    }
    $done();
});