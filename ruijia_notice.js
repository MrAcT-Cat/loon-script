try {
    const originBody = $response.body;
    const data = JSON.parse(originBody);
    // 仅单独修改弹窗控制标识，不改动任何其他业务字段
    if (data?.data?.is_close !== undefined) {
        data.data.is_close = 0;
    }
    // 完整返回原结构JSON
    $done({
        body: JSON.stringify(data)
    });
} catch (err) {
    // 解析失败直接透传原始完整响应，完全不干预接口数据
    $done({});
}