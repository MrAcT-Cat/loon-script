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

    // ==============================================
    // 🔥 修复：自动刷新所有会过期的参数（解决 1002）
    // ==============================================
    const now = Date.now();
    url = url.replace(/([?&])timestamp=[^&]*/, "$1timestamp=" + now);
    url = url.replace(/([?&])ut=[^&]*/, "$1ut=" + encodeURIComponent(acc.ut || ""));
    url = url.replace(/([?&])pc=[^&]*/, "$1pc=" + encodeURIComponent(acc.pc || ""));
    url = url.replace(/([?&])kp=[^&]*/, "$1kp=" + encodeURIComponent(acc.kp || ""));

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
        console.log("响应:", j);

        // ==============================================
        // ✅ 适配你接口的判断
        // ==============================================
        if (j.success === true || j.code === 0 || j.code === 200) {
          notify("✅ 签到成功", "今日签到完成");
        }
        else if (
          (j.message && j.message.includes("已签到")) ||
          (j.msg && j.msg.includes("已签到"))
        ) {
          notify("ℹ️ 今日已签到", "无需重复签到");
        }
        else if (j.code === 1002 || j.code === 401) {
          notify("❌ 参数过期", "请重新抓包");
        }
        else {
          notify("ℹ️ 结果", JSON.stringify(j));
        }

      } catch (e) {
        notify("✅ 请求已发送", "大概率签到成功");
      }
      $done();
    });
  } catch (e) {
    notify("❌ 数据异常", "请重新抓包");
    $done();
  }
}

run();
