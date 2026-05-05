// 夸克签到脚本（最终稳定版）
const key = "quark_sign_data";

function notify(title, msg) {
  $notification.post("夸克扫描王", title, msg);
}

const raw = $persistentStore.read(key);

if (!raw) {
  notify("❌ 未抓到参数", "先打开夸克签到页抓一次");
  $done();
}

let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  notify("❌ 数据异常", "重新抓包");
  $done();
}

// 判断是否过期（6小时）
if (Date.now() - data.time > 6 * 60 * 60 * 1000) {
  notify("⚠️ 参数可能过期", "建议重新打开签到页");
}

$httpClient.post({
  url: data.url,
  headers: {
    "User-Agent": data.headers["User-Agent"] || data.headers["user-agent"],
    "Cookie": data.headers["Cookie"] || data.headers["cookie"],
    "Content-Type": "application/json"
  },
  body: data.body
}, (err, resp, body) => {

  if (err) {
    notify("❌ 请求失败", JSON.stringify(err));
    return $done();
  }

  try {
    const res = JSON.parse(body);

    if (res.code === 0) {
      notify("✅ 签到成功", res.msg || "完成");
    } else if (res.code === 1002) {
      notify("❌ 参数过期", "重新抓包");
    } else {
      notify("❌ 签到失败", res.msg || body);
    }

  } catch (e) {
    notify("❌ 返回异常", body);
  }

  $done();
});