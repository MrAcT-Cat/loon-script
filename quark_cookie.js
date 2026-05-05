// 夸克扫描王定时签到脚本（适配你的接口）
const $ = new Env("夸克扫描王签到");

// 基础配置（和你抓包的接口完全匹配）
const SIGN_URL = "https://scan-order.quark.cn/api/sd6hJds8SIgn/pOcKNmTupWelFare";
const UC_PARAM_STR = "vesvutkpfrcgprospc";
const VERSION = "10.4.0.2812";
const USER_AGENT = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X; zh-cn) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/22B83 Quark/10.4.0.2812 Scanking/10.4.0.2812";
const COOKIE = $.read("QuarkScan_FullCookie") || "";

// 生成请求参数（和App逻辑一致）
const timestamp = Date.now().toString();
const urlWithParams = `${SIGN_URL}?uc_param_str=${UC_PARAM_STR}&timestamp=${timestamp}&ve=${VERSION}&sv=app`;

// 发送签到请求
$httpClient.post({
  url: urlWithParams,
  headers: {
    "User-Agent": USER_AGENT,
    "Cookie": COOKIE,
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
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