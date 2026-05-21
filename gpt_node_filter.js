const WHITE_LIST = new Set([
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
]);

async function main() {
    // 获取全部节点
    const allProxies = $proxies.list();
    const validProxies = [];

    for (const proxy of allProxies) {
        try {
            const res = await $task.fetch({
                url: "https://chat.openai.com/cdn-cgi/trace",
                opts: {
                    policy: proxy.name,
                    timeout: 3000
                }
            });
            const loc = res.body.match(/loc=(\w+)/)?.[1] || "";
            if (WHITE_LIST.has(loc)) {
                validProxies.push(proxy.name);
            }
        } catch (e) {
            continue;
        }
    }

    // 自动新建/覆盖 策略组：GPT可用策略
    $groups.update({
        name: "GPT可用策略",
        type: "select",
        proxies: validProxies
    });

    $notify(
        "GPT节点整理完成",
        `总节点：${allProxies.length} 个`,
        `筛选可用：${validProxies.length} 个 已存入【GPT可用策略】`
    );
    $done();
}

main();