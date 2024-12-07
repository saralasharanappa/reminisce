import React, { useEffect, useRef } from "react";

const ParticleBackground = ({ children }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particlesArray = [];
    const maxParticles = 100; // Increased number of particles

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();

    // Particle Class
    class Particle {
      x;
      y;
      size;
      speedX;
      speedY;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 2; // Increased size range
        this.speedX = Math.random() * 3 - 1.5; // Increased speed range
        this.speedY = Math.random() * 3 - 1.5; // Increased speed range
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges instead of bouncing
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"; // Increased opacity
        ctx.fill();
      }
    }

    // Initialize particles
    function initParticles() {
      particlesArray = [];
      for (let i = 0; i < maxParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    // Animate particles
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add slight blur effect for glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(255, 255, 255, 0.5)";

      particlesArray.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Reset shadow for next frame
      ctx.shadowBlur = 0;

      requestAnimationFrame(animateParticles);
    }

    // Handle canvas resizing
    function resizeCanvas() {
      updateCanvasSize();
      initParticles();
    }

    window.addEventListener("resize", resizeCanvas);

    // Initialize and animate
    initParticles();
    animateParticles();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background with gradient - moved before canvas */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-teal-600 opacity-90"></div>

      {/* Canvas with higher z-index */}
      <canvas ref={canvasRef} className="fixed inset-0 z-[1]"></canvas>

      {/* Content with highest z-index */}
      <div className="relative z-[2]">{children}</div>
    </div>
  );
};

export default ParticleBackground;
