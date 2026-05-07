const scriptName = "夸克扫描王抓包";
const storeKey = "quark_scan_data";

function notify(title, body) {
  $notification.post(scriptName, title, body);
}

function getHeader(headers, key) {
  return headers[key] || headers[key.toLowerCase()] || "";
}

if (
  typeof $request !== "undefined" &&
  $request.method === "POST" &&
  $request.url.includes("pDChohbxo82nCoIn")
) {

  const headers = $request.headers || {};
  const body = $request.body || "";

  // body 太短直接忽略
  if (body.length < 50) {
    notify("⚠️ 抓包失败", "请求体异常");
    $done({});
    return;
  }

  // 保存关键请求数据
  const data = {
    url: $request.url,
    method: $request.method,
    headers: {
      "Content-Type": getHeader(headers, "Content-Type"),
      "User-Agent": getHeader(headers, "User-Agent"),
      "Cookie": getHeader(headers, "Cookie")
    },
    body: body,
    updateTime: new Date().toLocaleString()
  };

  // 写入本地
  const success = $persistentStore.write(
    JSON.stringify(data),
    storeKey
  );

  if (success) {
    notify(
      "✅ 夸克参数更新成功",
      "签到参数已保存"
    );
  } else {
    notify(
      "❌ 保存失败",
      "persistentStore 写入失败"
    );
  }
}

$done({});