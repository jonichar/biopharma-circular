"use client";

import {
  ClipboardList,
  Brain,
  MapPin,
  Calculator,
  Building2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import styles from "./FeaturesSection.module.css";

const features = [
  {
    icon: ClipboardList,
    title: "Registro de Residuos",
    description:
      "Registra residuos farmacéuticos, orgánicos o químicos con tipo, cantidad y ubicación. Para hogares y empresas.",
    color: "primary",
    tag: "Personas & Empresas",
  },
  {
    icon: Brain,
    title: "Sistema Inteligente",
    description:
      "Análisis automático de riesgo químico, disposición correcta y posible uso biotecnológico de cada residuo.",
    color: "secondary",
    tag: "IA Simulada",
  },
  {
    icon: MapPin,
    title: "Conexión con Gestores",
    description:
      "Mapa interactivo de gestores biotecnológicos que recogen y transforman residuos en productos útiles.",
    color: "accent",
    tag: "Marketplace",
  },
  {
    icon: Calculator,
    title: "Calculadora de Impacto",
    description:
      "Mide tu huella: CO₂ evitado, contaminación reducida y valor económico generado por tu gestión de residuos.",
    color: "primary",
    tag: "Métricas",
  },
  {
    icon: Building2,
    title: "Módulo Empresarial",
    description:
      "Reportes de sostenibilidad, gestión de residuos regulados y cumplimiento normativo ambiental.",
    color: "secondary",
    tag: "B2B",
  },
  {
    icon: ShieldCheck,
    title: "Clasificación Química",
    description:
      "Evaluación de toxicidad, estabilidad e impacto ambiental de cada compuesto y fármaco registrado.",
    color: "accent",
    tag: "Química",
  },
];

export default function FeaturesSection() {
  return (
    <section className={styles.section} id="features">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>Características</span>
          <h2 className={styles.title}>
            Todo lo que necesitas para una{" "}
            <span className="gradient-text">gestión circular</span>
          </h2>
          <p className={styles.subtitle}>
            Desde el registro hasta la transformación biotecnológica, nuestra
            plataforma cubre todo el ciclo de vida de los residuos
            farmacéuticos.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`${styles.card} ${styles[feature.color]}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  <feature.icon size={24} />
                </div>
                <span className={styles.cardTag}>{feature.tag}</span>
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
              <a href="#" className={styles.cardLink}>
                Saber más <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
