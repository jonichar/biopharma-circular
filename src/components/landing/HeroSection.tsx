"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Play, Sparkles, Recycle, Leaf, Pill } from "lucide-react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
      type: "circle" | "hexagon" | "cross";

      constructor(canvasW: number, canvasH: number) {
        this.x = Math.random() * canvasW;
        this.y = Math.random() * canvasH;
        this.size = Math.random() * 4 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.hue = Math.random() > 0.5 ? 160 : 240;
        const types: ("circle" | "hexagon" | "cross")[] = [
          "circle",
          "hexagon",
          "cross",
        ];
        this.type = types[Math.floor(Math.random() * types.length)];
      }

      update(canvasW: number, canvasH: number) {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvasW) this.speedX *= -1;
        if (this.y < 0 || this.y > canvasH) this.speedY *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, 1)`;
        ctx.strokeStyle = `hsla(${this.hue}, 70%, 60%, 0.5)`;

        if (this.type === "circle") {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.type === "hexagon") {
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const px = this.x + this.size * Math.cos(angle);
            const py = this.y + this.size * Math.sin(angle);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        } else {
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(this.x - this.size, this.y);
          ctx.lineTo(this.x + this.size, this.y);
          ctx.moveTo(this.x, this.y - this.size);
          ctx.lineTo(this.x, this.y + this.size);
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      for (let i = 0; i < 60; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16, 185, 129, ${
              0.08 * (1 - dist / 120)
            })`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx);
      });
      drawConnections();
      animationId = requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className={styles.hero} id="hero">
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Decorative orbs */}
      <div className={styles.orbPrimary} />
      <div className={styles.orbSecondary} />
      <div className={styles.orbAccent} />

      <div className={styles.container}>
        {/* Badge */}
        <div className={styles.badge}>
          <Sparkles size={14} />
          <span>Economía Circular + Biotecnología + Farmacia</span>
        </div>

        {/* Title */}
        <h1 className={styles.title}>
          Transformamos{" "}
          <span className={styles.highlight}>residuos farmacéuticos</span> en{" "}
          <span className={styles.highlightSecondary}>
            oportunidades económicas
          </span>
        </h1>

        {/* Subtitle */}
        <p className={styles.subtitle}>
          Conectamos ciudadanos, empresas y gestores biotecnológicos en una
          plataforma inteligente para la gestión, clasificación y valorización de
          residuos farmacéuticos y biológicos.
        </p>

        {/* CTA Buttons */}
        <div className={styles.ctaGroup}>
          <a href="/register" className={styles.ctaPrimary} id="hero-cta-primary">
            Comenzar ahora
            <ArrowRight size={18} />
          </a>
          <a href="#como-funciona" className={styles.ctaSecondary} id="hero-cta-secondary">
            <Play size={16} />
            Cómo funciona
          </a>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <Recycle size={20} />
            </div>
            <div>
              <span className={styles.statNumber}>12.5K+</span>
              <span className={styles.statLabel}>Toneladas recicladas</span>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <Leaf size={20} />
            </div>
            <div>
              <span className={styles.statNumber}>8.2K</span>
              <span className={styles.statLabel}>Ton CO₂ evitadas</span>
            </div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <Pill size={20} />
            </div>
            <div>
              <span className={styles.statNumber}>340+</span>
              <span className={styles.statLabel}>Gestores conectados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollDot} />
      </div>
    </section>
  );
}
