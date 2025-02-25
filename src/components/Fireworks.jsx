import { useEffect, useRef } from "react";

const Fireworks = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        // Set canvas dimensions to full window size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles = [];

        // Helper to get a random value between min and max
        const random = (min, max) => Math.random() * (max - min) + min;

        // Create particles for one firework explosion
        const createFirework = () => {
        const x = random(0, canvas.width);
        const y = random(0, canvas.height / 2);
        const count = 50; // number of particles
        for (let i = 0; i < count; i++) {
            const angle = random(0, Math.PI * 2);
            const speed = random(2, 5);
            particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            life: random(30, 50),
            color: `hsl(${random(0, 360)}, 100%, 50%)`
            });
        }
        };

        let animationFrame;
        const animate = () => {
        animationFrame = requestAnimationFrame(animate);
        // Create a slight trailing effect
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw each particle
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.02;
            p.life--;
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();

            // Remove particles that have faded or expired
            if (p.alpha <= 0 || p.life <= 0) {
            particles.splice(i, 1);
            }
        }
        ctx.globalAlpha = 1;

        // Occasionally trigger a new firework
        if (Math.random() < 0.05) {
            createFirework();
        }
        };

        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, []);

    return (
        <canvas
        ref={canvasRef}
        style={{
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 3, // Ensure it appears above the tree but below the summary
        }}
        />
    );
};

export default Fireworks;
