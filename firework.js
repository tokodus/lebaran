// ============================================
// CONFETTI & ORNAMENTS EFFECTS - MERIAH! 🎊🎉⭐🎈
// Total: 135 pieces (Confetti + Stars + Balloons only!)
// ============================================

// Create confetti particles that shoot out from box
function createParticles() {
    const particleGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    const colors = [0xffd700, 0xffa500, 0xffff00];
    
    for (let i = 0; i < 60; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const particleMaterial = new THREE.MeshBasicMaterial({ color: color });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        const angle = (Math.PI * 2 * i) / 60;
        const radius = 0.3 + Math.random() * 0.7;
        
        particle.position.set(
            Math.cos(angle) * radius,
            0.5,
            Math.sin(angle) * radius
        );
        
        particle.userData.velocity = new THREE.Vector3(
            Math.cos(angle) * (0.03 + Math.random() * 0.03),
            0.08 + Math.random() * 0.06,
            Math.sin(angle) * (0.03 + Math.random() * 0.03)
        );
        
        particle.userData.gravity = -0.004;
        particle.userData.life = 120 + Math.random() * 80;
        particle.userData.maxLife = particle.userData.life;
        
        scene.add(particle);
        particles.push(particle);
    }
}

// Create CONFETTI effect - NYEBAR KEMANA-MANA seperti EXPLOSION!
function createFirework(targetX, targetY, targetZ, color, delay) {
    setTimeout(() => {
        // CONFETTI MUNCUL DARI ATAS BOX
        const boxPos = boxGroup.position.clone();
        const boxSize = window.innerWidth < 768 ? 2.5 : 3;
        const boxScale = boxGroup.scale.x;
        
        // START POSITION: TEPAT DI ATAS BOX (mulut box yang terbuka)
        const startX = boxPos.x;
        const startY = boxPos.y + (boxSize * boxScale) / 2 - 0.2; // Di ATAS box
        const startZ = boxPos.z;
        
        console.log(`🎊 Confetti EXPLOSION dari box: x=${startX}, y=${startY}, z=${startZ}`);
        
        explodeConfetti(startX, startY, startZ, color);
        
        // TAMBAHAN ORNAMEN - spawn dengan delay kecil untuk efek bertahap!
        setTimeout(() => explodeStars(startX, startY, startZ), 100);
        setTimeout(() => explodeBalloons(startX, startY, startZ), 300);
    }, delay);
}

// ============================================
// CONFETTI - Kertas warna-warni! (90 pieces)
// ============================================
function explodeConfetti(x, y, z, baseColor) {
    const confettiCount = 20; // Dikurangi dari 120
    
    const confettiColors = [
        0xff6b6b, 0xffd700, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xff8fab,
        0xa8e6cf, 0xffd93d, 0x6bcf7f, 0xff9ff3, 0xffaaa5, 0x87ceeb
    ];
    
    for (let i = 0; i < confettiCount; i++) {
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        
        const width = 0.08 + Math.random() * 0.08;
        const height = 0.15 + Math.random() * 0.1;
        const depth = 0.01;
        
        const confettiGeometry = new THREE.BoxGeometry(width, height, depth);
        const confettiMaterial = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.3,
            roughness: 0.4,
            side: THREE.DoubleSide
        });
        const confetti = new THREE.Mesh(confettiGeometry, confettiMaterial);
        
        confetti.position.set(x, y, z);
        
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.8;
        const speedVariation = 0.8 + Math.random() * 0.8;
        const baseSpeed = 0.08;
        const speed = baseSpeed * speedVariation;
        
        confetti.userData.velocity = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta) * speed,
            Math.cos(phi) * speed * 1.2 + 0.03,
            Math.sin(phi) * Math.sin(theta) * speed
        );
        
        confetti.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        
        confetti.userData.rotationVelocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
        );
        
        confetti.userData.gravity = -0.0018;
        confetti.userData.life = 350 + Math.random() * 200;
        confetti.userData.maxLife = confetti.userData.life;
        confetti.userData.type = 'confetti';
        
        confetti.userData.spawnDelay = Math.floor(i / 3);
        confetti.userData.isActive = false;
        confetti.visible = false;
        
        scene.add(confetti);
        particles.push(confetti);
    }
    
    console.log(`🎉 CONFETTI EXPLOSION! ${confettiCount} pieces!`);
}

// ============================================
// BINTANG/STARS - Sparkly stars! ✨⭐ (30 pieces)
// ============================================
function explodeStars(x, y, z) {
    const starCount = 10;
    const starColors = [0xffd700, 0xffff00, 0xffa500, 0xffeb3b, 0xffc107];
    
    for (let i = 0; i < starCount; i++) {
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        
        // Bintang dengan torusGeometry untuk efek 3D
        const starGeometry = new THREE.TorusGeometry(0.08, 0.03, 8, 5);
        const starMaterial = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.8,
            roughness: 0.2,
            emissive: color,
            emissiveIntensity: 0.5
        });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        
        star.position.set(x, y, z);
        
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.75;
        const speed = 0.07 + Math.random() * 0.05;
        
        star.userData.velocity = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta) * speed,
            Math.cos(phi) * speed * 1.15 + 0.025,
            Math.sin(phi) * Math.sin(theta) * speed
        );
        
        star.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        
        star.userData.rotationVelocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.25,
            (Math.random() - 0.5) * 0.25,
            (Math.random() - 0.5) * 0.25
        );
        
        star.userData.gravity = -0.002;
        star.userData.life = 380 + Math.random() * 180;
        star.userData.maxLife = star.userData.life;
        star.userData.type = 'star';
        
        // Pulse effect untuk stars
        star.userData.pulseSpeed = 0.05 + Math.random() * 0.05;
        star.userData.pulsePhase = Math.random() * Math.PI * 2;
        
        star.userData.spawnDelay = Math.floor(i / 2);
        star.userData.isActive = false;
        star.visible = false;
        
        scene.add(star);
        particles.push(star);
    }
    
    console.log(`⭐ STARS EXPLOSION! ${starCount} stars!`);
}

// ============================================
// BALON/BALLOONS - Mengapung naik! 🎈 (15 pieces)
// ============================================
function explodeBalloons(x, y, z) {
    const balloonCount = 7;
    const balloonColors = [
        0xff6b6b, 0x4ecdc4, 0x45b7d1, 0xf7dc6f, 0xbb8fce,
        0xf8b500, 0xff69b4, 0x98d8c8, 0xf7b731, 0x5f27cd
    ];
    
    for (let i = 0; i < balloonCount; i++) {
        const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        
        // Balon berbentuk sphere dengan scale oval
        const balloonGeometry = new THREE.SphereGeometry(0.12, 12, 12); // Dikurangi segments
        const balloonMaterial = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.3,
            roughness: 0.5,
            emissive: color,
            emissiveIntensity: 0.2
        });
        const balloon = new THREE.Mesh(balloonGeometry, balloonMaterial);
        
        // Scale untuk bentuk oval (balon)
        balloon.scale.set(0.9, 1.2, 0.9);
        
        balloon.position.set(x, y, z);
        
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.65;
        const speed = 0.05 + Math.random() * 0.03;
        
        balloon.userData.velocity = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta) * speed * 0.5, // Lebih lambat horizontal
            Math.cos(phi) * speed * 1.3 + 0.04, // NAIK ke atas lebih dominan!
            Math.sin(phi) * Math.sin(theta) * speed * 0.5
        );
        
        balloon.userData.rotationVelocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1
        );
        
        balloon.userData.gravity = -0.0005; // Balon ringan, gravitasi kecil
        balloon.userData.life = 450 + Math.random() * 200;
        balloon.userData.maxLife = balloon.userData.life;
        balloon.userData.type = 'balloon';
        
        // Floating effect - goyang-goyang naik
        balloon.userData.floatSpeed = 0.03 + Math.random() * 0.02;
        balloon.userData.floatPhase = Math.random() * Math.PI * 2;
        
        balloon.userData.spawnDelay = Math.floor(i / 2);
        balloon.userData.isActive = false;
        balloon.visible = false;
        
        scene.add(balloon);
        particles.push(balloon);
    }
    
    console.log(`🎈 BALLOONS EXPLOSION! ${balloonCount} balloons floating up!`);
}

// ============================================
// UPDATE PARTICLES - Animasi semua ornamen!
// ============================================
function updateParticles() {
    particles.forEach((particle, index) => {
        // Handle spawn delay
        if (!particle.userData.isActive) {
            if (particle.userData.spawnDelay !== undefined) {
                particle.userData.spawnDelay--;
                if (particle.userData.spawnDelay <= 0) {
                    particle.userData.isActive = true;
                    particle.visible = true;
                }
            } else {
                particle.userData.isActive = true;
                particle.visible = true;
            }
            return;
        }
        
        if (particle.userData.life > 0) {
            // Update position
            particle.position.add(particle.userData.velocity);
            
            // Apply gravity
            particle.userData.velocity.y += particle.userData.gravity;
            
            // Update rotation
            if (particle.userData.rotationVelocity) {
                particle.rotation.x += particle.userData.rotationVelocity.x;
                particle.rotation.y += particle.userData.rotationVelocity.y;
                particle.rotation.z += particle.userData.rotationVelocity.z;
            }
            
            // Air resistance
            particle.userData.velocity.multiplyScalar(0.992);
            
            // Wind effect
            if (particle.userData.life > 50) {
                const windStrength = 0.0008;
                particle.userData.velocity.x += (Math.random() - 0.5) * windStrength;
                particle.userData.velocity.z += (Math.random() - 0.5) * windStrength;
            }
            
            // SPECIAL EFFECTS per type
            const type = particle.userData.type;
            
            // Stars - Pulse effect
            if (type === 'star' && particle.userData.pulseSpeed) {
                particle.userData.pulsePhase += particle.userData.pulseSpeed;
                const pulse = 0.85 + Math.sin(particle.userData.pulsePhase) * 0.15;
                particle.scale.setScalar(pulse);
                
                // Brightness pulse
                if (particle.material.emissiveIntensity !== undefined) {
                    particle.material.emissiveIntensity = 0.3 + Math.sin(particle.userData.pulsePhase) * 0.3;
                }
            }
            
            // Balloons - Floating wobble
            if (type === 'balloon' && particle.userData.floatSpeed) {
                particle.userData.floatPhase += particle.userData.floatSpeed;
                const wobbleX = Math.sin(particle.userData.floatPhase) * 0.001;
                const wobbleZ = Math.cos(particle.userData.floatPhase * 1.3) * 0.001;
                particle.position.x += wobbleX;
                particle.position.z += wobbleZ;
            }
            
            particle.userData.life--;
            
            // Fade out
            const lifePercent = particle.userData.life / particle.userData.maxLife;
            if (particle.material.opacity !== undefined) {
                particle.material.transparent = true;
                if (lifePercent < 0.25) {
                    particle.material.opacity = lifePercent / 0.25;
                } else {
                    particle.material.opacity = 1;
                }
            }
            
            // Scale down saat hampir habis (kecuali stars yang punya pulse sendiri)
            if (lifePercent < 0.15 && type !== 'star') {
                const scaleValue = Math.max(lifePercent / 0.15, 0.3);
                particle.scale.setScalar(scaleValue);
            }
        } else {
            scene.remove(particle);
            particles.splice(index, 1);
        }
    });
}

// ============================================
// 🎊 TOTAL PARTICLES: 135 pieces! 🎊
// Confetti: 90 | Stars: 30 | Balloons: 15
// ============================================