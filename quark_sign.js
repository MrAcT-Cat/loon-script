const scriptName = "夸克签到";
const storeKey = "quark_scan_data";

function notify(title, body) {
  $notification.post(scriptName, title, body);
}

function run() {
  let raw = $persistentStore.read(storeKey);
  if (!raw) {
    notify("❌ 未抓取参数", "请先打开抓包进入签到页");
    return $done();
  }

  try {
    let acc = JSON.parse(raw);
    let url = acc.url;
    let headers = acc.headers;
    let body = acc.body || "{}";

    // 自动更新时间戳 → 解决1002
    url = url.replace(/([?&])timestamp=[^&]*/, "$1timestamp=" + Date.now());

    // 清理无用请求头
    delete headers[":method"];
    delete headers[":path"];
    delete headers[":scheme"];
    delete headers["Content-Length"];
    delete headers["content-length"];

    $httpClient.post({ url, headers, body }, (err, resp, data) => {
      if (err) {
        notify("❌ 请求失败", err.message || "网络异常");
        return $done();
      }

      try {
        let j = JSON.parse(data);
        if (j.code === 0) {
          notify("✅ 签到成功", "完成");
        } else if (j.code === 1002) {
          notify("❌ 参数过期", "请重新抓包");
        } else {
          notify("⚠️ 结果", j.msg || "未知错误");
        }
      } catch (e) {
        notify("❌ 解析失败", "数据异常");
      }
      $done();
    });
  } catch (e) {
    notify("❌ 数据异常", "重新抓包即可");
    $done();
  }
}

run();
