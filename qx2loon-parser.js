async function main() {
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width">
<title>QX2Loon Hub</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system}
body{padding:16px;background:#f5f5f7}
textarea{width:100%;height:320px;padding:12px;border-radius:10px;border:1px solid #ddd;margin:10px 0}
button{padding:10px 20px;background:#007aff;color:#fff;border:none;border-radius:8px}
#result{margin-top:10px;padding:12px;background:#fff;border-radius:10px;white-space:pre-wrap;min-height:300px;font-family:Menlo}
</style>
</head>
<body>
<h2>QX Rewrite → Loon Plugin</h2>
<textarea id="input" placeholder="粘贴完整QX脚本"></textarea>
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
  navigator.clipboard.writeText(txt);
  alert('已复制');
}
</script>
</body>
</html>`;
  $done({
    status:200,
    headers:{"Content-Type":"text/html;charset=utf-8"},
    body:html
  });
}
main();