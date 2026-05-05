// 夸克扫描王签到脚本（直接复用抓包完整URL，解决404/1002错误）
const $ = new Env("夸克扫描王签到");

// 读取抓取到的Cookie和URL
const COOKIE = $.read("QuarkScan_FullCookie") || "";
const BASE_URL = $.read("QuarkScan_FullURL") || "";

if (!COOKIE || !BASE_URL) {
    $.notify("❌ 签到失败", "缺少Cookie或URL", "请先打开夸克扫描王触发一次签到抓取");
    $.done();
    return;
}

// 关键修复：直接拼接你抓包时的所有校验参数，只动态替换时间戳
const timestamp = Date.now().toString();
// 把你抓包时的参数补全，这里用你日志里的真实参数格式
const FULL_URL = `${BASE_URL}?uc_param_str=vesvutkpfrcgprospc&timestamp=${timestamp}&ve=10.4.0.2812&sv=app`;

// 请求头和你抓包的完全一致
const headers = {
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X; zh-cn) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/22B83 Quark/10.4.0.2812 Scanking/10.4.0.2812",
    "Cookie": COOKIE,
    "Content-Type": "application/json",
    "Accept": "application/json"
};

// 发送签到请求
$httpClient.post({
    url: FULL_URL,
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
            // 适配你提供的JSON响应字段
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