// 夸克扫描王定时签到脚本
const $ = new Env("夸克扫描王签到");

// 读取抓包脚本保存的Cookie
const COOKIE_KEY = "QuarkScan_FullCookie";
const cookie = $.read(COOKIE_KEY);

// 抓取的完整签到链接
const FULL_URL = "https://scan-order.quark.cn/api/sd6hJds8SIgn/pOcKNmTupWelFare?uc_param_str=vesvutkpfrcgprospc&timestamp=177976371382&ve=10.4.0.2812&sv=app&ut=LuFw5fJHq%2b1UkEW%2fgiQ2uyJERq2m4Ne22FnUZUJ28Hbq7w%3d%3d&kp=LuHk%2fFzQlrif6ObX68djri3lvw2ilwn9cBIWZ%2bVDbqQWK4sYTP88gJrIHOf7xy37D%2bcMQaIX1bbHsb%2fFLB9GGvQFOQcImg4LvUO01dZHJUGySw%3d%3d&fr=iphone&cg=default&pr=scanking&os=18.1&pc=LuFcCwcrLULIODGxukLE8L175v0tWYYRqjpKV3tnBq%2b%2bGlzCbRfk7i2zUtRz0nD85fg%3d";

// 固定UA
const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X; zh-cn) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/22B83 Quark/10.4.0.2812 Scanking/10.4.0.2812 Mobile";

if (!cookie) {
    $.notify("❌ 签到失败", "Cookie未获取", "请打开夸克APP，开启抓包开关，进入签到页面抓包");
    $.done();
}

$httpClient.post({
    url: FULL_URL,
    headers: {
        "User-Agent": UA,
        "Cookie": cookie,
        "Content-Type": "application/json",
        "Accept": "*/*",
        "Origin": "https://scank.quark.cn",
        "Referer": "https://scank.quark.cn/"
    },
    body: JSON.stringify({})
}, function(error, response, data) {
    if (error) {
        $.notify("❌ 签到失败", "请求错误", JSON.stringify(error));
        $.done();
        return;
    }

    try {
        const res = JSON.parse(data);
        if (res.code === 0) {
            const todaySign = res.data?.signWelfare?.find(item => item.signed === true);
            const contDays = res.data?.contDays || 0;

            if (todaySign) {
                const reward = todaySign.welfareCoin > 0 ? `${todaySign.welfareCoin}积分` : todaySign.welfareName || "签到奖励";
                $.notify("✅ 签到成功", `连续签到${contDays}天`, `获得奖励：${reward}`);
            } else {
                $.notify("⚠️ 今日已签到", "无需重复操作", `当前连续签到${contDays}天`);
            }
        } else {
            $.notify("❌ 签到失败", `错误码：${res.code}`, res.msg || "参数校验失败，请重新抓包");
        }
    } catch (e) {
        $.notify("❌ 签到失败", "解析错误", e.message);
    }
    $.done();
});

// Loon 兼容
function Env(name) {
    return new class {
        constructor(name) {
            this.name = name;
        }
        notify(title, subtitle, content) {
            $notification.post(title, subtitle, content);
        }
        read(key) {
            return $persistentStore.read(key);
        }
        done() {
            $done({});
        }
    }(name);
}