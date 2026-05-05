const scriptName = "夸克签到";
const storeKey = "quark_sign_account_v1";

function loadStore() {
  const raw = $persistentStore.read(storeKey);
  return raw ? JSON.parse(raw) : null;
}

function notify(t, b) {
  $notification.post(scriptName, t, b);
}

function doSign() {
  const account = loadStore();

  if (!account) {
    notify("❌ 失败", "没抓到参数");
    return $done();
  }

  $httpClient.post({
    url: account.url,
    headers: {
      "User-Agent": account.headers["User-Agent"],
      "Cookie": account.headers["Cookie"],
      "Content-Type": "application/json"
    },
    body: account.body   // ✅ 核心
  }, (err, resp, data) => {

    console.log("返回：", data);

    if (err) {
      notify("❌ 请求异常", JSON.stringify(err));
      return $done();
    }

    try {
      const res = JSON.parse(data);

      if (res.code === 0) {
        notify("✅ 成功", "签到完成");
      } else {
        notify("❌ 失败", res.msg);
      }

    } catch (e) {
      notify("❌ 解析失败", data);
    }

    $done();
  });
}

doSign();