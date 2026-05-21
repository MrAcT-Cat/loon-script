// Loon 插件：ChatGPT 节点全自动实测筛选
const GPT_WHITE = new Set([
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
    // 读取订阅全部节点
    const allNodes = $proxies.list();
    const validList = [];
    let pass = 0, fail = 0;

    // 逐个节点实测ChatGPT解锁
    for (const node of allNodes) {
        try {
            const res = await $task.fetch({
                url: "https://chat.openai.com/cdn-cgi/trace",
                opts: { policy: node.name, timeout: 3500 }
            })
            const loc = res.body.match(/loc=(\w+)/)?.[1] || "";
            if (GPT_WHITE.has(loc)) {
                validList.push(node.name);
                pass++;
            } else {
                fail++;
            }
        } catch {
            fail++;
        }
    }

    // 自动新建/更新独立GPT专属策略组
    $groups.createOrUpdate({
        name: "✅GPT可用节点池",
        type: "select",
        proxies: validList
    })

    // 弹窗通知结果
    $notify("GPT节点筛选完成",
        `总节点: ${allNodes.length} 个`,
        `✅解锁可用: ${pass} 个 | ❌不可用: ${fail} 个`
    )
    $done()
}

main();