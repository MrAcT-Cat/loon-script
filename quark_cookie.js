// 夸克抓包（最终版）
const storeKey = "quark_sign_account_v2";

function notify(t, s) {
  $notification.post("夸克抓包", t, s);
}

if ($request) {

  const url = $request.url;

  // ✅ 只抓真正签到接口
  if (url.indexOf("pOcKNmTupWelFare") !== -1) {

    const data = {
      url: url,
      headers: $request.headers,
      body: $request.body,   // ⭐关键
      time: Date.now()
    };

    $persistentStore.write(JSON.stringify(data), storeKey);

    notify("✅ 抓取成功", "已获取签到参数");
  }

}

$done({});