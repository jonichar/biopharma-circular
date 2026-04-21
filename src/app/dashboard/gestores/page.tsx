"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { MapPin, Package, Mail, User, Shield } from "lucide-react";

type GestorInfo = {
  id: string;
  full_name: string;
  email: string;
  pedidos_activos: number;
};

export default function GestoresPage() {
  const [gestores, setGestores] = useState<GestorInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Get all gestores
      const { data: gestorProfiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("role", "gestor");

      if (!gestorProfiles) {
        setLoading(false);
        return;
      }

      // Get active conexiones for this user grouped by gestor
      const { data: conexiones } = await supabase
        .from("conexiones")
        .select("gestor_id, estado")
        .eq("solicitante_id", user.id)
        .in("estado", ["pendiente", "aceptada", "en_proceso"]);

      // Count per gestor
      const countMap: Record<string, number> = {};
      conexiones?.forEach((c: any) => {
        countMap[c.gestor_id] = (countMap[c.gestor_id] || 0) + 1;
      });

      const result: GestorInfo[] = gestorProfiles.map((g: any) => ({
        id: g.id,
        full_name: g.full_name || "Gestor",
        email: g.email || "",
        pedidos_activos: countMap[g.id] || 0,
      }));

      setGestores(result);
      setLoading(false);
    };

    fetch();
  }, []);

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
          fontWeight: 800,
          fontFamily: "var(--font-heading)",
          color: "var(--text-primary)",
        }}>
          Gestores Disponibles
        </h1>
        <p style={{ color: "var(--text-tertiary)", marginTop: "0.25rem" }}>
          Centros de tratamiento y recolección certificados
        </p>
      </header>

      {gestores.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          background: "rgba(30,41,59,0.3)", borderRadius: "var(--radius-xl)",
          border: "1px dashed var(--border-glass)", color: "var(--text-tertiary)",
        }}>
          <MapPin size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
          <p>No hay gestores registrados en la plataforma aún.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
          {gestores.map((g) => (
            <div key={g.id} style={{
              padding: "1.5rem",
              background: "rgba(30,41,59,0.4)",
              backdropFilter: "blur(8px)",
              border: "1px solid var(--border-glass)",
              borderRadius: "var(--radius-xl)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              transition: "all 0.2s ease",
            }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(99,102,241,0.15))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--color-primary)", fontWeight: 800, fontSize: "1.1rem",
                  fontFamily: "var(--font-heading)",
                }}>
                  {g.full_name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 700, color: "var(--text-primary)",
                    fontFamily: "var(--font-heading)", fontSize: "1.05rem",
                  }}>
                    {g.full_name}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}>
                    <Mail size={13} /> {g.email}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: "flex", gap: "1rem",
                padding: "0.75rem 1rem",
                background: "rgba(15, 23, 42, 0.4)",
                borderRadius: "var(--radius-lg)",
              }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--color-primary)" }}>
                    {g.pedidos_activos}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 600 }}>
                    Pedidos activos
                  </div>
                </div>
                <div style={{ width: 1, background: "var(--border-glass)" }} />
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, color: "#10b981" }}>
                    <Shield size={16} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Verificado</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 600 }}>
                    Certificado
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
