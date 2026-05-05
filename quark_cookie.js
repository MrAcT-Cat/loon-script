let url = $request.url;
let body = $request.body || "";

$persistentStore.write(url, "quark_url");
$persistentStore.write(body, "quark_body");

$notification.post("夸克", "请求捕获成功", "");

$done({});