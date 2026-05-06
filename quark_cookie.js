const scriptName = "夸克扫描王抓包";
const storeKey = "quark_scan_data";

function notify(title, body) {
    $notification.post(scriptName, title, body);
}

if (
  $request &&
  $request.method === "POST" &&
  $request.url.includes("pDChohbxo82nCoIn")
) {

    let headers = $request.headers;

    // ✅ 只保留关键 header
    let cleanHeaders = {
        "Content-Type": headers["Content-Type"] || headers["content-type"],
        "User-Agent": headers["User-Agent"] || headers["user-agent"],
        "Cookie": headers["Cookie"] || headers["cookie"]
    };

    let data = {
        url: $request.url,
        headers: cleanHeaders,
        body: $request.body,
        time: Date.now()
    };

    $persistentStore.write(JSON.stringify(data), storeKey);

    notify("✅ 抓取成功", "签到参数已更新");
}

$done({});