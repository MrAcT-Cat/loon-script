// 夸克扫描王 抓包脚本（完整版）
const scriptName = "夸克参数获取";
const storeKey = "quark_sign_account_v1";

function saveStore(obj) {
  $persistentStore.write(JSON.stringify(obj), storeKey);
}

function notify(title, body) {
  $notification.post(scriptName, title, body);
}

if ($request) {

  const captureData = {
    url: $request.url,
    headers: $request.headers,
    body: $request.body || "",   // ✅ 关键：保存请求体
    updatedAt: Date.now()
  };

  saveStore(captureData);

  notify("✅ 抓取成功", "签到参数 + 请求体已保存");

  console.log("====== 抓包数据 ======");
  console.log(JSON.stringify(captureData));

  $done({});
}