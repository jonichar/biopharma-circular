"use client";
import { Settings } from "lucide-react";

export default function ConfiguracionPage() {
  return (
    <div style={{ padding: "2rem", color: "var(--text-tertiary)", textAlign: "center" }}>
      <Settings size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
      <h2 style={{ color: "var(--text-primary)", fontSize: "1.5rem", marginBottom: "0.5rem" }}>Configuración</h2>
      <p>Página en construcción. Aquí podrás administrar los datos de tu cuenta y preferencias.</p>
    </div>
  );
}
