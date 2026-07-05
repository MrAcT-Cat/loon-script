let body = $response.body;
if (body) {
    let obj = JSON.parse(body);
    // 假设返回结构类似 {"code":1,"data":{"is_close":1,"time_down":3,...}}
    if (obj.data) {
        obj.data.is_close = 1;     // 显示跳过按钮
        obj.data.time_down = 0;    // 倒计时归零
        obj.data.content = "";     // 清空广告内容
    }
    $done({ body: JSON.stringify(obj) });
} else {
    $done({});
}