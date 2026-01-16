// ============================================
// POPUP SYSTEM - Super Smooth Fade Transition
// ============================================

let popupCardMesh = null;
let isPopupLaunched = false;
let cardTexture = null;

// Smooth easing functions
const easing = {
    easeOutCubic: t => 1 - Math.pow(1 - t, 3),
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeOutBack: t => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
};

// Create card texture with greeting content
function createCardTexture() {
    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = 500 * scale;
    canvas.height = 600 * scale;
    const ctx = canvas.getContext('2d');
    
    ctx.scale(scale, scale);
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f0f0f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 500, 600);
    
    // Border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, 480, 580);
    
    // Inner decoration border
    ctx.strokeStyle = '#2c5f2d';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(25, 25, 450, 550);
    ctx.setLineDash([]);
    
    // Text content
    ctx.textAlign = 'center';
    
    // "Selamat Hari Raya"
    ctx.fillStyle = '#2c5f2d';
    ctx.font = 'bold 38px Arial, sans-serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText('Selamat Hari Raya', 250, 180);
    
    // "Idul Fitri"
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 56px Arial, sans-serif';
    ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
    ctx.shadowBlur = 6;
    ctx.fillText('Idul Fitri', 250, 260);
    
    // "1446 H"
    ctx.fillStyle = '#666';
    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.shadowBlur = 2;
    ctx.fillText('1446 H', 250, 310);
    
    // Decorative line
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(150, 340);
    ctx.lineTo(350, 340);
    ctx.stroke();
    
    // Dua
    ctx.fillStyle = '#2c5f2d';
    ctx.font = 'italic 22px Arial, sans-serif';
    ctx.shadowBlur = 3;
    ctx.fillText('Minal Aidin Wal Faizin', 250, 390);
    ctx.fillText('Mohon Maaf Lahir & Batin', 250, 430);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // Ketupat left
    ctx.save();
    ctx.translate(80, 500);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = '#2c5f2d';
    ctx.fillRect(-22, -22, 44, 44);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.strokeRect(-22, -22, 44, 44);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-22, 0);
    ctx.lineTo(22, 0);
    ctx.moveTo(0, -22);
    ctx.lineTo(0, 22);
    ctx.stroke();
    ctx.restore();
    
    // Ketupat right
    ctx.save();
    ctx.translate(420, 500);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = '#2c5f2d';
    ctx.fillRect(-22, -22, 44, 44);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;
    ctx.strokeRect(-22, -22, 44, 44);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-22, 0);
    ctx.lineTo(22, 0);
    ctx.moveTo(0, -22);
    ctx.lineTo(0, 22);
    ctx.stroke();
    ctx.restore();
    
    // Crescent moon
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(250, 500, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.arc(262, 494, 24, 0, Math.PI * 2);
    ctx.fill();
    
    // Star
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    const starX = 280;
    const starY = 480;
    const spikes = 5;
    const outerRadius = 12;
    const innerRadius = 6;
    for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const x = starX + Math.cos(angle) * radius;
        const y = starY + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

// Launch card being pulled out from box
function launchPopupFromBox() {
    if (isPopupLaunched) return;
    isPopupLaunched = true;
    
    console.log('🎁 Card being pulled out from inside box!');
    
    // Get box position
    const boxPos = boxGroup.position.clone();
    const boxSize = window.innerWidth < 768 ? 2.5 : 3;
    const boxScale = boxGroup.scale.x;
    
    // Create card texture
    cardTexture = createCardTexture();
    
    // Create 3D card container
    const cardWidth = 2.5;
    const cardHeight = 3;
    const cardDepth = 0.05;
    
    const cardGeometry = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth);
    const cardMaterial = new THREE.MeshStandardMaterial({
        map: cardTexture,
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.1
    });
    
    popupCardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
    
    // START POSITION: Deep inside box, compressed vertically (squeezed)
    const startX = boxPos.x;
    const startY = boxPos.y - (boxSize * boxScale) / 2 + 0.15;
    const startZ = boxPos.z;
    
    popupCardMesh.position.set(startX, startY, startZ);
    popupCardMesh.scale.set(0.3, 0.05, 0.3);
    popupCardMesh.rotation.x = Math.PI / 6;
    
    // Add warm glow
    const cardLight = new THREE.PointLight(0xffd700, 1.5, 6);
    popupCardMesh.add(cardLight);
    
    scene.add(popupCardMesh);
    
    // Animation parameters
    popupCardMesh.userData = {
        startTime: Date.now(),
        startPos: new THREE.Vector3(startX, startY, startZ),
        targetPos: new THREE.Vector3(0, 2.5, -1),
        phase: 'pulling'
    };
    
    console.log(`📍 Card starting inside box at: x=${startX}, y=${startY}, z=${startZ}`);
}

// Main animation update
function updatePopupSystem() {
    if (!popupCardMesh) return;
    
    const currentTime = Date.now();
    const elapsed = currentTime - popupCardMesh.userData.startTime;
    
    // ============================================================
    // PHASE 1: PULLING OUT (0-700ms) 
    // ANIMASI INI TIDAK DIUBAH SAMA SEKALI - SUDAH SEMPURNA!
    // ============================================================
    if (popupCardMesh.userData.phase === 'pulling') {
        const duration = 700;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easing.easeOutCubic(progress);
        
        // Position: Smooth pull upward
        popupCardMesh.position.lerpVectors(
            popupCardMesh.userData.startPos,
            popupCardMesh.userData.targetPos,
            eased
        );
        
        // Scale: Expand from squeezed (0.3, 0.05, 0.3) to full (1, 1, 1)
        const scaleX = 0.3 + (0.7 * eased);
        const scaleY = 0.05 + (0.95 * eased);
        const scaleZ = 0.3 + (0.7 * eased);
        popupCardMesh.scale.set(scaleX, scaleY, scaleZ);
        
        // Rotation: Straighten up from tilted to upright
        popupCardMesh.rotation.x = (Math.PI / 6) * (1 - eased);
        
        // Slight wobble as it's pulled
        popupCardMesh.rotation.z = Math.sin(progress * Math.PI * 2) * 0.1 * (1 - progress);
        
        // Glow intensifies
        if (popupCardMesh.children[0]) {
            popupCardMesh.children[0].intensity = 1.5 + (progress * 0.5);
        }
        
        if (progress >= 1) {
            // Setelah animasi keluar dari box selesai, langsung fade out
            popupCardMesh.userData.phase = 'fadeOut';
            popupCardMesh.userData.fadeOutStartTime = currentTime;
            console.log('✨ Pull complete - Starting SUPER SMOOTH fade!');
        }
    }
    
    // ============================================================
    // PHASE 2: SUPER SMOOTH FADE OUT (700-1400ms) 
    // Durasi lebih pendek untuk transisi yang lebih cepat!
    // ============================================================
    else if (popupCardMesh.userData.phase === 'fadeOut') {
        const fadeElapsed = currentTime - popupCardMesh.userData.fadeOutStartTime;
        const fadeDuration = 700; // LEBIH CEPAT - dari 900ms jadi 700ms!
        const progress = Math.min(fadeElapsed / fadeDuration, 1);
        
        // Super smooth easing
        const easedFade = easing.easeInOutQuad(progress);
        
        // ===== POSITION: DIAM DI TEMPAT - TIDAK NAIK =====
        popupCardMesh.position.y = 2.5; // Tetap di posisi akhir pull
        popupCardMesh.position.x = 0;
        popupCardMesh.position.z = -1;
        
        // ===== SCALE: TETAP 1.0 - TIDAK MEMBESAR =====
        popupCardMesh.scale.set(1.0, 1.0, 1.0);
        
        // ===== ROTATION: Tetap stabil =====
        popupCardMesh.rotation.x = 0;
        popupCardMesh.rotation.y = 0;
        popupCardMesh.rotation.z = 0;
        
        // ===== FADE OUT: Very gradual and smooth =====
        if (popupCardMesh.material) {
            popupCardMesh.material.opacity = 1 - easedFade;
            popupCardMesh.material.transparent = true;
        }
        
        // ===== GLOW: Fade out smooth =====
        if (popupCardMesh.children[0]) {
            popupCardMesh.children[0].intensity = 2 * (1 - easedFade);
        }
        
        // ===== COMPLETE: Remove 3D card =====
        if (progress >= 1) {
            scene.remove(popupCardMesh);
            popupCardMesh = null;
            
            // Langsung tampilkan HTML tanpa delay!
            const contentOverlay = document.getElementById('contentOverlay');
            if (contentOverlay && !contentOverlay.classList.contains('visible')) {
                contentOverlay.classList.add('visible');
                console.log('✅ HTML overlay fading in IMMEDIATELY after 3D card removed!');
            }
            
            console.log('✅ 3D card removed - HTML overlay appearing now!');
        }
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        launchPopupFromBox,
        updatePopupSystem
    };
}