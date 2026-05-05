// 夸克扫描王签到脚本（直接复用抓包URL，解决404/1002错误）
const $ = new Env("夸克扫描王签到");

// 读取Cookie和完整URL
const COOKIE = $.read("QuarkScan_FullCookie") || "";
const BASE_URL = $.read("QuarkScan_FullURL") || "";

if (!COOKIE || !BASE_URL) {
    $.notify("❌ 签到失败", "缺少Cookie或URL", "请先打开夸克扫描王触发抓取");
    $.done();
    return;
}

// 动态替换时间戳，其他参数完全不变
const timestamp = Date.now().toString();
// 把BASE_URL里的旧timestamp替换成新的
const SIGN_URL = BASE_URL.replace(/timestamp=\d+/, `timestamp=${timestamp}`);

// 请求头和抓包完全一致
const headers = {
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X; zh-cn) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/22B83 Quark/10.4.0.2812 Scanking/10.4.0.2812",
    "Cookie": COOKIE,
    "Content-Type": "application/json",
    "Accept": "application/json"
};

// 发送请求
$httpClient.post({
    url: SIGN_URL,
    headers: headers,
    body: JSON.stringify({})
}, function(error, response, data) {
    if (error) {
        $.notify("❌ 签到失败", "请求错误", error);
        $.done();
        return;
    }

    try {
        const res = JSON.parse(data);
        if (res.code === 0) {
            const todaySign = res.data.signWelfare.find(item => item.signed === true);
            const contDays = res.data.contNum;

            if (todaySign) {
                const reward = todaySign.welfare.coin > 0 ? `${todaySign.welfare.coin}积分` : todaySign.welfare.awardName;
                $.notify("✅ 签到成功", `连续签到${contDays}天`, `获得奖励：${reward}`);
            } else {
                $.notify("⚠️ 今日已签到", "无需重复操作", `当前连续签到${contDays}天`);
            }
        } else {
            $.notify("❌ 签到失败", `错误码：${res.code}`, res.msg);
        }
    } catch (e) {
        $.notify("❌ 解析失败", "JSON错误", e.message);
    }
    $.done();
});

// Loon环境兼容
function Env(name) {
    return new class {
        constructor(name) { this.name = name; }
        notify(title, subtitle, content) { $notification.post(title, subtitle, content); }
        read(key) { return $persistentStore.read(key); }
        done() { $done(); }
    }(name);
}