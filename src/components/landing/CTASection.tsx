"use client";

import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import styles from "./CTASection.module.css";

const benefits = [
  "Registro gratuito para personas",
  "Análisis inteligente de residuos",
  "Conexión con gestores certificados",
  "Calculadora de impacto ambiental",
  "Dashboard de sostenibilidad",
];

export default function CTASection() {
  return (
    <section className={styles.section} id="cta">
      <div className={styles.bgGlow} />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.content}>
            <div className={styles.badge}>
              <Sparkles size={14} />
              <span>Comienza hoy</span>
            </div>
            <h2 className={styles.title}>
              Únete a la revolución de la{" "}
              <span className="gradient-text">economía circular</span>{" "}
              farmacéutica
            </h2>
            <p className={styles.description}>
              Más de 340 gestores biotecnológicos y 2,000+ empresas ya forman
              parte de nuestra red. Transforma tus residuos en oportunidades.
            </p>

            <ul className={styles.benefits}>
              {benefits.map((benefit) => (
                <li key={benefit} className={styles.benefitItem}>
                  <CheckCircle2 size={18} className={styles.checkIcon} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className={styles.ctaGroup}>
              <a href="/register" className={styles.ctaPrimary} id="cta-register">
                Crear cuenta gratis
                <ArrowRight size={18} />
              </a>
              <a href="#contact" className={styles.ctaLink}>
                ¿Eres empresa? Habla con ventas →
              </a>
            </div>
          </div>

          <div className={styles.visual}>
            <div className={styles.visualCard}>
              <div className={styles.visualHeader}>
                <div className={styles.dot + " " + styles.dotGreen} />
                <div className={styles.dot + " " + styles.dotYellow} />
                <div className={styles.dot + " " + styles.dotRed} />
              </div>
              <div className={styles.visualBody}>
                <div className={styles.visualRow}>
                  <span className={styles.visualLabel}>♻️ Residuos registrados</span>
                  <span className={styles.visualValue}>1,247</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: "78%" }} />
                </div>
                <div className={styles.visualRow}>
                  <span className={styles.visualLabel}>🌱 CO₂ evitado</span>
                  <span className={styles.visualValue}>3.2 ton</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFillSecondary}
                    style={{ width: "62%" }}
                  />
                </div>
                <div className={styles.visualRow}>
                  <span className={styles.visualLabel}>💰 Valor generado</span>
                  <span className={styles.visualValue}>$12,400</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFillAccent}
                    style={{ width: "45%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
