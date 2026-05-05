// 夸克扫描王 Loon抓包获取脚本 对齐PingMe写法
const scriptName = "夸克参数获取";
const storeKey = "quark_sign_account_v1";

function normalizeHeaderNameMap(headers) {
  const out = {};
  Object.keys(headers || {}).forEach(k => out[k] = headers[k]);
  return out;
}

function saveStore(obj) {
  $persistentStore.write(JSON.stringify(obj), storeKey);
}

function notify(title, body) {
  $notification.post(scriptName, title, body);
}

// 抓包入口 拦截http-request请求
if ($request) {
  const headersMap = normalizeHeaderNameMap($request.headers || {});

  const captureData = {
    url: $request.url,
    headers: headersMap,
    updatedAt: Date.now()
  };

  saveStore(captureData);
  notify("✅ 签到参数抓取成功", "已自动保存，可关闭获取开关");
  
  $done({});
}