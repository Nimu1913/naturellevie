import { useEffect, useState } from "react";

interface SmokeParticle {
  id: number;
  x: number;
  y: number;
}

export const CigarCursor = () => {
  const [particles, setParticles] = useState<SmokeParticle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let particleId = 0;
    let lastTime = 0;
    const throttleMs = 80; // Create particle every 80ms

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      const now = Date.now();
      if (now - lastTime > throttleMs) {
        lastTime = now;
        
        // Add new smoke particle with slight randomness
        const newParticle: SmokeParticle = {
          id: particleId++,
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
        };

        setParticles((prev) => [...prev.slice(-15), newParticle]);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Clean up old particles
  useEffect(() => {
    const cleanup = setInterval(() => {
      setParticles((prev) => prev.slice(-12));
    }, 500);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <>
      {/* Custom cursor style */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Custom cursor dot */}
      <div
        className="fixed pointer-events-none z-[99999] w-3 h-3 bg-brown-warm rounded-full mix-blend-difference"
        style={{
          left: mousePos.x - 6,
          top: mousePos.y - 6,
          transition: "left 0.05s, top 0.05s",
        }}
      />

      {/* Smoke particles */}
      {particles.map((particle, index) => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-[99998] rounded-full animate-smoke"
          style={{
            left: particle.x,
            top: particle.y,
            width: 8 + index * 2,
            height: 8 + index * 2,
            background: `radial-gradient(circle, rgba(180, 160, 140, ${0.4 - index * 0.025}) 0%, transparent 70%)`,
            transform: `translate(-50%, -50%)`,
            animation: `smoke 1.5s ease-out forwards`,
          }}
        />
      ))}

      {/* Keyframes for smoke animation */}
      <style>{`
        @keyframes smoke {
          0% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -150%) scale(2.5);
          }
        }
      `}</style>
    </>
  );
};

