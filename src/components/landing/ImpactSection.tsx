"use client";

import { useState } from "react";
import {
  Leaf,
  Droplets,
  Zap,
  TrendingUp,
  RotateCcw,
  TreePine,
} from "lucide-react";
import styles from "./ImpactSection.module.css";

const impactData = [
  {
    icon: Leaf,
    value: "8,240",
    unit: "ton",
    label: "CO₂ evitado",
    description: "Equivalente a plantar 412,000 árboles",
    color: "primary",
  },
  {
    icon: Droplets,
    value: "2.1M",
    unit: "L",
    label: "Agua protegida",
    description: "Contaminantes farmacéuticos que no llegan al agua",
    color: "secondary",
  },
  {
    icon: Zap,
    value: "1,850",
    unit: "MWh",
    label: "Energía generada",
    description: "Biogás producido a partir de residuos orgánicos",
    color: "accent",
  },
  {
    icon: TrendingUp,
    value: "$3.2M",
    unit: "USD",
    label: "Valor generado",
    description: "Economía circular en productos biotecnológicos",
    color: "primary",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Recolección",
    desc: "Registro y recolección segura de residuos farmacéuticos",
    icon: "📲",
  },
  {
    step: "02",
    title: "Análisis",
    desc: "Clasificación química y evaluación de riesgo automatizada",
    icon: "🧪",
  },
  {
    step: "03",
    title: "Transformación",
    desc: "Conversión biotecnológica en biofertilizantes, biogás o enzimas",
    icon: "🔬",
  },
  {
    step: "04",
    title: "Valor",
    desc: "Productos útiles que generan impacto económico y ambiental",
    icon: "💎",
  },
];

export default function ImpactSection() {
  return (
    <section className={styles.section} id="impact">
      {/* Background decoration */}
      <div className={styles.bgOrb} />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.tag}>
            <RotateCcw size={14} /> Impacto Real
          </span>
          <h2 className={styles.title}>
            Cada residuo transformado es un{" "}
            <span className="gradient-text-accent">paso hacia adelante</span>
          </h2>
          <p className={styles.subtitle}>
            Nuestra plataforma no solo gestiona residuos — los convierte en
            valor medible para el planeta y la economía.
          </p>
        </div>

        {/* Impact metrics grid */}
        <div className={styles.metricsGrid}>
          {impactData.map((metric) => (
            <div
              key={metric.label}
              className={`${styles.metricCard} ${styles[metric.color]}`}
            >
              <div className={styles.metricIcon}>
                <metric.icon size={28} />
              </div>
              <div className={styles.metricValue}>
                {metric.value}
                <span className={styles.metricUnit}>{metric.unit}</span>
              </div>
              <div className={styles.metricLabel}>{metric.label}</div>
              <p className={styles.metricDesc}>{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Process flow */}
        <div className={styles.process} id="como-funciona">
          <h3 className={styles.processTitle}>
            <TreePine size={22} />
            ¿Cómo funciona el ciclo circular?
          </h3>
          <div className={styles.processGrid}>
            {processSteps.map((step, i) => (
              <div key={step.step} className={styles.processStep}>
                <div className={styles.processIcon}>{step.icon}</div>
                <div className={styles.processNumber}>{step.step}</div>
                <h4 className={styles.processStepTitle}>{step.title}</h4>
                <p className={styles.processStepDesc}>{step.desc}</p>
                {i < processSteps.length - 1 && (
                  <div className={styles.processArrow}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Example box */}
        <div className={styles.exampleBox}>
          <div className={styles.exampleHeader}>
            <span className={styles.exampleEmoji}>💊</span>
            <span className={styles.exampleLabel}>Ejemplo de análisis</span>
          </div>
          <div className={styles.exampleContent}>
            <div className={styles.exampleInput}>
              <strong>Input:</strong> Jarabe vencido (Ibuprofeno 200mg)
            </div>
            <div className={styles.exampleResults}>
              <div className={styles.exampleResult}>
                <span className={styles.resultBadge + " " + styles.danger}>
                  ⚠️ Riesgo
                </span>
                <span>No verter al desagüe — contaminante acuático</span>
              </div>
              <div className={styles.exampleResult}>
                <span className={styles.resultBadge + " " + styles.success}>
                  ♻️ Disposición
                </span>
                <span>Punto de recolección farmacéutica certificado</span>
              </div>
              <div className={styles.exampleResult}>
                <span className={styles.resultBadge + " " + styles.info}>
                  🔬 Biotech
                </span>
                <span>Posible degradación enzimática bacteriana</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
