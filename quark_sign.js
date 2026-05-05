let cookie = $persistentStore.read("scan_cookie");
let url = $persistentStore.read("scan_sign_url");
let body = $persistentStore.read("scan_body");

if(!cookie||!url){
  $notification.post("夸克扫描签到","失败｜未捕获数据","先手动签到一次");
  $done();
}

let headers = {
  "Cookie":cookie,
  "Content-Type":"application/json"
};

$httpClient.post({url,headers,body},(err,resp,data)=>{
  if(err){
    $notification.post("夸克扫描","签到请求失败","");
  }else{
    let res = JSON.parse(data||"{}");
    if(res.code===0){
      $notification.post("夸克扫描","✅签到成功","");
    }else if(res.msg?.includes("已签到")){
      $notification.post("夸克扫描","今日已签到","");
    }else{
      $notification.post("夸克扫描","签到失败",res.msg||data);
    }
  }
  $done();
})