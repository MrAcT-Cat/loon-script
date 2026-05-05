let cookie = $persistentStore.read("quark_cookie");

if (!cookie) {
  $notification.post("夸克签到", "失败", "没有Cookie");
  $done();
}

let headers = {
  "User-Agent": "Mozilla/5.0",
  "Content-Type": "application/json",
  "Cookie": cookie
};

// ✅ 关键：加 body
let body = "{}";

let url = "https://scan-order.quark.cn/api/sd6hJds8SIgn/pOcKNmTupWelFare";

$httpClient.post({ url, headers, body }, function (err, resp, data) {
  if (data) {
    $notification.post("签到结果", "", data);
  } else {
    $notification.post("签到失败", "", "无返回");
  }
  $done();
});