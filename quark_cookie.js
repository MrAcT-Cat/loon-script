const scriptName = "夸克抓包";
const storeKey = "quark_scan_data";

function notify(title, body) {
  $notification.post(scriptName, title, body);
}

if ($request && $request.method == "POST" && $request.url.includes("uc_param_str=")) {
  let data = {
    url: $request.url,
    headers: $request.headers,
    body: $request.body,
    ts: Date.now()
  };
  $persistentStore.write(JSON.stringify(data), storeKey);
  notify("✅ 抓取成功", "已保存有效签到参数");
}

$done({});
