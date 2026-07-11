$done({
    body: $response.body + `
    <script>
    window.addEventListener('load', ()=>{
        setInterval(()=>{
            document.querySelectorAll('.fixed, [style*="position:fixed"]').forEach(el=>{
                el.remove();
            })
        }, 200);
    })
    </script>
    `
});