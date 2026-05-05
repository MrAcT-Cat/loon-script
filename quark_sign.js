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

    // 自动刷新时间戳（适配可能的参数名）
    url = url.replace(/([?&])(timestamp|ts)=[^&]*/, "$1$2=" + Date.now());

    // 清理无效请求头，保留关键字段
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

        // 适配你当前的接口响应
        if (j.code === 0 && j.msg === "成功") {
          const contNum = j.data?.contNum || 0;
          const validCoins = j.data?.validCoins || 0;
          const todaySigned = j.data?.signWelfare?.[0]?.signed || false;
          const todayCoin = j.data?.signWelfare?.[0]?.welfare?.coin || 0;

          if (todaySigned) {
            notify("ℹ️ 今日已签到", `连续签到 ${contNum} 天\n当前金币：${validCoins}`);
          } else {
            notify("✅ 签到成功", `连续签到 ${contNum} 天\n获得 ${todayCoin} 金币\n当前金币：${validCoins}`);
          }
        } else if (j.msg?.includes("已签到")) {
          notify("ℹ️ 今日已签到", "无需重复签到");
        } else if (j.code === 1002) {
          notify("❌ 参数过期", "请重新抓包");
        } else {
          console.log("DEBUG 响应:", j);
          notify("❌ 签到失败", "接口响应异常，请查看日志");
        }
      } catch (e) {
        console.log("DEBUG 解析错误:", e.message, data);
        notify("❌ 解析失败", "接口格式已变更");
      }
      $done();
    });
  } catch (e) {
    notify("❌ 数据异常", "请重新抓包");
    $done();
  }
}

run();
