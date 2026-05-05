// 夸克扫描王签到脚本（dTUYf接口稳定版）
const scriptName = "夸克签到";
const storeKey = "quark_sign_account_v1";

// 读取缓存
function loadStore() {
  const raw = $persistentStore.read(storeKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

// 通知
function notify(title, body) {
  $notification.post(scriptName, title, body);
}

// 精简请求头（关键优化）
function getHeaders(info) {
  return {
    "User-Agent": info.headers["User-Agent"] || info.headers["user-agent"],
    "Cookie": info.headers["Cookie"] || info.headers["cookie"],
    "Content-Type": "application/json"
  };
}

// 核心签到逻辑
function doSign() {
  const account = loadStore();

  if (!account) {
    notify("❌ 签到失败", "未抓取参数，请打开抓包进入签到页");
    return $done();
  }

  // 参数有效期提示（6小时）
  const diff = Date.now() - account.updatedAt;
  if (diff > 6 * 60 * 60 * 1000) {
    notify("⚠️ 参数可能过期", "建议重新打开夸克签到页刷新");
  }

  const url = account.url; // ❗不再拼接参数
  const headers = getHeaders(account);

  $httpClient.post({
    url: url,
    headers: headers,
    body: JSON.stringify({})
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
        notify("✅ 签到成功", res.msg || "夸克每日签到完成");
      } else if (res.code === 1002) {
        notify("❌ 签到失败", "参数过期，请重新抓包");
      } else {
        notify("❌ 签到失败", res.msg || JSON.stringify(res));
      }

    } catch (e) {
      notify("❌ 解析失败", data);
    }

    $done();
  });
}

// 执行
doSign();