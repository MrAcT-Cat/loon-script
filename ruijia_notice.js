try {
    let res = JSON.parse($response.body);
    // 仅关闭弹窗开关，所有原有数据完整保留
    res.data.is_close = 0;
    $done({body: JSON.stringify(res)});
} catch (err) {
    // JSON解析异常时透传原始数据，防止APP闪退
    $done({});
}