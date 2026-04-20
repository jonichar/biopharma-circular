"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Plus, X, Package, Calendar, Settings, Edit3, Trash2 } from "lucide-react";
import styles from "./page.module.css";
import { Residuo, ResiduoType, ResiduoStatus } from "@/types";

export default function ResiduosPage() {
  const [residuos, setResiduos] = useState<Residuo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Form state
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState<ResiduoType>("farmaceutico");
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("kg");
  const [condicionMaterial, setCondicionMaterial] = useState("vencido");
  const [formLoading, setFormLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchResiduos = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      const { data } = await supabase
        .from("residuos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setResiduos(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResiduos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setFormLoading(true);

    const newResiduo = {
      user_id: userId,
      nombre,
      descripcion,
      tipo,
      cantidad: parseFloat(cantidad),
      unidad,
      condicion_material: condicionMaterial,
      estado: "registrado" as ResiduoStatus,
    };

    if (editingId) {
      // UPDATE Mode
      const { error } = await supabase
        .from("residuos")
        .update(newResiduo)
        .eq("id", editingId);

      if (!error) {
        setIsFormOpen(false);
        resetForm();
        fetchResiduos();
      } else {
        alert("Error al actualizar: " + error.message);
        console.error(error);
      }
    } else {
      // INSERT Mode
      const { error } = await supabase.from("residuos").insert([newResiduo]);

      if (!error) {
        setIsFormOpen(false);
        resetForm();
        fetchResiduos();
      } else {
        alert("Error al guardar: " + error.message);
        console.error(error);
      }
    }
    setFormLoading(false);
  };

  const openEditForm = (residuo: Residuo) => {
    setEditingId(residuo.id);
    setNombre(residuo.nombre);
    setDescripcion(residuo.descripcion || "");
    setTipo(residuo.tipo);
    setCantidad(residuo.cantidad.toString());
    setUnidad(residuo.unidad);
    setCondicionMaterial(residuo.condicion_material || "vencido");
    setIsFormOpen(true);
  };

  const deleteResiduo = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este residuo?")) {
      const { error } = await supabase.from("residuos").delete().eq("id", id);
      if (error) {
        alert("Error al eliminar: " + error.message);
      } else {
        fetchResiduos();
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNombre("");
    setDescripcion("");
    setTipo("farmaceutico");
    setCantidad("");
    setUnidad("kg");
    setCondicionMaterial("vencido");
  };

  // Helper formats
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const typeLabels: Record<string, string> = {
    farmaceutico: "Farmacéutico",
    organico: "Orgánico",
    quimico: "Químico",
    biologico: "Biológico",
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Mis Residuos</h1>
          <p className={styles.subtitle}>
            Gestiona tus residuos registrados y haz seguimiento de su estado
          </p>
        </div>
        {!isFormOpen && (
          <button
            className={styles.primaryBtn}
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
          >
            <Plus size={18} />
            Añadir residuo
          </button>
        )}
      </header>

      {/* CREATE/EDIT FORM */}
      {isFormOpen && (
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {editingId ? "Editar residuo" : "Registrar nuevo residuo"}
            </h2>
            <button
              className={styles.closeBtn}
              onClick={() => {
                setIsFormOpen(false);
                resetForm();
              }}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Nombre / Identificador</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Ej: Lote paracetamol vencido"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Tipo de residuo</label>
                <select
                  className={styles.input}
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as ResiduoType)}
                >
                  <option value="farmaceutico">Farmacéutico</option>
                  <option value="biologico">Biológico / Hospitalario</option>
                  <option value="quimico">Químico reactivo</option>
                  <option value="organico">Orgánico vegetal</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Cantidad aproximada</label>
                <input
                  type="number"
                  className={styles.input}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Unidad de medida</label>
                <select
                  className={styles.input}
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                >
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="litros">Litros (L)</option>
                  <option value="toneladas">Toneladas (t)</option>
                  <option value="unidades">Unidades/Cajas</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Condición física</label>
                <select
                  className={styles.input}
                  value={condicionMaterial}
                  onChange={(e) => setCondicionMaterial(e.target.value)}
                >
                  <option value="vencido">Vencido</option>
                  <option value="en_uso">En uso / Saldo</option>
                  <option value="danado">Dañado</option>
                </select>
              </div>

              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Descripción (Opcional)</label>
                <textarea
                  className={styles.input}
                  placeholder="Detalles sobre el estado, empaque, lote..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={formLoading}
              >
                {formLoading ? "Guardando..." : editingId ? "Actualizar residuo" : "Guardar residuo"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LIST OF RESIDUES */}
      {!loading && (
        <div className={styles.listContainer}>
          {residuos.length === 0 ? (
            <div className={styles.emptyState}>
              <Package size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
              <p>No tienes ningún residuo registrado.</p>
            </div>
          ) : (
            residuos.map((residuo) => (
              <div
                key={residuo.id}
                className={styles.residuoCard}
                data-type={residuo.tipo}
              >
                <div className={styles.typeIcon}>
                  <Package size={24} />
                </div>
                
                <div className={styles.residuoInfo}>
                  <div className={styles.residuoHeader}>
                    <h3 className={styles.residuoName}>{residuo.nombre}</h3>
                    <span className={`${styles.statusBadge} ${styles[residuo.estado]}`}>
                      {residuo.estado.replace("_", " ")}
                    </span>
                  </div>
                  
                  <div className={styles.residuoMeta}>
                    <div className={styles.metaItem}>
                      <Settings size={14} />
                      {typeLabels[residuo.tipo] || residuo.tipo}
                    </div>
                    {residuo.condicion_material && (
                      <div className={styles.metaItem}>
                        <Package size={14} />
                        <span style={{ textTransform: "capitalize" }}>{residuo.condicion_material.replace("_", " ")}</span>
                      </div>
                    )}
                    <div className={styles.metaItem}>
                      <span style={{ fontWeight: "700" }}>
                        {residuo.cantidad} {residuo.unidad}
                      </span>
                    </div>
                    <div className={styles.metaItem}>
                      <Calendar size={14} />
                      {formatDate(residuo.created_at)}
                    </div>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button 
                    className={styles.iconBtn} 
                    title="Editar"
                    onClick={() => openEditForm(residuo)}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    className={styles.iconBtn}
                    title="Eliminar"
                    onClick={() => deleteResiduo(residuo.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
