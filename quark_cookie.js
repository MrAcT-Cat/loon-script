const scriptName = "夸克参数获取";
const storeKey = "quark_sign_account_v1";

if ($request) {

  const data = {
    url: $request.url,
    headers: $request.headers,
    body: $request.body || "",   // ✅ 关键
    updatedAt: Date.now()
  };

  $persistentStore.write(JSON.stringify(data), storeKey);

  console.log("抓到body：", data.body);

  $notification.post(scriptName, "✅ 抓包成功", "已保存完整参数");

  $done({});
}