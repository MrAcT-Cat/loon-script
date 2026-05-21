// ================= ChatGPT 节点筛选 Remote Filter =================
const BASE_URL_GPT = 'https://chat.openai.com/';
const REGION_URL_GPT = 'https://chat.openai.com/cdn-cgi/trace';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36';
const SUPPORT_COUNTRIES = ["US","JP","KR","SG","HK","TW","GB","CA","AU","DE","FR","TH","MY"];

// 订阅链接（替换成你的节点订阅链接）
const SUBSCRIBE_URL = "https://你的订阅链接.com/subscribe.txt";

// 主逻辑
(async () => {
    try {
        // 1️⃣ 获取订阅节点列表
        const subRes = await $task.fetch(SUBSCRIBE_URL);
        const subTxt = atob(subRes.body.trim());
        const nodes = subTxt.split("\n").map(line => ({name: line.trim(), opts: {proxy: line.trim()}}));

        const usableNodes = [];

        // 2️⃣ 循环测试每个节点
        for (const node of nodes) {
            try {
                // 测试 ChatGPT 首页访问
                const resp = await $task.fetch({url: BASE_URL_GPT, opts: node.opts, timeout: 3000, headers: {"User-Agent": UA}});
                if (JSON.stringify(resp).indexOf("text/plain") === -1) {
                    // 获取地区
                    const regionResp = await $task.fetch({url: REGION_URL_GPT, opts: node.opts, timeout: 3000, headers: {"User-Agent": UA}});
                    const region = regionResp.body.split("loc=")[1].split("\n")[0];
                    if (SUPPORT_COUNTRIES.includes(region)) {
                        usableNodes.push(node.name); // 可用节点
                    }
                }
            } catch (e) {
                // 忽略连接失败或超时节点
            }
        }

        // 3️⃣ 输出最终可用节点列表（每行一个节点）
        resolve(usableNodes.join("\n"));

    } catch (err) {
        resolve(""); // 如果订阅拉取失败，输出空列表
    }
})();