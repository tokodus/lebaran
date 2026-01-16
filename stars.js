// Fullscreen Stars Background Animation
window.addEventListener('load', function() {
    const canvas = document.getElementById("starsCanvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    
    window.addEventListener('resize', function() {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
    });
    
    const s = 500;
    const stars = [];
    
    for(let i = 0; i < s; i++) {
        stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() + 1,
            b: Math.random()
        });
    }
    
    function draw() {
        requestAnimationFrame(draw);
        ctx.clearRect(0, 0, w, h);
        
        ctx.beginPath();
        ctx.fillStyle = "rgb(255, 204, 0)";
        
        for(let i = 0; i < s; i++) {
            const starAt = stars[i];
            ctx.moveTo(starAt.x, starAt.y);
            ctx.arc(starAt.x, starAt.y, starAt.r * Math.random(), 0, Math.PI * 2, true);
        }
        ctx.fill();
        update();
    }
    
    function update() {
        for(let i = 0; i < s; i++) {
            const ss = stars[i];
            if(i % 3) {
                ctx.shadowBlur = ss.b + Math.random() * 119;
                ctx.shadowColor = "#ffffff";
                stars[i] = {x: ss.x, y: ss.y, r: ss.r, b: ss.b + 1};
            } else {
                ctx.shadowBlur = ss.b + 3;
                ctx.shadowColor = "#ffffff";
                stars[i] = {x: ss.x, y: ss.y, r: ss.r * Math.random() + 1, b: ss.b};
            }
        }
    }
    
    draw();
});