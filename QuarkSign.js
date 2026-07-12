//2026/07/12
const STORE_KEY = 'quark_sign_params';
const SIGN_URL = 'https://scan-order.quark.cn/api/sd6hJds8SIgn/pDChohbxo82nCoIn';

function loadStore() {
  const raw = $persistentStore.read(STORE_KEY);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}
function saveStore(data) {
  $persistentStore.write(JSON.stringify(data), STORE_KEY);
}
function notify(title, body, sub = '') {
  console.log(`【夸克签到】${title} - ${body}`);
  $notification.post('夸克签到', title, body);
}

function doSign(params) {
  const payload = {
    chid: params.chid,
    fr: 'iphone',
    product: 'welfare_create',
    kp: params.kp,
    ut: params.ut,
    ve: params.ve || '10.4.0.2812',
    timestamp: Date.now().toString(),
    pr: 'scanking',
    token: params.token
  };
  const headers = {
    'Host': 'scan-order.quark.cn',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X; zh-cn) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/22B83 Quark/10.4.0.2812 Scanking/10.4.0.2812 Mobile',
    'Accept': 'application/json',
    'Accept-Language': 'zh-Hans;q=1, zh-Hans-CN;q=0.9, en-CN;q=0.8',
    'Content-Type': 'application/json',
    'Cookie': params.cookie
  };
  $httpClient.post({
    url: SIGN_URL,
    headers: headers,
    body: JSON.stringify(payload)
  }, function(err, resp, data) {
    if (err) { notify('❌ 请求失败', err); return; }
    try {
      const result = JSON.parse(data);
      if (result.code === 0) {
        const reward = result.data?.currObtainWelfare;
        if (reward && reward.coin) {
          notify('✅ 签到成功', `获得 ${reward.coin} 金币${reward.vip ? '，VIP +' + reward.vip + '天' : ''}`);
        } else {
          const cont = result.data?.contNum || 0;
          notify('ℹ️ 今日已签', `连续签到 ${cont} 天`);
        }
      } else if (result.msg && (result.msg.includes('签名') || result.msg.includes('token') || result.msg.includes('参数'))) {
        notify('⚠️ 参数失效', '请重新打开夸克 App 手动签到一次以更新参数');
      } else {
        notify('❌ 签到失败', result.msg || '未知错误');
      }
    } catch(e) {
      notify('❌ 解析失败', e.toString());
    }
  });
}

if (typeof $request !== 'undefined' && $request) {
  // 抓包模式
  try {
    const bodyStr = $request.body || '';
    let body = {};
    try { body = JSON.parse(bodyStr); } catch(e) {}
    if (body.product === 'welfare_create' && body.kp && body.ut && body.token) {
      const cookie = $request.headers?.Cookie || '';
      const params = {
        chid: body.chid || '',
        kp: body.kp,
        ut: body.ut,
        token: body.token,
        ve: body.ve || '10.4.0.2812',
        cookie: cookie,
        updatedAt: Date.now()
      };
      saveStore(params);
      notify('📥 参数已更新', '抓取到最新 kp/ut/token');
    }
  } catch(e) { console.log('抓包异常：' + e); }
  $done({});
} else {
  // 定时模式
  const stored = loadStore();
  if (!stored.chid || !stored.kp || !stored.ut || !stored.token) {
    notify('⚠️ 缺少参数', '请先打开夸克 App 手动签到一次，让脚本抓取参数');
    $done();
    return;
  }
  doSign(stored);
  $done();
}