const scriptName = "夸克扫描王抓包";
const storeKey = "quark_scan_data";

function notify(title, body) {
  $notification.post(scriptName, title, body);
}

// 精准匹配你当前的签到接口域名和路径
if ($request && $request.method === "POST" && $request.url.includes("scan-order.quark.cn")) {
  // 只匹配签到相关接口
  if ($request.url.includes("sign") || $request.url.includes("welfare")) {
    let data = {
      url: $request.url,
      headers: $request.headers,
      body: $request.body,
      ts: Date.now()
    };
    $persistentStore.write(JSON.stringify(data), storeKey);
    notify("✅ 抓包成功", "已保存最新签到参数");
  }
}

$done({});
