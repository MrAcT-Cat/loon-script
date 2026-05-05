// 夸克抓包脚本（最终版）
const key = "quark_sign_data";

if ($request) {
  const data = {
    url: $request.url,
    headers: $request.headers,
    body: $request.body,   // ⭐关键：保存请求体
    time: Date.now()
  };

  $persistentStore.write(JSON.stringify(data), key);

  $notification.post("夸克扫描王", "✅ 抓包成功", "参数已保存");
}

$done({});