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
    const url = acc.url;
    const headers = acc.headers;

    let body = JSON.parse(acc.body || "{}");

    // ✅ 只更新 timestamp（唯一能安全改的）
    body.timestamp = Date.now().toString();

    // ❌ 不要乱改 ut / kp / token（否则必炸）

    // 清理无效请求头
    delete headers[":method"];
    delete headers[":path"];
    delete headers[":scheme"];
    delete headers["Content-Length"];
    delete headers["content-length"];

    $httpClient.post(
      {
        url,
        headers,
        body: JSON.stringify(body)
      },
      (err, resp, data) => {
        if (err) {
          notify("❌ 请求失败", err.message || "网络异常");
          return $done();
        }

        try {
          const j = JSON.parse(data);
          console.log("响应:", j);

          // ✅ 用你刚抓的真实结构判断
          if (j.code === 0) {
            let coin = j.data?.currObtainWelfare?.coin || 0;
            let day = j.data?.contNum || 0;

            notify("✅ 签到成功", `连续 ${day} 天 · +${coin}金币`);
          }
          else if (j.msg && j.msg.includes("已")) {
            notify("ℹ️ 今日已签到", j.msg);
          }
          else if (j.code === 1002 || j.code === 401) {
            notify("❌ 参数过期", "打开夸克重新点一次签到");
          }
          else {
            notify("ℹ️ 返回结果", JSON.stringify(j));
          }

        } catch (e) {
          notify("⚠️ 解析失败", "但请求已发送");
        }

        $done();
      }
    );

  } catch (e) {
    notify("❌ 数据异常", "请重新抓包");
    $done();
  }
}

run();