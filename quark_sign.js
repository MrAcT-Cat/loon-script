// 夸克扫描王签到脚本（最终稳定版）
const scriptName = "夸克签到";
const storeKey = "quark_sign_account_v1";

function loadStore() {
  const raw = $persistentStore.read(storeKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function notify(title, body) {
  $notification.post(scriptName, title, body);
}

function getHeaders(info) {
  return {
    "User-Agent": info.headers["User-Agent"] || info.headers["user-agent"],
    "Cookie": info.headers["Cookie"] || info.headers["cookie"],
    "Content-Type": "application/json"
  };
}

function doSign() {
  const account = loadStore();

  if (!account) {
    notify("❌ 签到失败", "未抓取参数");
    return $done();
  }

  const diff = Date.now() - account.updatedAt;
  if (diff > 6 * 60 * 60 * 1000) {
    notify("⚠️ 参数可能过期", "建议重新抓包");
  }

  $httpClient.post({
    url: account.url,
    headers: getHeaders(account),
    body: account.body   // ✅ 使用真实请求体
  }, (err, resp, data) => {

    console.log("====== 返回数据 ======");
    console.log(data);

    if (err) {
      notify("❌ 请求异常", JSON.stringify(err));
      return $done();
    }

    try {
      const res = JSON.parse(data);

      if (res.code === 0) {
        notify("✅ 签到成功", res.msg || "签到完成");
      } else if (res.code === 1002) {
        notify("❌ 参数过期", "请重新抓包");
      } else {
        notify("❌ 签到失败", res.msg || JSON.stringify(res));
      }

    } catch (e) {
      notify("❌ 解析失败", data);
    }

    $done();
  });
}

doSign();