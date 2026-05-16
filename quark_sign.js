// ==Loon==
// @name 夸克扫描王自动签到
// @author Grok
// @cron 0 9 * * * 
// ==/Loon==

const url = "https://scan-order.quark.cn/api/sd6hJds8SIgn/pDChohbxo82nCoIn";

const headers = {
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X; zh-cn) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/22B83 Quark/10.4.0.2812 Scanking/10.4.0.2812 Mobile",
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Accept-Language": "zh-Hans;q=1, zh-Hans-CN;q=0.9, en-CN;q=0.8",
    "Cookie": "_er_is_back_to_node=0; _er_uuid=BHHIIJBIIGAAI-JxUs4RMXYq; isg=BBMTQ7pNfsTHazwWIgKaLBTGqJM9yKeKTvw4RMUwVTJNRDbmTZlM21rWejIqf_-C; tfstk=gQTsDSiPhjGwjrhtHRlUNnTAGIbMfXuPXS1vZIUaMNQOHt92LNSAb17fDdBe7i7tmjTfpIYZsIJwRE9ydjxN0CEp9_BH_ikmsSFMRLa47AmMMrsVkYkrz4RGsZbxUxXJFByGM_VtuiEtJNf20ywnF4RMsWF_Hb-Kzq9tV8XOHKI99kCRprC9HrIKOsC4BoU9HBhCK_6YBiIOp2CPwZBvHZhB99fAk1pAkXOdKsdGxYfnSTAsiPllCFiGJCBQkrLOPG1Wuoz7Pe11GlAOdGSwR1s1FMxWq_TMDFTdqEDSwwL6CFIBQmU5JF96WM9-Ly9c4oyPFxDUcWsuk6ZiOXZ0m_m3LkdBfiZCX6feJXGQ0LsOt66rOXZ0mGChTehIOoJ5."
};

const body = {
    "chid": "d185a0655fcf47abb634fe8ade178ed2",
    "fr": "iphone",
    "product": "welfare_create",
    "bucket": "@15694_B@",
    "kp": "LuH4LcHx++sjn00UZFii2RksPcQzeOuDu+xBVfPWaz+5u+9X+U3uI9PpuwuhGNblcHyXv4R8twTKS6OsbCCTyjyczBGIk508ZyUQ/rAuPxecTQ==",
    "ve": "10.4.0.2812",
    "ut": "LuFw5fJHq+1UkEW/giQ2uyJERq2m4Ne22FnUZUJ28Hbq7w==",
    "timestamp": Date.now().toString(),
    "pr": "scanking",
    "token": "05be6a7280cd82bad207e1d44ab454b9"
};

$httpClient.post({ url: url, headers: headers, body: JSON.stringify(body) }, (error, response, data) => {
    if (error) {
        $notification.post("夸克扫描王", "❌ 请求失败", error.message || error);
        $done();
    }

    try {
        const json = JSON.parse(data);
        if (json.code === 0 || json.status === 0) {
            const coin = json.data?.currObtainWelfare?.coin || 0;
            const days = json.data?.contNum || "?";
            $notification.post("✅ 夸克扫描王签到成功", `获得 ${coin} 金币 | 连续 ${days} 天`, "");
        } else {
            $notification.post("❌ 夸克扫描王签到失败", json.msg || "未知错误", "");
        }
    } catch (e) {
        $notification.post("❌ 夸克扫描王异常", e.message, "");
    }
    $done();
});