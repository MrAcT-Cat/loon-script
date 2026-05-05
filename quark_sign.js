const storeKey = "quark_scan_data";

function notify(title, body) {
  $notification.post("夸克扫描王", title, body);
}

function run() {
  const raw = $persistentStore.read(storeKey);
  if (!raw) {
    notify("❌ 未获取参数", "请先打开抓包进入签到页");
    return $done();
  }

  try {
    const acc = JSON.parse(raw);
    let url = acc.url;
    const headers = acc.headers;
    const body = acc.body || "{}";

    // 自动刷新时间戳
    url = url.replace(/([?&])timestamp=[^&]*/, "$1timestamp=" + Date.now());

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

        // 只处理签到接口的响应
        if (j.data?.signWelfare) {
          const contNum = j.data.contNum || 0;
          const validCoins = j.data.validCoins || 0;
          const todaySigned = j.data.signWelfare?.[0]?.signed || false;
          const todayCoin = j.data.signWelfare?.[0]?.welfare?.coin || 0;

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
          // 非签到接口的响应，不弹原始数据
          console.log("DEBUG: 非签到接口响应", j);
          notify("ℹ️ 非签到请求", "已跳过无效响应");
        }
      } catch (e) {
        console.log("【DEBUG】解析错误:", e.message);
        console.log("【DEBUG】完整响应:", data);
        notify("❌ 解析失败", "请查看Loon日志获取详细信息");
      }
      $done();
    });
  } catch (e) {
    notify("❌ 数据异常", "请重新抓包");
    $done();
  }
}

run();
