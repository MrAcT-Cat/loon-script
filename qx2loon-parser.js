async function main() {
  const rawBody = $request.body;
  let mitmHost = '';
  const scriptLines = [];

  // 提取MITM域名
  const mitmMatch = rawBody.match(/\[mitm\][\s\S]*?hostname\s*=\s*([^\n\r#]+)/i);
  if(mitmMatch) mitmHost = mitmMatch[1].trim();

  // 逐行解析Rewrite规则
  const lines = rawBody.split(/\r?\n/);
  for(const line of lines){
    const trim = line.trim();
    if(!trim || trim.startsWith('#')) continue;

    // script-request-header
    const reqReg = /^(.+?)\s+url\s+script-request-header\s+(\S+)/i;
    const reqM = trim.match(reqReg);
    if(reqM){
      scriptLines.push(`http-request ${reqM[1]} script-path=${reqM[2]}`);
      continue;
    }

    // script-response-body
    const resReg = /^(.+?)\s+url\s+script-response-body\s+(\S+)/i;
    const resM = trim.match(resReg);
    if(resM){
      scriptLines.push(`http-response ${resM[1]} script-path=${resM[2]}, requires-body=true`);
    }
  }

  // 拼装标准Loon Plugin
  const plugin = `#!name=转换生成插件
#!desc=由QX2Loon Hub自动转换
#!version=1.0
#!system=ios
#!category=重写

[MITM]
hostname = ${mitmHost || 'example.com'}

[Script]
${scriptLines.join('\n')}
`;

  // 标准返回结构，必须包 response
  $done({
    response: {
      status: 200,
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      },
      body: plugin
    }
  });
}
main();