const storeKey = "quark_scan_data";

function notify(title, body) {
  $notification.post("夸克扫描王", title, body);
}

function done() {
  $done({});
}

function run() {

  const raw = $persistentStore.read(storeKey);

  if (!raw) {
    notify("❌ 未获取参数", "请先打开夸克签到页");
    return done();
  }

  let acc;

  try {
    acc = JSON.parse(raw);
  } catch (e) {
    notify("❌ 本地数据损坏", "请重新抓包");
    return done();
  }

  if (!acc.url || !acc.headers || !acc.body) {
    notify("❌ 参数不完整", "请重新抓包");
    return done();
  }

  let body;

  try {
    body = JSON.parse(acc.body);
  } catch (e) {
    notify("❌ Body解析失败", "请重新抓包");
    return done();
  }

  // ⚠️ 不建议改 timestamp
  // 很多接口 token 与 timestamp 强绑定
  // 直接使用抓到的原始 body 更稳

  const headers = Object.assign({}, acc.headers);

  // 清理无效 header
  [
    ":authority",
    ":method",
    ":path",
    ":scheme",
    "Content-Length",
    "content-length",
    "Host",
    "host"
  ].forEach(k => delete headers[k]);

  $httpClient.post(
    {
      url: acc.url,
      headers: headers,
      body: JSON.stringify(body)
    },
    (err, resp, data) => {

      if (err) {
        notify("❌ 请求失败", err.message || "网络异常");
        return done();
      }

      if (!data) {
        notify("❌ 无响应数据", "请求可能被拦截");
        return done();
      }

      try {

        const j = JSON.parse(data);

        console.log("夸克签到响应:");
        console.log(data);

        // 成功
        if (j.code === 0) {

          const coin =
            j.data?.currObtainWelfare?.coin || 0;

          const vip =
            j.data?.currObtainWelfare?.awardName || "";

          const day =
            j.data?.contNum || 0;

          let msg = `连续 ${day} 天`;

          if (coin) {
            msg += ` · +${coin}金币`;
          }

          if (vip) {
            msg += ` · ${vip}`;
          }

          notify("✅ 签到成功", msg);
        }

        // 已签到
        else if (
          (j.msg && j.msg.includes("已")) ||
          (j.message && j.message.includes("已"))
        ) {

          notify(
            "ℹ️ 今日已签到",
            j.msg || j.message
          );
        }

        // 参数失效
        else if (
          j.code === 401 ||
          j.code === 403 ||
          j.code === 1002
        ) {

          notify(
            "❌ 参数已失效",
            "打开夸克签到页重新抓包"
          );
        }

        // 其它情况
        else {

          notify(
            "⚠️ 未知返回",
            `${j.msg || "无msg"} (${j.code})`
          );
        }

      } catch (e) {

        console.log(data);

        notify(
          "⚠️ 响应解析失败",
          "请查看日志"
        );
      }

      done();
    }
  );
}

run();