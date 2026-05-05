let url = $request.url;
let body = $request.body || "";
let cookie = $request.headers.Cookie || $request.headers.cookie;

// 单独存储夸克扫描数据，不和网盘冲突
if(cookie)$persistentStore.write(cookie,"scan_cookie");
$persistentStore.write(url,"scan_sign_url");
$persistentStore.write(body,"scan_body");

$notification.post("夸克扫描","捕获签到数据成功","");
$done({})