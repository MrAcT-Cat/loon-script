let cookie = $persistentStore.read("quark_cookie");
let url = $persistentStore.read("quark_url");
let body = $persistentStore.read("quark_body") || "{}";

if (!cookie || !url) {
  $notification.post("夸克签到", "失败", "缺少数据");
  $done();
}

let headers = {
  "User-Agent": "Mozilla/5.0",
  "Content-Type": "application/json",
  "Cookie": cookie
};

$httpClient.post({ url, headers, body }, function (err, resp, data) {
  if (data) {
    $notification.post("签到结果", "", data);
  } else {
    $notification.post("签到失败", "", "无返回");
  }
  $done();
});