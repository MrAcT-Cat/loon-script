/**
 * Loon 流媒体检测
 */


const services = [
{
name:"Netflix",
url:"https://www.netflix.com/title/81280792",
match:["Netflix"]
},

{
name:"Disney+",
url:"https://www.disneyplus.com/",
match:["Disney"]
},

{
name:"YouTube",
url:"https://www.youtube.com/premium",
match:["YouTube"]
},

{
name:"TikTok",
url:"https://www.tiktok.com/",
match:["TikTok"]
},

{
name:"ChatGPT",
url:"https://chat.openai.com/",
match:["OpenAI","ChatGPT"]
},

{
name:"Spotify",
url:"https://open.spotify.com/",
match:["Spotify"]
}

];



async function check(url){

try{

let r = await $httpClient.get({
url:url,
timeout:8
});


if(r.status==200){

return "✅ 解锁";

}

return "❌ "+r.status;


}catch(e){

return "❌ 失败";

}

}



async function ipinfo(){

try{

let r=await $httpClient.get({

url:"https://ipinfo.io/json",
timeout:5

});


return JSON.parse(r.body);


}catch(e){

return {};

}

}



async function main(){


let result="";

for(let s of services){

let status=await check(s.url);

result += `${s.name.padEnd(10)} ${status}\n`;

}


let ip=await ipinfo();


let body=`

📺 流媒体检测


${result}


🌐 IP信息

IP:
${ip.ip||"未知"}

地区:
${ip.city||""} ${ip.country||""}

运营商:
${ip.org||""}


`;



$notification.post(
"流媒体检测完成",
"节点检测结果",
body
);


$done();

}



main();