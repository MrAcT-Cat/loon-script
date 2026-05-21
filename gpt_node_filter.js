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
]);

async function main() {
    const policies = $env.policyGroupList || [];
    if(policies.length === 0){
        $notify("⚠️ 扫描失败","没有找到订阅节点","请确认已添加节点或策略组");
        $done();
        return;
    }

    let results = [];

    for(const node of policies){
        try{
            const traceRes = await $task.fetch({
                url:"https://chat.openai.com/cdn-cgi/trace",
                opts:{policy:node, timeout:4000}
            });
            const loc = traceRes.body.match(/loc=(\w+)/)?.[1] || "未知";

            let accessMsg = "";
            try{
                const apiRes = await $task.fetch({
                    url: "https://chat.openai.com/api/auth/session",
                    opts:{policy:node, timeout:5000}
                });
                if(apiRes.statusCode === 200 && apiRes.body.includes("user")){
                    accessMsg = "✅ 可访问";
                } else {
                    accessMsg = "❌ 受限";
                }
            }catch{
                accessMsg = "⚠️ 无法访问";
            }

            results.push(`${node} | ${loc} | ${GPT_WHITELIST.has(loc) ? "白名单" : "非白名单"} | ${accessMsg}`);
        }catch{
            results.push(`${node} | ❌ 节点检测失败`);
        }
    }

    // 按可用性排序，优先显示可访问节点
    results.sort((a,b) => (a.includes("✅") ? -1 : 1));

    $notify("GPT节点扫描完成", `共扫描 ${policies.length} 个节点`, results.join("\n"));
    $done();
}

main();