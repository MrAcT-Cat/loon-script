let cookie = $request.headers.Cookie || $request.headers.cookie;

if (cookie) {
  $persistentStore.write(cookie, "quark_cookie");
  $notification.post("夸克", "Cookie获取成功", cookie);
} else {
  $notification.post("夸克", "未获取到Cookie", "");
}

$done({});