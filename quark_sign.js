const storeKey = "quark_scan_data";

function notify(title, body) {
  $notification.post("夸克扫描王", title, body);
}

function run() {
  let raw = $persistentStore.read(storeKey);
  if (!raw) {
    notify("❌ 未获取参数", "请先打开抓包进入签到页");
    return $done();
  }

  try {
    let acc = JSON.parse(raw);
    let url = acc.url;
    let headers = acc.headers;
    let body = acc.body || "{}";

    // 自动刷新时间戳
    url = url.replace(/([?&])timestamp=[^&]*/, "$1timestamp=" + Date.now());

    // 清理无用头
    delete headers[":method"];
    delete headers[":path"];
    delete headers[":scheme"];
    delete headers["Content-Length"];
    delete headers["content-length"];

    $httpClient.post({ url, headers, body }, (err, resp, data) => {
      if (err) {
        notify("❌ 请求失败", err.message || "网络异常");
        console.log("【DEBUG】请求错误:", err);
        return $done();
      }

      try {
        // 先把完整响应打出来，方便调试
        console.log("【DEBUG】服务器返回原始数据:", data);
        let j = JSON.parse(data);

        // 优先判断请求是否成功
        if (j.code === 0 || j.status === 0) {
          // 按你真实接口的字段解析
          const contNum = j.data?.contNum || "0";
          const validCoins = j.data?.validCoins || "0";
          const todayCoin = j.data?.signWelfare?.[0]?.welfare?.coin || 0;
          const todaySigned = j.data?.signWelfare?.[0]?.signed || false;

          if (todaySigned) {
            notify("ℹ️ 今日已签到", `连续签到 ${contNum} 天\n当前金币：${validCoins}`);
          } else {
            notify("✅ 签到成功", `连续签到 ${contNum} 天\n获得 ${todayCoin} 金币\n当前金币：${validCoins}`);
          }
        } 
        else if (j.msg?.includes("已签到")) {
          notify("ℹ️ 今日已签到", "无需重复签到");
        }
        else if (j.code === 1002 || j.status === 1002) {
          notify("❌ 参数过期", "请重新抓包");
        }
        else {
          notify("⚠️ 签到状态", `状态码：${j.code || j.status}，提示：${j.msg || "未知"}`);
        }
      } catch (e) {
        // 解析失败时，把错误和原始数据一起打出来
        console.log("【DEBUG】解析错误:", e.message);
        console.log("【DEBUG】导致错误的原始数据:", data);
        notify("❌ 解析失败", "请查看Loon日志获取详细信息");
      }
      $done();
    });
  } catch (e) {
    notify("❌ 数据异常", "请重新抓包");
    console.log("【DEBUG】读取持久化数据错误:", e);
    $done();
  }
}

run();
