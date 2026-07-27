let body = JSON.parse($response.body);

let url = $request.url;

if (/checkCount|consumeCount/.test(url)) {
  body.data.totalCount = 999;
  body.data.currCount = 999;
}

if (/createTtsAudio/.test(url)) {
  body.data.freeCount = 999;
}

$done({
  body: JSON.stringify(body)
});