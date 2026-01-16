// Three.js Scene Setup
let scene, camera, renderer, boxGroup, flaps = [], isOpened = false, isAnimating = false;
let raycaster, mouse, particles = [];

// DOM Elements
const canvasContainer = document.getElementById('canvas-container');
const contentOverlay = document.getElementById('contentOverlay');
const clickInstruction = document.getElementById('clickInstruction');
const loading = document.getElementById('loading');

// Initialize Three.js
function init() {
    // Scene
    scene = new THREE.Scene();
scene.background = null;
    
    // Camera - responsive based on screen size
    const isMobile = window.innerWidth < 768;
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(6, 5, 8);
    camera.lookAt(0, 0, 0);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasContainer.appendChild(renderer.domElement);
    
    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight1.position.set(8, 10, 6);
    directionalLight1.castShadow = true;
    directionalLight1.shadow.mapSize.width = 2048;
    directionalLight1.shadow.mapSize.height = 2048;
    directionalLight1.shadow.camera.near = 0.5;
    directionalLight1.shadow.camera.far = 50;
    directionalLight1.shadow.camera.left = -10;
    directionalLight1.shadow.camera.right = 10;
    directionalLight1.shadow.camera.top = 10;
    directionalLight1.shadow.camera.bottom = -10;
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffd700, 0.2);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);
    
    const pointLight = new THREE.PointLight(0xffd700, 0.3, 20);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);
    
    // Create cardboard box
    createBox();
    
    // Create ground/shadow plane
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.25 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.6;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Raycaster for click detection
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Event listeners
    window.addEventListener('click', onCanvasClick);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    
    // Hide loading
    setTimeout(() => {
        loading.classList.add('hidden');
    }, 500);
    
    // Start animation
    animate();
    
    console.log('✅ Three.js scene initialized');
    console.log('📦 Box group:', boxGroup);
    console.log('🔲 Flaps:', flaps.length);
}

// Create realistic cardboard box with Three.js
function createBox() {
    // Remove old box if exists
    if (boxGroup) {
        scene.remove(boxGroup);
        flaps.forEach(f => scene.remove(f));
        flaps = [];
        boxGroup = null;
    }
    
    boxGroup = new THREE.Group();
    boxGroup.userData.isClickable = true;
    
    // Cardboard material with realistic texture
    const cardboardTexture = createCardboardTexture();
    const cardboardMaterial = new THREE.MeshStandardMaterial({
        map: cardboardTexture,
        roughness: 0.85,
        metalness: 0.1,
        color: 0xb89968
    });
    
    // Responsive box size - Smaller for mobile
    const isMobile = window.innerWidth < 768;
    const boxSize = isMobile ? 2.5 : 3;
    const wallThickness = 0.08;
    
    console.log(`📦 Creating box - Mobile: ${isMobile}, Size: ${boxSize}, Screen: ${window.innerWidth}x${window.innerHeight}`);
    
    // BOTTOM
    const bottom = new THREE.Mesh(
        new THREE.BoxGeometry(boxSize, wallThickness, boxSize),
        cardboardMaterial
    );
    bottom.position.y = -boxSize/2;
    bottom.castShadow = true;
    bottom.receiveShadow = true;
    boxGroup.add(bottom);
    
    // FRONT WALL
    const front = new THREE.Mesh(
        new THREE.BoxGeometry(boxSize, boxSize, wallThickness),
        cardboardMaterial
    );
    front.position.z = boxSize/2;
    front.castShadow = true;
    front.receiveShadow = true;
    boxGroup.add(front);
    
    // BACK WALL
    const back = new THREE.Mesh(
        new THREE.BoxGeometry(boxSize, boxSize, wallThickness),
        cardboardMaterial
    );
    back.position.z = -boxSize/2;
    back.castShadow = true;
    back.receiveShadow = true;
    boxGroup.add(back);
    
    // LEFT WALL
    const left = new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness, boxSize, boxSize),
        cardboardMaterial
    );
    left.position.x = -boxSize/2;
    left.castShadow = true;
    left.receiveShadow = true;
    boxGroup.add(left);
    
    // RIGHT WALL
    const right = new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness, boxSize, boxSize),
        cardboardMaterial
    );
    right.position.x = boxSize/2;
    right.castShadow = true;
    right.receiveShadow = true;
    boxGroup.add(right);
    
    // CREATE 4 TOP FLAPS - CLOSED POSITION (all meeting in center)
    const flapSize = boxSize * 0.52;
    const flapOffset = 0.02;
    
    // FRONT FLAP (lying flat on top, extends toward front from center)
    const flapFront = new THREE.Mesh(
        new THREE.BoxGeometry(boxSize - flapOffset, wallThickness, flapSize),
        cardboardMaterial
    );
    flapFront.position.set(0, boxSize/2, flapSize/2);
    flapFront.castShadow = true;
    flapFront.receiveShadow = true;
    flapFront.userData.name = 'front';
    flapFront.userData.initialPos = flapFront.position.clone();
    flapFront.userData.axis = 'x';
    flapFront.userData.pivotZ = flapSize/2;
    boxGroup.add(flapFront);
    flaps.push(flapFront);
    
    // BACK FLAP
    const flapBack = new THREE.Mesh(
        new THREE.BoxGeometry(boxSize - flapOffset, wallThickness, flapSize),
        cardboardMaterial
    );
    flapBack.position.set(0, boxSize/2, -flapSize/2);
    flapBack.castShadow = true;
    flapBack.receiveShadow = true;
    flapBack.userData.name = 'back';
    flapBack.userData.initialPos = flapBack.position.clone();
    flapBack.userData.axis = 'x';
    flapBack.userData.pivotZ = -flapSize/2;
    boxGroup.add(flapBack);
    flaps.push(flapBack);
    
    // LEFT FLAP
    const flapLeft = new THREE.Mesh(
        new THREE.BoxGeometry(flapSize, wallThickness, boxSize - flapOffset),
        cardboardMaterial
    );
    flapLeft.position.set(-flapSize/2, boxSize/2, 0);
    flapLeft.castShadow = true;
    flapLeft.receiveShadow = true;
    flapLeft.userData.name = 'left';
    flapLeft.userData.initialPos = flapLeft.position.clone();
    flapLeft.userData.axis = 'z';
    flapLeft.userData.pivotX = flapSize/2;
    boxGroup.add(flapLeft);
    flaps.push(flapLeft);
    
    // RIGHT FLAP
    const flapRight = new THREE.Mesh(
        new THREE.BoxGeometry(flapSize, wallThickness, boxSize - flapOffset),
        cardboardMaterial
    );
    flapRight.position.set(flapSize/2, boxSize/2, 0);
    flapRight.castShadow = true;
    flapRight.receiveShadow = true;
    flapRight.userData.name = 'right';
    flapRight.userData.initialPos = flapRight.position.clone();
    flapRight.userData.axis = 'z';
    flapRight.userData.pivotX = -flapSize/2;
    boxGroup.add(flapRight);
    flaps.push(flapRight);
    
  // ADD BLACK LINE - HORIZONTAL LURUS dari KIRI ke KANAN
    const lineMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.0,
        metalness: 0.2
    });
    
    // Garis horizontal lurus dari kiri ke kanan - PAS KE SISI
    const lineLength = boxSize * 1.05;
    const lineWidth = 0.05;
    
    blackLine = new THREE.Mesh(
        new THREE.PlaneGeometry(lineLength, lineWidth),
        lineMaterial
    );
    
    // Rotasi X untuk flat di atas box
    blackLine.rotation.x = -Math.PI / 2;
    
    // Rotasi Z = 90 derajat agar garis HORIZONTAL (kiri-kanan)
    blackLine.rotation.z = Math.PI / 2; // 90 derajat
    
    // Posisi di tengah atas box, lebih pas
    blackLine.position.set(0, boxSize/2 + 0.05, 0.03);
    
    boxGroup.add(blackLine);
    
    console.log('✅ Garis hitam HORIZONTAL kiri-kanan');
    
    // ADD LOGO
    const logoCanvas = document.createElement('canvas');
    logoCanvas.width = 512;
    logoCanvas.height = 600;
    const logoCtx = logoCanvas.getContext('2d');
    
    logoCtx.clearRect(0, 0, 512, 600);
    
    const logoImg = new Image();
    logoImg.crossOrigin = 'anonymous';
    
    logoImg.onload = function() {
        const logoSize = 220;
        const logoX = (512 - logoSize) / 2;
        const logoY = 80;
        logoCtx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
        
        logoCtx.fillStyle = '#2c1810';
        logoCtx.font = 'bold 64px Arial, sans-serif';
        logoCtx.textAlign = 'center';
        logoCtx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        logoCtx.shadowBlur = 6;
        logoCtx.shadowOffsetX = 2;
        logoCtx.shadowOffsetY = 2;
        logoCtx.fillText('TokoDus', 256, 400);
        
        updateLogoTexture();
        console.log('✅ Logo loaded from file!');
    };
    
    logoImg.onerror = function() {
        console.log('⚠️ Using fallback logo');
        
        logoCtx.fillStyle = '#c9985f';
        logoCtx.beginPath();
        logoCtx.moveTo(256, 120);
        logoCtx.lineTo(356, 170);
        logoCtx.lineTo(356, 270);
        logoCtx.lineTo(256, 320);
        logoCtx.lineTo(156, 270);
        logoCtx.lineTo(156, 170);
        logoCtx.closePath();
        logoCtx.fill();
        
        logoCtx.fillStyle = '#8B7355';
        logoCtx.beginPath();
        logoCtx.moveTo(256, 120);
        logoCtx.lineTo(156, 170);
        logoCtx.lineTo(156, 270);
        logoCtx.lineTo(256, 320);
        logoCtx.closePath();
        logoCtx.fill();
        
        logoCtx.fillStyle = '#d4af37';
        logoCtx.beginPath();
        logoCtx.moveTo(256, 120);
        logoCtx.lineTo(356, 170);
        logoCtx.lineTo(256, 220);
        logoCtx.lineTo(156, 170);
        logoCtx.closePath();
        logoCtx.fill();
        
        logoCtx.fillStyle = '#2c1810';
        logoCtx.font = 'bold 64px Arial, sans-serif';
        logoCtx.textAlign = 'center';
        logoCtx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        logoCtx.shadowBlur = 6;
        logoCtx.shadowOffsetX = 2;
        logoCtx.shadowOffsetY = 2;
        logoCtx.fillText('TokoDus', 256, 420);
        
        updateLogoTexture();
    };
    
    function updateLogoTexture() {
        const combinedTexture = new THREE.CanvasTexture(logoCanvas);
        combinedTexture.needsUpdate = true;
        
        const logoMaterial = new THREE.MeshBasicMaterial({
            map: combinedTexture,
            transparent: true,
            opacity: 1,
            side: THREE.FrontSide
        });
        
        const logoPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(boxSize * 0.75, boxSize * 0.85),
            logoMaterial
        );
        logoPlane.position.set(0, 0.1, boxSize/2 + 0.07);
        boxGroup.add(logoPlane);
    }
    
        logoImg.src = 'https://i.ibb.co.com/ymPbfcL9/logo-icon.png';
    
    boxGroup.position.y = 0;
    scene.add(boxGroup);
    
    if (isMobile) {
        boxGroup.scale.set(0.65, 0.65, 0.65);
    }
    
    console.log('📦 Box created with', flaps.length, 'flaps');
}

// Create procedural cardboard texture
function createCardboardTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#b89968';
    ctx.fillRect(0, 0, 512, 512);
    
    for (let i = 0; i < 8000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const brightness = Math.random() * 30 - 15;
        const alpha = Math.random() * 0.4;
        ctx.fillStyle = `rgba(${139 + brightness}, ${115 + brightness}, ${85 + brightness}, ${alpha})`;
        ctx.fillRect(x, y, Math.random() * 3 + 1, Math.random() * 3 + 1);
    }
    
    ctx.strokeStyle = 'rgba(100, 80, 60, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 80; i++) {
        ctx.beginPath();
        const x = Math.random() * 512;
        ctx.moveTo(x, 0);
        ctx.lineTo(x + (Math.random() - 0.5) * 20, 512);
        ctx.stroke();
    }
    
    ctx.strokeStyle = 'rgba(80, 60, 40, 0.2)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, Math.random() * 512);
        ctx.lineTo(Math.random() * 512, Math.random() * 512);
        ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    return texture;
}

// Open box animation - SEQUENTIAL
function openBox() {
    if (isOpened || isAnimating) return;
    
    console.log('🎁 Opening box - Sequential animation...');
    isAnimating = true;
    clickInstruction.classList.add('hidden');
    
    if (boxGroup) {
        boxGroup.position.y = 0;
        boxGroup.rotation.y = 0;
    }
    
    const duration = 2000;
    const startTime = Date.now();
    
    function animateFlaps() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const phase1Progress = Math.min(Math.max((progress - 0) / 0.5, 0), 1);
        const phase2Progress = Math.min(Math.max((progress - 0.4) / 0.5, 0), 1);
        
        const eased1 = 1 - Math.pow(1 - phase1Progress, 3);
        const eased2 = 1 - Math.pow(1 - phase2Progress, 3);
        
        const openAngle = Math.PI * 0.52;
        
        flaps.forEach((flap) => {
            const name = flap.userData.name;
            const axis = flap.userData.axis;
            
            flap.rotation.set(0, 0, 0);
            flap.position.copy(flap.userData.initialPos);
             if (blackLine && elapsed > 10) {
            const fadeProgress = Math.min((elapsed - 0.7) / 0.7, 1); // Fade out dalam 0.5 detik
            blackLine.material.opacity = 1 - fadeProgress;
            blackLine.material.transparent = true;
            
            // Hapus total setelah fade
            if (fadeProgress >= 1) {
                boxGroup.remove(blackLine);
                blackLine = null;
            }
        }
            if (axis === 'z') {
                const pivotX = flap.userData.pivotX;
                const angle = openAngle * eased1;
                
                if (name === 'left') {
                    flap.rotation.z = angle;
                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);
                    const radius = Math.abs(pivotX);
                    flap.position.x = flap.userData.initialPos.x - radius * (1 - cos);
                    flap.position.y = flap.userData.initialPos.y + radius * sin;
                    flap.position.z = flap.userData.initialPos.z;
                } else if (name === 'right') {
                    flap.rotation.z = -angle;
                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);
                    const radius = Math.abs(pivotX);
                    flap.position.x = flap.userData.initialPos.x + radius * (1 - cos);
                    flap.position.y = flap.userData.initialPos.y + radius * sin;
                    flap.position.z = flap.userData.initialPos.z;
                }
            } else if (axis === 'x') {
                const pivotZ = flap.userData.pivotZ;
                const angle = openAngle * eased2;
                
                if (name === 'front') {
                    flap.rotation.x = angle;
                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);
                    const radius = Math.abs(pivotZ);
                    flap.position.z = flap.userData.initialPos.z + radius * (1 - cos);
                    flap.position.y = flap.userData.initialPos.y + radius * sin;
                    flap.position.x = flap.userData.initialPos.x;
                } else if (name === 'back') {
                    flap.rotation.x = -angle;
                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);
                    const radius = Math.abs(pivotZ);
                    flap.position.z = flap.userData.initialPos.z - radius * (1 - cos);
                    flap.position.y = flap.userData.initialPos.y + radius * sin;
                    flap.position.x = flap.userData.initialPos.x;
                }
            }
        });
        
        if (progress < 1) {
            requestAnimationFrame(animateFlaps);
        } else {
            console.log('✅ Box fully opened - Starting confetti fountain!');
            isOpened = true;
            isAnimating = false;
            canvasContainer.classList.add('opened');
            
            // Launch CONFETTI FOUNTAIN - lebih lambat dan bertahap!
            setTimeout(() => {
                console.log('🎊 Launching CONFETTI FOUNTAIN!');
                
                const colors = [0xffd700, 0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3];
                
                // Launch confetti waves dengan jeda lebih panjang
                colors.forEach((color, i) => {
                    createFirework(0, 0, 0, color, i * 400); // Delay 400ms antar wave
                });
                
                // Launch popup card SETELAH confetti mulai
                setTimeout(() => {
                    launchPopupFromBox();
                }, 2200); // Lebih lama untuk menikmati confetti
                
            }, 400);
        }
    }
    
    animateFlaps();
}

// Mouse move handler
function onMouseMove(event) {
    if (isOpened || isAnimating) return;
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(boxGroup, true);
    
    if (intersects.length > 0) {
        canvasContainer.style.cursor = 'pointer';
    } else {
        canvasContainer.style.cursor = 'default';
    }
}

// Click handler
function onCanvasClick(event) {
    if (isOpened || isAnimating) return;
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(boxGroup, true);
    
    console.log('🖱️ Click detected, intersects:', intersects.length);
    
    if (intersects.length > 0) {
        openBox();
    }
}

// Touch handler for mobile
function onTouchStart(event) {
    if (isOpened || isAnimating) return;
    
    event.preventDefault();
    const touch = event.touches[0];
    
    mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(boxGroup, true);
    
    if (intersects.length > 0) {
        openBox();
    }
}

// Window resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const isMobile = window.innerWidth < 768;
    camera.position.set(6, 5, 8);
    camera.lookAt(0, 0, 0);
    
    if (boxGroup && !isOpened && !isAnimating) {
        scene.remove(boxGroup);
        flaps = [];
        createBox();
    }
}

// Animation loop
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    
    if (!isOpened && !isAnimating && boxGroup) {
        boxGroup.position.y = Math.sin(time * 0.8) * 0.08;
        boxGroup.rotation.y = Math.sin(time * 0.5) * 0.03;
    }
    
    if (isOpened && boxGroup) {
        const targetScale = 0.5;
        const targetY = -1.2;
        
        if (boxGroup.scale.x > targetScale) {
            const scaleSpeed = 0.01;
            boxGroup.scale.x -= scaleSpeed;
            boxGroup.scale.y -= scaleSpeed;
            boxGroup.scale.z -= scaleSpeed;
            
            if (boxGroup.scale.x < targetScale) {
                boxGroup.scale.set(targetScale, targetScale, targetScale);
            }
        }
        
        if (boxGroup.position.y > targetY) {
            boxGroup.position.y -= 0.015;
            if (boxGroup.position.y < targetY) {
                boxGroup.position.y = targetY;
            }
        }
        
        boxGroup.rotation.y = 0;
    }
    
    updateParticles();
    updatePopupSystem();
    
    renderer.render(scene, camera);
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'Enter') && !isOpened && !isAnimating) {
        e.preventDefault();
        openBox();
    }
});

// Initialize when ready
if (typeof THREE !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
} else {
    console.error('❌ Three.js not loaded');
}

console.log('🎁 Kardus 3D Idul Fitri dengan Three.js');
console.log('📱 Klik kardus untuk membuka');
console.log('⌨️  Tekan Spasi atau Enter untuk membuka');