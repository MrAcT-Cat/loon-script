// 对齐B站脚本风格：Loon / QuanX 双兼容 http-response
const isQuanX = typeof $task !== 'undefined';
let body = $response.body;
const injectScript = [
    '<script>',
    '(function(){',
    '// 原有清理悬浮元素逻辑',
    'function clearFloatAds(){',
    '    var els = document.querySelectorAll(".float-ad,.ad-float,[class*=float],[class*=admask]");',
    '    for(var i = 0; i < els.length; i++){',
    '        els[i].remove();',
    '    }',
    '    // 额外清理全屏fixed灰色遮罩',
    '    var allDiv = document.querySelectorAll("div");',
    '    for(var j=0;j<allDiv.length;j++){',
    '        var st = getComputedStyle(allDiv[j]);',
    '        if(st.position === "fixed" && st.width === "100vw" && st.height === "100vh" && parseInt(st.zIndex) > 9999){',
    '            allDiv[j].remove();',
    '        }',
    '    }',
    '}',
    'clearFloatAds();',
    'setInterval(clearFloatAds, 200);',

    '// 新增：拦截广告window.open跳转，杜绝点击阴影新开空白页',
    'const rawOpen = window.open;',
    'window.open = function(url){',
    '    const adDomains = ["gp2hmr.com","cnr2ew.com","wu7y6z.com","shturl.cc"];',
    '    if(url && adDomains.some(d=>url.includes(d))){',
    '        return null;',
    '    }',
    '    return rawOpen.apply(this, arguments);',
    '};',

    '// 拦截遮罩点击冒泡跳转',
    'document.addEventListener("click",function(e){',
    '    var target = e.target;',
    '    var st = getComputedStyle(target);',
    '    if(st.position === "fixed" && st.width === "100vw"){',
    '        e.preventDefault();',
    '        e.stopImmediatePropagation();',
    '    }',
    '},true);',
    '})();',
    '</script>'
].join('');

body = body + injectScript;

if (isQuanX) {
    $done({ body });
} else {
    $done({ body: body });
}