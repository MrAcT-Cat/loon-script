// Loon 节点过滤：只保留 ChatGPT 官方白名单地区
// 仓库路径：Scripts/loon/gpt_filter.js

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

// Loon 固定入口：async function filter(node)
async function filter(node) {
    const opts = {
        policy: node.name,
        timeout: 3000
    };

    try {
        const res = await $task.fetch({
            url: "https://chat.openai.com/cdn-cgi/trace",
            opts: opts
        });

        const loc = res.body.match(/loc=(\w+)/)?.[1] || "";
        return WHITE_LIST.has(loc);
    } catch (e) {
        return false; // 超时/失败 直接剔除
    }
}