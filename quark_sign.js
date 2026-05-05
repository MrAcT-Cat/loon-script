// 夸克扫描王 专用签到脚本（完美适配版）
const storeKey = "quark_scan_data";

function notify(title, body) {
  $notification.post("夸克扫描王", title, body);
}

function run() {
  let raw = $persistentStore.read(storeKey);
  if (!raw) {
    notify("❌ 未获取参数", "请先打开抓包开关，进入扫描王签到页");
    return $done();
  }

  try {
    let acc = JSON.parse(raw);
    let url = acc.url;
    let headers = acc.headers;
    let body = acc.body || "{}";

    // 自动更新时间戳，解决1002参数错误
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
        let j = JSON.parse(data);

        // 夸克扫描王接口专用状态解析
        if (j.code === 0) {
          // 优先解析扫描王可能存在的签到天数字段
          let continueDays = "首次";
          if (j.data?.continueDays) continueDays = j.data.continueDays;
          else if (j.data?.continue_days) continueDays = j.data.continue_days;
          else if (j.data?.day) continueDays = j.data.day;
          else if (j.data?.signDays) continueDays = j.data.signDays;

          const reward = j.data?.reward || j.data?.prize || "会员/积分";
          notify("✅ 签到成功", `连续签到${continueDays}天，获得${reward}`);
        } 
        // 扫描王常见的「已签到」错误码
        else if (j.code === 4001 || j.code === 1001 || (j.msg && j.msg.includes("已签到"))) {
          notify("ℹ️ 已签到", "今天已经签到过了，无需重复签到");
        }
        else if (j.code === 1002) {
          notify("❌ 签到失败", "参数过期，请重新抓包");
        }
        else {
          notify("⚠️ 签到状态", `状态码：${j.code}，提示：${j.msg || "未知错误"}`);
        }
      } catch (e) {
        notify("❌ 解析失败", "服务器返回数据异常");
        console.log("【夸克扫描王】原始响应：", data);
      }
      $done();
    });
  } catch (e) {
    notify("❌ 数据异常", "请重新抓包获取参数");
    $done();
  }
}

run();
