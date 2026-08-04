/*
 * Loon Streaming Check
 * Based on KOP-XIAO streaming-ui-check
 *
 * Support:
 * Netflix
 * Disney+
 * YouTube Premium
 * DAZN
 * Paramount+
 * ChatGPT
 * OpenAI API
 * TikTok
 * Spotify
 */


const input = $environment.params || "";
const nodeName = input.node || "当前节点";


const UA =
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120 Safari/537.36";


let result={

Netflix:"检测中...",
Disney:"检测中...",
YouTube:"检测中...",
DAZN:"检测中...",
Paramount:"检测中...",
ChatGPT:"检测中...",
OpenAI:"检测中...",
TikTok:"检测中...",
Spotify:"检测中..."

};



function req(url,method="GET",body=null){

return new Promise(resolve=>{


let opt={

url:url,
node:nodeName,
timeout:8000,
headers:{
"User-Agent":UA
}

};


if(body){

opt.body=body;
}


$httpClient[method.toLowerCase()](opt,(err,res,data)=>{


if(err){

resolve(null);
return;

}


resolve({

status:res.status,
headers:res.headers,
body:data

});


});


});


}




async function netflix(){


let r=await req(
"https://www.netflix.com/title/81215567"
);


if(!r){

result.Netflix="❌失败";
return;

}


if(r.status==403){

result.Netflix="🚫 不支持";

}

else if(r.status==404){

result.Netflix="⚠️ 自制剧";

}

else if(r.status==200){


let url=
r.headers["X-Originating-URL"]
||
r.headers["x-originating-url"];


if(url){

result.Netflix=
"🎉 完整支持";

}else{

result.Netflix=
"⚠️ 支持未知";

}


}

else{

result.Netflix="❌失败";

}


}




async function youtube(){


let r=await req(
"https://www.youtube.com/premium"
);


if(!r){

result.YouTube="❌失败";
return;

}


let m=r.body.match(/"GL":"(.*?)"/);


if(m){

result.YouTube=
"🎉 支持 "+m[1];

}else{

result.YouTube="⚠️ 支持";

}


}




async function disney(){


let r=await req(
"https://www.disneyplus.com"
);


if(r&&r.status==200){

result.Disney="🎉 可访问";

}else{

result.Disney="🚫 不支持";

}


}




async function dazn(){


let r=await req(
"https://startup.core.indazn.com/misl/v5/Startup",
"POST",
JSON.stringify({

LandingPageKey:"generic",
Platform:"web",
Version:"2"

})
);


if(!r){

result.DAZN="❌失败";
return;

}


if(r.body.includes("GeolocatedCountry")){

result.DAZN="🎉 支持";

}else{

result.DAZN="🚫 不支持";

}

}




async function paramount(){


let r=
await req(
"https://www.paramountplus.com/"
);


if(r?.status==200){

result.Paramount="🎉 支持";

}else{

result.Paramount="🚫 不支持";

}


}




async function chatgpt(){


let r=
await req(
"https://chatgpt.com/cdn-cgi/trace"
);


if(!r){

result.ChatGPT="❌失败";
return;

}


let loc=
r.body.match(/loc=(.*)/);


if(loc){

result.ChatGPT=
"🎉 "+loc[1];

}else{

result.ChatGPT="🚫 不支持";

}


}




async function openai(){


let r=
await req(
"https://api.openai.com/"
);


if(r){

result.OpenAI="🎉 可连接";

}else{

result.OpenAI="❌失败";

}


}




async function tiktok(){


let r=
await req(
"https://www.tiktok.com/"
);


if(r?.status==200){

result.TikTok="🎉 可用";

}else{

result.TikTok="🚫";

}


}




async function spotify(){


let r=
await req(
"https://open.spotify.com/"
);


if(r?.status==200){

result.Spotify="🎉 可用";

}else{

result.Spotify="🚫";

}


}




async function main(){


await Promise.all([

netflix(),
youtube(),
disney(),
dazn(),
paramount(),
chatgpt(),
openai(),
tiktok(),
spotify()

]);



let html=`

<div style="
font-family:-apple-system;
font-size:16px;
line-height:2;
">


<h2>
📺 流媒体检测
</h2>


<p>
节点:
${nodeName}
</p>


<hr>


Netflix:
${result.Netflix}<br>

Disney+:
${result.Disney}<br>

YouTube:
${result.YouTube}<br>

DAZN:
${result.DAZN}<br>

Paramount+:
${result.Paramount}<br>

ChatGPT:
${result.ChatGPT}<br>

OpenAI:
${result.OpenAI}<br>

TikTok:
${result.TikTok}<br>

Spotify:
${result.Spotify}


</div>

`;


$done({

title:"流媒体检测",

htmlMessage:html

});


}


main();