// 对齐B站脚本风格：Loon / QuanX 双兼容 http-response 清理悬浮广告
const isQuanX = typeof $task !== 'undefined';

let body = $response.body;

const injectScript = [
    '<script>',
    '(function(){',
    'function clearFloatAds(){',
    '    var els = document.querySelectorAll(".fixed, [style*=\\"position:fixed\\"]");',
    '    for(var i = 0; i < els.length; i++){',
    '        els[i].remove();',
    '    }',
    '}',
    'clearFloatAds();',
    'setInterval(clearFloatAds, 200);',
    '})();',
    '</script>'
].join('');

body = body + injectScript;

if (isQuanX) {
    $done({ body });
} else {
    $done({ body: body });
}