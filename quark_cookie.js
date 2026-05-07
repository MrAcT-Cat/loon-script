const storeKey = "quark_scan_data";

function notify(title, body) {
  $notification.post("夸克抓包", title, body);
}

function getHeader(headers, key) {
  return headers[key] || headers[key.toLowerCase()] || "";
}

if ($request && $request.method === "POST") {

  const url = $request.url;

  if (!url.includes("scan-order.quark.cn")) {
    $done({});
    return;
  }

  const headers = $request.headers || {};
  const body = $request.body || "";

  const cookie = getHeader(headers, "Cookie");

  if (!cookie) {
    notify("⚠️ 没抓到 Cookie", "可能该请求没有携带登录态");
    $done({});
    return;
  }

  const data = {
    url,
    headers: {
      "Content-Type": getHeader(headers, "Content-Type"),
      "User-Agent": getHeader(headers, "User-Agent"),
      "Cookie": cookie
    },
    body,
    time: Date.now()
  };

  $persistentStore.write(JSON.stringify(data), storeKey);

  notify("✅ 抓包成功", "Cookie + body 已保存");
}

$done({});