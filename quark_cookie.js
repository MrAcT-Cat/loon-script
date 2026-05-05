let url = $request.url;
let body = $request.body || "";
let cookie = $request.headers.Cookie || $request.headers.cookie;

if (cookie) {
  $persistentStore.write(cookie, "quark_cookie");
}

$persistentStore.write(url, "quark_url");
$persistentStore.write(body, "quark_body");

$notification.post("夸克", "请求捕获成功", "");

$done({});