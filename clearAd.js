// 赵家坊广告清空脚本
let raw = JSON.parse($response.body);
// 清空广告数组，保留原始结构防止APP兜底广告
if(raw?.datas?.advert_list){
  raw.datas.advert_list = [];
}
// 清除缓存标识，避免304缓存复用旧广告
$response.headers["Etag"] = "";
$response.headers["Cache-Control"] = "no-store,no-cache";
$done({body: JSON.stringify(raw)});