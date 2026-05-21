// Loon 面板 ChatGPT 全节点解锁批量检测
const GPT_WHITELIST = new Set([
"T1","XX","AL","DZ","AD","AO","AG","AR","AM","AU","AT","AZ",
"BS","BD","BB","BE","BZ","BJ","BT","BA","BW","BR","BG","BF",
"CV","CA","CL","CO","KM","CR","HR","CY","DK","DJ","DM","DO",
"EC","SV","EE","FJ","FI","FR","GA","GM","GE","DE","GH","GR",
"GD","GT","GN","GW","GY","HT","HN","HU","IS","IN","ID","IQ",
"IE","IL","IT","JM","JP","JO","KZ","KE","KI","KW","KG","LV",
"LB","LS","LR","LI","LT","LU","MG","MW","MY","MV","ML","MT",
"MH","MR","MU","MX","MC","MN","ME","MA","MZ","MM","NA","NR",
"NP","NL","NZ","NI","NE","NG","MK","NO","OM","PK","PW","PA",
"PG","PE","PH","PL","PT","QA","RO","RW","KN","LC","VC","WS",
"SM","ST","SN","RS","SC","SL","SG","SK","SI","SB","ZA","ES",
"LK","SR","SE","CH","TH","TG","TO","TT","TN","TR","TV","UG",
"AE","US","UY","VU","ZM","BO","BN","CG","CZ","VA","FM","MD",
"PS","KR","TW","TZ","TL","GB"
])

async function main() {
    const allNodes = $proxies.list();
    let valid = 0;
    let invalid = 0;

    for (const node of allNodes) {
        try {
            const resp = await $task.fetch({
                url: "https://chat.openai.com/cdn-cgi/trace",
                opts: { policy: node.name, timeout: 3000 }
            })
            const loc = resp.body.match(/loc=(\w+)/)?.[1] || "";
            GPT_WHITELIST.has(loc) ? valid++ : invalid++;
        } catch {
            invalid++;
        }
    }

    $notify(
        "ChatGPT 节点扫描完成 ✅",
        `总节点数量：${allNodes.length}`,
        `✅ 可解锁GPT：${valid} 个 | ❌ 不可用：${invalid} 个`
    )
    $done();
}

main();