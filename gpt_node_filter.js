// iOS Loon 插件 完美可用版
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
    // 读取当前正在生效的节点
    const nowNode = $env.currentPolicy;

    if(!nowNode){
        $notify("⚠️ 运行失败","请先手动选中一个节点","再点击按钮检测")
        $done()
        return
    }

    try{
        const res = await $task.fetch({
            url:"https://chat.openai.com/cdn-cgi/trace",
            opts:{policy:nowNode,timeout:4000}
        })

        const loc = res.body.match(/loc=(\w+)/)?.[1] || ""

        if(GPT_WHITELIST.has(loc)){
            $notify("✅ 节点可用｜GPT解锁成功",`节点名称：${nowNode}`,`地区码：${loc}，已支持ChatGPT`)
        }else{
            $notify("❌ 节点失效｜GPT无法访问",`节点名称：${nowNode}`,`地区码：${loc}，不在官方白名单`)
        }

    }catch{
        $notify("⚠️ 连接超时", "节点延迟过高/被封禁", "请切换其他节点重试")
    }

    $done()
}

main();