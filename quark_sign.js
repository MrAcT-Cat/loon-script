let cookie = $persistentStore.read("quark_cookie");

if (!cookie) {
  $notification.post("夸克签到", "失败", "没有Cookie，请先打开夸克获取");
  $done();
}

let headers = {
  "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
  "Content-Type": "application/json",
  "Referer": "https://scank.quark.cn/",
  "Cookie": cookie
};

let url = "https://scan-order.quark.cn/api/sd6hJds8SIgn/pOcKNmTupWelFare";

$httpClient.post({ url, headers }, function (err, resp, data) {
  if (err) {
    $notification.post("夸克签到", "请求失败", err);
  } else {
    $notification.post("夸克签到结果", "", data);
  }
  $done();
});