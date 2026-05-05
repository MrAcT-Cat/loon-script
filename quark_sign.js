// 夸克扫描王 Loon标准签到脚本 对标PingMe语法
const scriptName = "夸克签到";
const storeKey = "quark_sign_account_v1";

// 读取本地缓存账号参数
function loadStore() {
  const raw = $persistentStore.read(storeKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

// Loon系统通知
function notify(title, body) {
  $notification.post(scriptName, title, body);
}

// 拼接带动态时间戳请求链接
function buildUrl(info) {
  const baseUrl = info.url.split("?")[0];
  const query = info.url.split("?")[1];
  const timestamp = Date.now();
  return `${baseUrl}?${query}&timestamp=${timestamp}`;
}

// 清洗请求头，适配Loon规范
function getHeaders(info) {
  const headers = {...info.headers};
  delete headers[":method"];
  delete headers[":path"];
  delete headers[":scheme"];
  delete headers["Content-Length"];
  return headers;
}

// 核心签到逻辑
async function doSign() {
  const account = loadStore();
  if (!account) {
    notify("签到失败", "未抓取账号参数，请打开抓包开关进入夸克签到页");
    return $done();
  }

  const url = buildUrl(account);
  const headers = getHeaders(account);

  $httpClient.post({
    url: url,
    headers: headers,
    body: JSON.stringify({})
  }, (err, resp, data) => {
    if (err) {
      notify("签到请求异常", JSON.stringify(err));
      return $done();
    }
    try {
      const res = JSON.parse(data);
      if (res.code === 0) {
        notify("签到成功", "夸克每日签到完成");
      } else if (res.code === 1002) {
        notify("签到失败 1002", "参数过期，重新打开抓包刷新参数");
      } else {
        notify("签到失败", res.msg || "未知错误");
      }
    } catch (e) {
      notify("返回数据解析失败", e.message);
    }
    $done();
  });
}

// 入口：定时Cron自动执行
doSign();