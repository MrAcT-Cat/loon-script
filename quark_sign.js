const storeKey = "quark_scan_data";

function notify(title, body) {
  $notification.post("夸克扫描王", title, body);
}

function run() {
  const raw = $persistentStore.read(storeKey);
  if (!raw) {
    notify("❌ 未获取参数", "请先打开夸克签到页抓包");
    return $done();
  }

  try {
    const acc = JSON.parse(raw);
    let url = acc.url;
    const headers = acc.headers;
    const body = acc.body || "{}";

    // 自动刷新时间戳
    url = url.replace(/([?&])(timestamp|ts)=[^&]*/, "$1$2=" + Date.now());

    // 清理无效请求头
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
        const j = JSON.parse(data);
        console.log("签到响应:", j);

        // ======================
        // 适配你接口的响应格式
        // ======================
        if (j.success === true || j.code === 200 || j.status === 0) {
          notify("✅ 签到成功", "今日签到完成 🎉");
        }
        else if (
          (j.message && j.message.includes("已签到")) ||
          (j.msg && j.msg.includes("已签到"))
        ) {
          notify("ℹ️ 今日已签到", "无需重复签到");
        }
        else if (j.code === 1002 || j.code === 401 || j.code === 403) {
          notify("❌ 参数过期", "请重新抓包更新");
        }
        else {
          notify("❌ 签到失败", "响应异常：" + JSON.stringify(j));
        }

      } catch (e) {
        notify("✅ 签到请求发送成功", "可能已签到，可手动查看");
      }
      $done();
    });
  } catch (e) {
    notify("❌ 数据异常", "请重新抓包");
    $done();
  }
}

run();
