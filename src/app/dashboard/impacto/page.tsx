"use client";

import { BarChart3, TreePine, Droplets, Zap, DollarSign } from "lucide-react";

export default function ImpactoPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header>
        <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, fontFamily: "var(--font-heading)" }}>
          Mi Impacto Ambiental
        </h1>
        <p style={{ color: "var(--text-tertiary)", marginTop: "0.25rem" }}>
          Mide la contribución ecológica de tus residuos valorizados.
        </p>
      </header>

      {/* Grid de impacto */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
        {/* CO2 Evitado */}
        <div style={{ padding: "1.5rem", background: "rgba(30, 41, 59, 0.4)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-glass)", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 48, height: 48, borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
             <TreePine size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", fontWeight: 600 }}>CO2 Evitado</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>0 kg</div>
          </div>
        </div>

        {/* Agua Protegida */}
        <div style={{ padding: "1.5rem", background: "rgba(30, 41, 59, 0.4)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-glass)", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 48, height: 48, borderRadius: "12px", background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
             <Droplets size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", fontWeight: 600 }}>Agua Protegida</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>0 L</div>
          </div>
        </div>

        {/* Energía Generada */}
        <div style={{ padding: "1.5rem", background: "rgba(30, 41, 59, 0.4)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-glass)", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 48, height: 48, borderRadius: "12px", background: "rgba(245, 158, 11, 0.1)", color: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
             <Zap size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", fontWeight: 600 }}>Energía (Biomasa)</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>0 kWh</div>
          </div>
        </div>

        {/* Valor Económico */}
        <div style={{ padding: "1.5rem", background: "rgba(30, 41, 59, 0.4)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-glass)", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: 48, height: 48, borderRadius: "12px", background: "rgba(99, 102, 241, 0.1)", color: "var(--color-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
             <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", fontWeight: 600 }}>Ahorro Económico</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>$0</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "4rem 2rem", background: "rgba(30, 41, 59, 0.2)", borderRadius: "var(--radius-xl)", border: "1px dashed var(--border-glass)", color: "var(--text-tertiary)" }}>
        <BarChart3 size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
          Tus métricas están en cero
        </h3>
        <p style={{ maxWidth: 500, margin: "0 auto" }}>
          Aún no tienes residuos que hayan sido procesados y transformados por nuestros gestores. A medida que tus residuos pasen a estado "Transformado", este panel cobrará vida con tus logros ecológicos reales.
        </p>
      </div>
    </div>
  );
}
