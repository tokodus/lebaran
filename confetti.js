// ============================================
// CONFETTI EFFECTS - Meriah & Smooth!
// ============================================

let confettiPieces = [];

// Create confetti burst - Warna-warni meriah!
function createConfettiBurst(x, y, z, delay) {
    setTimeout(() => {
        console.log('🎊 Confetti burst at', x, y, z);
        
        const colors = [
            0xffd700, // Gold
            0xff6b6b, // Red
            0x4ecdc4, // Cyan
            0xffe66d, // Yellow
            0x95e1d3, // Mint
            0xff6f91, // Pink
            0x00b894, // Green
            0xfdcb6e, // Orange
            0x6c5ce7, // Purple
            0xfd79a8  // Hot Pink
        ];
        
        const shapes = ['square', 'circle', 'rectangle'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            let geometry;
            if (shape === 'circle') {
                geometry = new THREE.CircleGeometry(0.08, 8);
            } else if (shape === 'rectangle') {
                geometry = new THREE.PlaneGeometry(0.15, 0.08);
            } else {
                geometry = new THREE.PlaneGeometry(0.1, 0.1);
            }
            
            const material = new THREE.MeshBasicMaterial({
                color: color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 1
            });
            
            const confetti = new THREE.Mesh(geometry, material);
            confetti.position.set(x, y, z);
            
            // Random explosion direction - meledak ke segala arah
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 0.5; // Lebih ke atas
            const speed = 0.1 + Math.random() * 0.12;
            
            confetti.userData.velocity = new THREE.Vector3(
                Math.sin(phi) * Math.cos(theta) * speed,
                Math.cos(phi) * speed + 0.1, // Extra lift up
                Math.sin(phi) * Math.sin(theta) * speed
            );
            
            confetti.userData.gravity = -0.0045;
            confetti.userData.rotationSpeed = new THREE.Vector3(
                (Math.random() - 0.5) * 0.3,
                (Math.random() - 0.5) * 0.3,
                (Math.random() - 0.5) * 0.3
            );
            confetti.userData.life = 150 + Math.random() * 100;
            confetti.userData.maxLife = confetti.userData.life;
            confetti.userData.shape = shape;
            
            scene.add(confetti);
            confettiPieces.push(confetti);
        }
    }, delay);
}

// Launch multiple confetti bursts - sequence!
function launchConfetti() {
    console.log('🎉 Launching confetti celebration!');
    
    const positions = [
        [-3, 3, -2],
        [3, 3, -2],
        [0, 4, -2],
        [-2, 2.5, -1],
        [2, 2.5, -1],
        [-3.5, 3.5, -1],
        [3.5, 3.5, -1],
        [0, 4.5, -1.5]
    ];
    
    positions.forEach((pos, i) => {
        createConfettiBurst(pos[0], pos[1], pos[2], i * 150);
    });
    
    // Show greeting card after confetti starts
    setTimeout(() => {
        contentOverlay.classList.add('visible');
        console.log('✅ Greeting card visible!');
    }, 1500);
}

// Update confetti animation - smooth falling & rotation
function updateConfetti() {
    confettiPieces.forEach((confetti, index) => {
        if (confetti.userData.life > 0) {
            // Apply velocity
            confetti.position.add(confetti.userData.velocity);
            
            // Apply gravity
            confetti.userData.velocity.y += confetti.userData.gravity;
            
            // Air resistance - slow down horizontal movement
            confetti.userData.velocity.x *= 0.99;
            confetti.userData.velocity.z *= 0.99;
            
            // Smooth rotation - spinning while falling
            confetti.rotation.x += confetti.userData.rotationSpeed.x;
            confetti.rotation.y += confetti.userData.rotationSpeed.y;
            confetti.rotation.z += confetti.userData.rotationSpeed.z;
            
            // Decrease life
            confetti.userData.life--;
            
            // Fade out smoothly in last 30 frames
            if (confetti.userData.life < 30) {
                confetti.material.opacity = confetti.userData.life / 30;
            }
            
        } else {
            // Remove confetti
            scene.remove(confetti);
            confetti.geometry.dispose();
            confetti.material.dispose();
            confettiPieces.splice(index, 1);
        }
    });
}