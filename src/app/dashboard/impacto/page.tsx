"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { TreePine, Droplets, Recycle, TrendingUp, Award } from "lucide-react";

type ImpactoMetrics = {
  co2_evitado: number;
  agua_protegida: number;
  residuos_recuperados: number;
  total_residuos: number;
  recolectados: number;
};

// Constants removed as we use DB factos

export default function ImpactoPage() {
  const [metrics, setMetrics] = useState<ImpactoMetrics>({
    co2_evitado: 0,
    agua_protegida: 0,
    residuos_recuperados: 0,
    total_residuos: 0,
    recolectados: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("person");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const role = profile?.role || "person";
      setUserRole(role);

      let residuos: any[] = [];

      if (role === "gestor") {
        // Gestor: get residuos via conexiones
        const { data: conexiones } = await supabase
          .from("conexiones")
          .select("residuo_id")
          .eq("gestor_id", user.id);

        if (conexiones && conexiones.length > 0) {
          const ids = conexiones.map((c: any) => c.residuo_id);
          const { data } = await supabase
            .from("residuos")
            .select("id, cantidad, unidad, estado")
            .in("id", ids);
          residuos = data || [];
        }
      } else {
        const { data } = await supabase
          .from("residuos")
          .select("id, cantidad, unidad, estado")
          .eq("user_id", user.id);
        residuos = data || [];
      }

      const residuoIds = residuos.map((r: any) => r.id);
      let impactos: any[] = [];
      if (residuoIds.length > 0) {
        const { data: impData } = await supabase
          .from("impacto_logs")
          .select("*")
          .in("residuo_id", residuoIds);
        impactos = impData || [];
      }

      const recolectados = residuos.filter((r: any) => r.estado === "recolectado");
      
      const totalCo2 = impactos.reduce((sum, i) => sum + i.co2_evitado, 0);
      const totalAgua = impactos.reduce((sum, i) => sum + i.agua_protegida, 0);
      const totalRecuperados = impactos.reduce((sum, i) => sum + i.residuos_recuperados, 0);

      setMetrics({
        co2_evitado: Math.round(totalCo2 * 10) / 10,
        agua_protegida: Math.round(totalAgua * 10) / 10,
        residuos_recuperados: Math.round(totalRecuperados * 10) / 10,
        total_residuos: residuos.length,
        recolectados: recolectados.length,
      });

      setLoading(false);
    };

    fetch();
  }, []);

  const hasImpact = metrics.recolectados > 0;
  const completionRate = metrics.total_residuos > 0
    ? Math.round((metrics.recolectados / metrics.total_residuos) * 100) : 0;

  const motivationalMessage = hasImpact
    ? `🌟 ¡Increíble! Contribuiste a reducir la contaminación farmacéutica. Cada residuo que gestionas correctamente protege nuestros ríos y suelos.`
    : `🌱 Aún no tienes residuos recolectados, pero cada paso cuenta. ¡Solicita tu primera recolección y empieza a generar impacto real!`;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <div style={{
          width: 32, height: 32,
          border: "3px solid rgba(16, 185, 129, 0.2)",
          borderTopColor: "var(--color-primary)",
          borderRadius: "50%",
          animation: "spin 0.6s linear infinite",
        }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <header>
        <h1 style={{
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--text-primary)",
        }}>
          📊 Mi Impacto Ambiental
        </h1>
        <p style={{ color: "var(--text-tertiary)", marginTop: "0.25rem" }}>
          Calculadora de tu contribución ecológica personal
        </p>
      </header>

      {/* ---- Metric Cards ---- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        {/* CO₂ */}
        <MetricCard
          icon={<TreePine size={24} />}
          label="CO₂ Evitado"
          value={`${metrics.co2_evitado} kg`}
          color="#10b981"
          maxVal={100}
          currentVal={metrics.co2_evitado}
        />
        {/* Agua */}
        <MetricCard
          icon={<Droplets size={24} />}
          label="Agua Protegida"
          value={`${metrics.agua_protegida} L`}
          color="#3b82f6"
          maxVal={500}
          currentVal={metrics.agua_protegida}
        />
        {/* Residuos */}
        <MetricCard
          icon={<Recycle size={24} />}
          label="Residuos Recuperados"
          value={`${metrics.residuos_recuperados} kg`}
          color="#8b5cf6"
          maxVal={50}
          currentVal={metrics.residuos_recuperados}
        />
        {/* Tasa */}
        <MetricCard
          icon={<TrendingUp size={24} />}
          label="Tasa de Gestión"
          value={`${completionRate}%`}
          color="#f59e0b"
          maxVal={100}
          currentVal={completionRate}
        />
      </div>

      {/* ---- Bar Chart ---- */}
      <div style={{
        padding: "1.5rem",
        background: "rgba(30, 41, 59, 0.4)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border-glass)",
      }}>
        <h2 style={{
          fontSize: "1.1rem", fontWeight: 700,
          fontFamily: "var(--font-heading)", color: "var(--text-primary)",
          marginBottom: "1.5rem",
        }}>
          Resumen Visual
        </h2>

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-end", height: 180, padding: "0 1rem" }}>
          <BarItem label="CO₂ (kg)" value={metrics.co2_evitado} max={Math.max(metrics.co2_evitado, 20)} color="#10b981" />
          <BarItem label="Agua (L)" value={metrics.agua_protegida} max={Math.max(metrics.agua_protegida, 100)} color="#3b82f6" />
          <BarItem label="Recup. (kg)" value={metrics.residuos_recuperados} max={Math.max(metrics.residuos_recuperados, 10)} color="#8b5cf6" />
          <BarItem label="Total" value={metrics.total_residuos} max={Math.max(metrics.total_residuos, 5)} color="#f59e0b" />
          <BarItem label="Recolect." value={metrics.recolectados} max={Math.max(metrics.total_residuos, 5)} color="#10b981" />
        </div>
      </div>

      {/* ---- Motivational Message ---- */}
      <div style={{
        padding: "2rem",
        background: hasImpact
          ? "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(99,102,241,0.08))"
          : "rgba(30, 41, 59, 0.3)",
        borderRadius: "var(--radius-xl)",
        border: `1px solid ${hasImpact ? "rgba(16,185,129,0.2)" : "var(--border-glass)"}`,
        textAlign: "center",
      }}>
        {hasImpact && (
          <Award size={40} style={{ margin: "0 auto 1rem", color: "var(--color-primary)" }} />
        )}
        <p style={{
          fontSize: "1.1rem", lineHeight: 1.7,
          color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto",
          fontWeight: 500,
        }}>
          {motivationalMessage}
        </p>
      </div>
    </div>
  );
}

// ---- Sub-components ----

function MetricCard({
  icon, label, value, color, maxVal, currentVal,
}: {
  icon: React.ReactNode; label: string; value: string;
  color: string; maxVal: number; currentVal: number;
}) {
  const pct = Math.min((currentVal / maxVal) * 100, 100);
  return (
    <div style={{
      padding: "1.5rem",
      background: "rgba(30, 41, 59, 0.4)",
      borderRadius: "var(--radius-xl)",
      border: "1px solid var(--border-glass)",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: `${color}15`, color: color,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>{value}</div>
        </div>
      </div>

      {/* Mini progress */}
      <div style={{
        height: 6, borderRadius: 3,
        background: "rgba(148,163,184,0.1)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: 3,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          width: `${pct}%`,
          transition: "width 1s ease",
        }} />
      </div>
    </div>
  );
}

function BarItem({
  label, value, max, color,
}: {
  label: string; value: number; max: number; color: string;
}) {
  const height = max > 0 ? Math.max((value / max) * 140, 4) : 4;
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", gap: 6,
    }}>
      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-primary)" }}>
        {value}
      </span>
      <div style={{
        width: "100%", maxWidth: 48,
        height: height, borderRadius: "6px 6px 2px 2px",
        background: `linear-gradient(180deg, ${color}, ${color}88)`,
        transition: "height 1s ease",
      }} />
      <span style={{
        fontSize: "0.7rem", fontWeight: 600,
        color: "var(--text-tertiary)", textAlign: "center", lineHeight: 1.2,
      }}>
        {label}
      </span>
    </div>
  );
}
