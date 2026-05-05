// 夸克签到（最终版）
const storeKey = "quark_sign_account_v2";

function notify(t, s) {
  $notification.post("夸克签到", t, s);
}

const raw = $persistentStore.read(storeKey);

if (!raw) {
  notify("❌ 未获取参数", "请先抓包");
  $done();
}

const info = JSON.parse(raw);

$httpClient.post({
  url: info.url,
  headers: {
    "User-Agent": info.headers["User-Agent"] || info.headers["user-agent"],
    "Cookie": info.headers["Cookie"] || info.headers["cookie"],
    "Content-Type": "application/json"
  },
  body: info.body   // ⭐用真实body
}, (err, resp, data) => {

  if (err) {
    notify("❌ 请求失败", JSON.stringify(err));
    return $done();
  }

  try {
    const res = JSON.parse(data);

    if (res.code === 0) {
      notify("✅ 签到成功", res.msg || "完成");
    } else {
      notify("❌ 失败", res.msg || data);
    }

  } catch (e) {
    notify("❌ 解析失败", data);
  }

  $done();
});