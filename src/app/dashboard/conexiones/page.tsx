"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Link2, Package, User, MapPin, CheckCircle2, Circle, ArrowRight } from "lucide-react";

type ConexionView = {
  id: string;
  estado: string;
  direccion_recogida: string;
  created_at: string;
  residuo_nombre: string;
  residuo_tipo: string;
  residuo_estado: string;
  residuo_cantidad: number;
  residuo_unidad: string;
  contraparte_nombre: string;
  contraparte_role: string;
};

const STATUS_STEPS = [
  { key: "registrado", label: "Registrado" },
  { key: "solicitud_enviada", label: "Solicitud enviada" },
  { key: "en_proceso", label: "En proceso" },
  { key: "recolectado", label: "Recolectado" },
];

function MiniProgress({ status }: { status: string }) {
  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === status);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
      {STATUS_STEPS.map((step, idx) => {
        const isDone = idx <= currentIdx;
        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: isDone ? "var(--color-primary)" : "rgba(148,163,184,0.2)",
              transition: "all 0.3s ease",
            }} />
            {idx < STATUS_STEPS.length - 1 && (
              <div style={{
                width: 16, height: 2, borderRadius: 1,
                background: isDone && idx < currentIdx ? "var(--color-primary)" : "rgba(148,163,184,0.15)",
              }} />
            )}
          </div>
        );
      })}
      <span style={{
        fontSize: "0.72rem", fontWeight: 600, marginLeft: 6,
        color: currentIdx >= 3 ? "var(--color-primary)" : "var(--text-tertiary)",
        textTransform: "capitalize",
      }}>
        {status.replace("_", " ")}
      </span>
    </div>
  );
}

export default function ConexionesPage() {
  const [conexiones, setConexiones] = useState<ConexionView[]>([]);
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

      // Get role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const role = profile?.role || "person";
      setUserRole(role);

      // Get conexiones
      const { data: rawConexiones } = await supabase
        .from("conexiones")
        .select("*")
        .in("estado", ["pendiente", "aceptada", "en_proceso"])
        .order("created_at", { ascending: false });

      if (!rawConexiones || rawConexiones.length === 0) {
        setConexiones([]);
        setLoading(false);
        return;
      }

      // Get related residuos
      const residuoIds = rawConexiones.map((c: any) => c.residuo_id);
      const { data: residuoData } = await supabase
        .from("residuos")
        .select("id, nombre, tipo, estado, cantidad, unidad")
        .in("id", residuoIds);

      const residuoMap: Record<string, any> = {};
      residuoData?.forEach((r: any) => { residuoMap[r.id] = r; });

      // Get contraparte profiles
      const contraparteIds = rawConexiones.map((c: any) =>
        role === "gestor" ? c.solicitante_id : c.gestor_id
      ).filter(Boolean);

      const { data: contraparteData } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .in("id", contraparteIds);

      const contraparteMap: Record<string, any> = {};
      contraparteData?.forEach((p: any) => { contraparteMap[p.id] = p; });

      const views: ConexionView[] = rawConexiones.map((c: any) => {
        const residuo = residuoMap[c.residuo_id] || {};
        const contraparteId = role === "gestor" ? c.solicitante_id : c.gestor_id;
        const contraparte = contraparteMap[contraparteId] || {};
        return {
          id: c.id,
          estado: c.estado,
          direccion_recogida: c.direccion_recogida || "",
          created_at: c.created_at,
          residuo_nombre: residuo.nombre || "Residuo",
          residuo_tipo: residuo.tipo || "",
          residuo_estado: residuo.estado || "registrado",
          residuo_cantidad: residuo.cantidad || 0,
          residuo_unidad: residuo.unidad || "",
          contraparte_nombre: contraparte.full_name || "Usuario",
          contraparte_role: contraparte.role || "",
        };
      });

      setConexiones(views);
      setLoading(false);
    };

    fetch();
  }, []);

  const isGestor = userRole === "gestor";
  const roleLabels: Record<string, string> = {
    person: "Persona",
    company: "Empresa",
    gestor: "Gestor",
  };

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
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <header>
        <h1 style={{
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--text-primary)",
        }}>
          Conexiones Activas
        </h1>
        <p style={{ color: "var(--text-tertiary)", marginTop: "0.25rem" }}>
          {isGestor
            ? "Solicitudes de recolección asignadas a ti"
            : "Seguimiento de tus solicitudes de recolección"}
        </p>
      </header>

      {conexiones.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          background: "rgba(30,41,59,0.3)", borderRadius: "var(--radius-xl)",
          border: "1px dashed var(--border-glass)", color: "var(--text-tertiary)",
        }}>
          <Link2 size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
          <p>No tienes conexiones activas. {!isGestor && "Solicita una recolección desde tus residuos."}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {conexiones.map((c) => (
            <div key={c.id} style={{
              padding: "1.25rem",
              background: "rgba(30,41,59,0.4)",
              backdropFilter: "blur(8px)",
              border: "1px solid var(--border-glass)",
              borderRadius: "var(--radius-xl)",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
              transition: "all 0.2s ease",
            }}>
              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: "var(--radius-lg)", flexShrink: 0,
                background: "rgba(16,185,129,0.1)", color: "var(--color-primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Package size={20} />
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{
                      fontWeight: 700, fontSize: "1.05rem",
                      color: "var(--text-primary)", fontFamily: "var(--font-heading)",
                    }}>
                      {c.residuo_nombre}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 6, marginTop: 2, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700 }}>{c.residuo_cantidad} {c.residuo_unidad}</span>
                      <span>•</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <User size={13} />
                        {isGestor ? "Solicitante" : "Gestor"}: <strong>{c.contraparte_nombre}</strong>
                      </span>
                    </div>
                  </div>

                  {c.direccion_recogida && (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 4,
                      fontSize: "0.8rem", color: "var(--text-tertiary)",
                      background: "rgba(15,23,42,0.4)", padding: "4px 10px",
                      borderRadius: "var(--radius-md)",
                    }}>
                      <MapPin size={13} />
                      {c.direccion_recogida}
                    </div>
                  )}
                </div>

                {/* Mini progress */}
                <MiniProgress status={c.residuo_estado} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
