const scriptName = "夸克抓包";
const storeKey = "quark_scan_data";

function notify(title, body) {
  $notification.post(scriptName, title, body);
}

// 只匹配签到接口，不匹配 memberInfo
if ($request && $request.method == "POST" && $request.url.includes("/sd6hJds8SIgn/pOcKNmTupWelFare")) {
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
