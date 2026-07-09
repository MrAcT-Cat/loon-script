async function main() {
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width">
<title>QX2Loon Hub</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont}
body{padding:16px;background:#f5f5f7}
h2{margin-bottom:12px}
textarea{width:100%;height:320px;padding:12px;border-radius:10px;border:1px solid #ddd;margin:10px 0;font-size:14px}
button{padding:10px 20px;background:#007aff;color:#fff;border:none;border-radius:8px;margin-right:8px;font-size:15px}
#result{margin-top:10px;padding:12px;background:#fff;border-radius:10px;white-space:pre-wrap;min-height:300px;font-family:Menlo,monospace;font-size:13px}
</style>
</head>
<body>
<h2>QX Rewrite → Loon Plugin 转换器</h2>
<textarea id="input" placeholder="粘贴完整QX Rewrite脚本（包含注释、[rewrite_local]、[mitm]）"></textarea>
<button onclick="doConvert()">开始转换</button>
<button onclick="copyRes()">复制结果</button>
<div id="result"></div>
<script>
async function doConvert(){
  const raw = document.getElementById('input').value;
  const res = await fetch('/convert/',{
    method:'POST',
    body:raw
  });
  const text = await res.text();
  document.getElementById('result').innerText = text;
}
async function copyRes(){
  const txt = document.getElementById('result').innerText;
  await navigator.clipboard.writeText(txt);
  alert('已复制转换后的插件内容');
}
</script>
</body>
</html>`;

  // 关键：使用 response 包裹 + CORS 头，和Script Hub格式统一
  $done({
    response: {
      status: 200,
      headers: {
        "Content-Type": "text/html;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: html
    }
  });
}
main();