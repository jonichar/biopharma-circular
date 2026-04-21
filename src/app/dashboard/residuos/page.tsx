"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Plus, X, Package, Calendar, Settings, Edit3, Trash2,
  Truck, FlaskConical, Search, CheckCircle2, Circle, ArrowRight, TreePine, Droplets, Recycle, CircleDollarSign
} from "lucide-react";
import styles from "./page.module.css";
import { Residuo, ResiduoType, ResiduoStatus, Profile, AnalisisCompleto, TiposResiduosFactores } from "@/types";

// ---- Analysis data generator (simulated AI) ----
const generateAnalysis = (residuo: Residuo): AnalisisCompleto => {
  const analyses: Record<string, AnalisisCompleto> = {
    farmaceutico: {
      nivel_riesgo: "medio",
      explicacion_riesgo: "Contiene compuestos activos con potencial contaminante acuático. Los principios activos pueden persistir en el medio ambiente y afectar ecosistemas acuáticos.",
      no_hacer: [
        "No desechar en el desagüe o alcantarillado",
        "No mezclar con residuos domésticos comunes",
        "No incinerar sin control especializado",
      ],
      si_hacer: [
        "Llevar a punto de recolección autorizado",
        "Mantener en empaque original hasta su gestión",
        "Separar por tipo de medicamento",
      ],
      potencial_biotecnologico: "Puede ser degradado por bacterias especializadas del género Pseudomonas. Los componentes orgánicos tienen potencial para ser bioconvertidos en compuestos de menor toxicidad mediante procesos enzimáticos.",
    },
    biologico: {
      nivel_riesgo: "alto",
      explicacion_riesgo: "Material con riesgo biológico que puede contener patógenos. Requiere tratamiento especializado de esterilización antes de su disposición final.",
      no_hacer: [
        "No manipular sin equipo de protección personal",
        "No almacenar junto a alimentos o áreas de consumo",
        "No desechar en contenedores convencionales",
      ],
      si_hacer: [
        "Usar contenedores rojos señalizados para residuos biológicos",
        "Solicitar recolección por gestor certificado",
        "Documentar el tipo y volumen para trazabilidad",
      ],
      potencial_biotecnologico: "Mediante procesos de autoclave y biorremediación, los componentes orgánicos pueden ser neutralizados. Algunos materiales biológicos pueden aprovecharse para producción de bioabonos tras tratamiento térmico.",
    },
    quimico: {
      nivel_riesgo: "alto",
      explicacion_riesgo: "Sustancia químicamente reactiva con potencial corrosivo o tóxico. Puede generar reacciones peligrosas al contacto con agua o calor.",
      no_hacer: [
        "No verter en desagües bajo ninguna circunstancia",
        "No mezclar con otros químicos sin conocimiento técnico",
        "No almacenar cerca de fuentes de calor",
      ],
      si_hacer: [
        "Almacenar en recipientes resistentes y etiquetados",
        "Contactar gestor especializado en residuos químicos",
        "Mantener ficha de seguridad del producto (MSDS)",
      ],
      potencial_biotecnologico: "Tecnologías de fitorremediación con plantas hiperacumuladoras pueden absorber metales pesados. Procesos de oxidación avanzada permiten la degradación de compuestos orgánicos persistentes.",
    },
    organico: {
      nivel_riesgo: "bajo",
      explicacion_riesgo: "Residuo orgánico con bajo riesgo ambiental directo. Sin embargo, su mala disposición puede generar lixiviados contaminantes y emisiones de metano.",
      no_hacer: [
        "No acumular sin ventilación adecuada",
        "No mezclar con residuos peligrosos",
        "No dejar expuesto a lluvias",
      ],
      si_hacer: [
        "Compostar cuando sea posible",
        "Separar materiales reciclables antes de disponer",
        "Entregar a gestor para valorización energética",
      ],
      potencial_biotecnologico: "Excelente candidato para digestión anaeróbica y producción de biogás. Los hongos del género Trichoderma pueden acelerar la descomposición para generar compost de alta calidad nutricional.",
    },
  };
  return analyses[residuo.tipo] || analyses.farmaceutico;
};

// ---- Status Progress Bar Component ----
const STATUS_STEPS: { key: ResiduoStatus; label: string }[] = [
  { key: "registrado", label: "Registrado" },
  { key: "solicitud_enviada", label: "Solicitud enviada" },
  { key: "en_proceso", label: "En proceso" },
  { key: "recolectado", label: "Recolectado" },
];

function StatusProgressBar({ currentStatus }: { currentStatus: ResiduoStatus }) {
  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className={styles.progressBar}>
      {STATUS_STEPS.map((step, idx) => {
        const isDone = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={step.key} className={styles.progressStep}>
            <div
              className={`${styles.progressDot} ${isDone ? styles.progressDone : ""} ${isCurrent ? styles.progressCurrent : ""}`}
            >
              {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            </div>
            <span className={`${styles.progressLabel} ${isDone ? styles.progressLabelDone : ""}`}>
              {step.label}
            </span>
            {idx < STATUS_STEPS.length - 1 && (
              <div className={`${styles.progressLine} ${isDone && idx < currentIdx ? styles.progressLineDone : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---- Main Page Component ----
export default function ResiduosPage() {
  const [residuos, setResiduos] = useState<Residuo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("person");

  // Form state
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState<ResiduoType>("farmaceutico");
  const [cantidad, setCantidad] = useState("");
  const [unidad, setUnidad] = useState("kg");
  const [condicionMaterial, setCondicionMaterial] = useState("vencido");
  const [formLoading, setFormLoading] = useState(false);

  // Recoleccion modal
  const [recoleccionResiduo, setRecoleccionResiduo] = useState<Residuo | null>(null);
  const [gestoresList, setGestoresList] = useState<Profile[]>([]);
  const [selectedGestorId, setSelectedGestorId] = useState("");
  const [direccionRecogida, setDireccionRecogida] = useState("");
  const [recoleccionLoading, setRecoleccionLoading] = useState(false);

  // Analysis modal
  const [analysisResiduo, setAnalysisResiduo] = useState<Residuo | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalisisCompleto | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState("");

  // Individual Impact modal
  const [impactoResiduo, setImpactoResiduo] = useState<Residuo | null>(null);
  const [impactoData, setImpactoData] = useState<any>(null);
  const [impactoLoading, setImpactoLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const isGestor = userRole === "gestor";

  const fetchResiduos = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUserId(user.id);

    // Get role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "person";
    setUserRole(role);

    if (role === "gestor") {
      // Gestor: fetch residuos assigned to them via conexiones
      const { data: conexiones } = await supabase
        .from("conexiones")
        .select("residuo_id")
        .eq("gestor_id", user.id);

      if (conexiones && conexiones.length > 0) {
        const residuoIds = conexiones.map((c: any) => c.residuo_id);
        const { data } = await supabase
          .from("residuos")
          .select("*")
          .in("id", residuoIds)
          .order("created_at", { ascending: false });
        if (data) setResiduos(data);
      } else {
        setResiduos([]);
      }
    } else {
      // company/person: fetch own residuos
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

  // ---- Helpers for Impact Calculation ----
  const fetchAndSaveImpact = async (residuoId: string, rTipo: string, rCantidad: number, rUserId: string) => {
    // Check if impact already exists
    const { data: existing } = await supabase.from("impacto_logs").select("*").eq("residuo_id", residuoId).single();
    if (existing) return existing;

    // Fetch factors
    const { data: factorData } = await supabase
      .from("tipos_residuos_factores")
      .select("*")
      .eq("tipo", rTipo)
      .single();

    if (!factorData) return null;

    const baseAmount = rCantidad;

    const co2 = baseAmount * factorData.factor_co2;
    const agua = baseAmount * factorData.factor_agua;
    const recuperados = baseAmount * factorData.porcentaje_aprovechamiento;
    const valor = baseAmount * factorData.factor_valorizacion;

    const newImpact = {
      user_id: rUserId,
      residuo_id: residuoId,
      co2_evitado: Math.round(co2 * 100) / 100,
      agua_protegida: Math.round(agua * 100) / 100,
      residuos_recuperados: Math.round(recuperados * 100) / 100,
      valor_economico: Math.round(valor * 100) / 100,
    };

    const { data: inserted, error } = await supabase.from("impacto_logs").insert([newImpact]).select().single();
    if (error) console.error("Error inserting impact", error);
    return inserted;
  };

  // ---- CRUD (company/person only) ----
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
      const { data, error } = await supabase
        .from("residuos")
        .update(newResiduo)
        .eq("id", editingId)
        .select();

      if (!error && data) {
        await supabase.from("impacto_logs").delete().eq("residuo_id", editingId);
        await fetchAndSaveImpact(editingId, data[0].tipo, data[0].cantidad, userId);
        setIsFormOpen(false);
        resetForm();
        fetchResiduos();
      } else {
        alert("Error al actualizar: " + (error?.message || "Error desconocido"));
      }
    } else {
      const { data, error } = await supabase.from("residuos").insert([newResiduo]).select();
      if (!error && data) {
        await fetchAndSaveImpact(data[0].id, data[0].tipo, data[0].cantidad, userId);
        setIsFormOpen(false);
        resetForm();
        fetchResiduos();
      } else {
        alert("Error al guardar: " + (error?.message || "Error desconocido"));
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

  const promptDeleteResiduo = (id: string, nombreResiduo: string) => {
    setDeleteConfirmId(id);
    setDeleteConfirmName(nombreResiduo);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      const { data, error } = await supabase.from("residuos").delete().eq("id", deleteConfirmId).select();
      if (error) {
        alert("Error al eliminar: " + error.message);
      } else if (!data || data.length === 0) {
        alert("No se pudo eliminar. Posible bloqueo de RLS.");
      } else {
        setDeleteConfirmId(null);
        fetchResiduos();
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
    setIsDeleting(false);
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

  // ---- Solicitar Recolección ----
  const openRecoleccionModal = async (residuo: Residuo) => {
    setRecoleccionResiduo(residuo);
    setSelectedGestorId("");
    setDireccionRecogida("");

    // Fetch gestores
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "gestor");

    if (data) setGestoresList(data as Profile[]);
  };

  const submitRecoleccion = async () => {
    if (!recoleccionResiduo || !selectedGestorId || !direccionRecogida.trim()) return;
    setRecoleccionLoading(true);

    // Create conexion
    const { error: connError } = await supabase.from("conexiones").insert([{
      residuo_id: recoleccionResiduo.id,
      gestor_id: selectedGestorId,
      solicitante_id: userId,
      estado: "pendiente",
      direccion_recogida: direccionRecogida.trim(),
    }]);

    if (connError) {
      alert("Error al crear solicitud: " + connError.message);
      setRecoleccionLoading(false);
      return;
    }

    // Update residuo status
    await supabase
      .from("residuos")
      .update({ estado: "solicitud_enviada" })
      .eq("id", recoleccionResiduo.id);

    setRecoleccionResiduo(null);
    setRecoleccionLoading(false);
    fetchResiduos();
  };

  // ---- Analizar Residuo ----
  const startAnalysis = async (residuo: Residuo) => {
    setAnalysisResiduo(residuo);
    setAnalysisResult(null);
    setAnalysisLoading(true);

    const phases = [
      "Escaneando composición molecular...",
      "Evaluando nivel de toxicidad...",
      "Consultando base de datos farmacológica...",
      "Generando recomendaciones...",
      "Calculando potencial biotecnológico...",
    ];

    for (let i = 0; i < phases.length; i++) {
      setAnalysisPhase(phases[i]);
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
    }

    const result = generateAnalysis(residuo);
    setAnalysisResult(result);
    setAnalysisLoading(false);

    // Calc retroactivo si no existe (fire & forget)
    fetchAndSaveImpact(residuo.id, residuo.tipo, residuo.cantidad, residuo.user_id).catch(console.error);
  };

  const openImpactView = async (residuo: Residuo) => {
    setImpactoResiduo(residuo);
    setImpactoData(null);
    setImpactoLoading(true);

    const data = await fetchAndSaveImpact(residuo.id, residuo.tipo, residuo.cantidad, residuo.user_id);
    setImpactoData(data);
    setImpactoLoading(false);
  };

  // ---- Gestor: Update Status ----
  const advanceStatus = async (residuo: Residuo) => {
    const order: ResiduoStatus[] = ["solicitud_enviada", "en_proceso", "recolectado"];
    const currentIdx = order.indexOf(residuo.estado);
    if (currentIdx < 0 || currentIdx >= order.length - 1) return;

    const nextStatus = order[currentIdx + 1];
    const { error } = await supabase
      .from("residuos")
      .update({ estado: nextStatus })
      .eq("id", residuo.id);

    if (!error) {
      // Also update conexion status
      const conexionStatus = nextStatus === "en_proceso" ? "en_proceso" : "completada";
      await supabase
        .from("conexiones")
        .update({ estado: conexionStatus })
        .eq("residuo_id", residuo.id);

      fetchResiduos();
    } else {
      alert("Error al actualizar estado: " + error.message);
    }
  };

  // ---- Helpers ----
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-CO", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const typeLabels: Record<string, string> = {
    farmaceutico: "Farmacéutico",
    organico: "Orgánico",
    quimico: "Químico",
    biologico: "Biológico",
  };

  const riskColors: Record<string, string> = {
    bajo: "#10b981",
    medio: "#f59e0b",
    alto: "#ef4444",
    critico: "#dc2626",
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {isGestor ? "Residuos Asignados" : "Mis Residuos"}
          </h1>
          <p className={styles.subtitle}>
            {isGestor
              ? "Residuos asignados a ti para recolección y procesamiento"
              : "Gestiona tus residuos registrados y haz seguimiento de su estado"}
          </p>
        </div>
        {!isGestor && !isFormOpen && (
          <button
            className={styles.primaryBtn}
            onClick={() => { resetForm(); setIsFormOpen(true); }}
          >
            <Plus size={18} />
            Añadir residuo
          </button>
        )}
      </header>

      {/* CREATE/EDIT FORM — only company/person */}
      {!isGestor && isFormOpen && (
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {editingId ? "Editar residuo" : "Registrar nuevo residuo"}
            </h2>
            <button className={styles.closeBtn} onClick={() => { setIsFormOpen(false); resetForm(); }}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Nombre / Identificador</label>
                <input type="text" className={styles.input} placeholder="Ej: Lote paracetamol vencido"
                  value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Tipo de residuo</label>
                <select className={styles.input} value={tipo} onChange={(e) => setTipo(e.target.value as ResiduoType)}>
                  <option value="farmaceutico">Farmacéutico</option>
                  <option value="biologico">Biológico / Hospitalario</option>
                  <option value="quimico">Químico reactivo</option>
                  <option value="organico">Orgánico vegetal</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Cantidad aproximada</label>
                <input type="number" className={styles.input} placeholder="0.00" step="0.01" min="0"
                  value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Unidad de medida</label>
                <select className={styles.input} value={unidad} onChange={(e) => setUnidad(e.target.value)}>
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="litros">Litros (L)</option>
                  <option value="toneladas">Toneladas (t)</option>
                  <option value="unidades">Unidades/Cajas</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Condición física</label>
                <select className={styles.input} value={condicionMaterial} onChange={(e) => setCondicionMaterial(e.target.value)}>
                  <option value="vencido">Vencido</option>
                  <option value="en_uso">En uso / Saldo</option>
                  <option value="danado">Dañado</option>
                </select>
              </div>
              <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Descripción (Opcional)</label>
                <textarea className={styles.input} placeholder="Detalles sobre el estado, empaque, lote..."
                  value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.cancelBtn} onClick={() => { setIsFormOpen(false); resetForm(); }}>
                Cancelar
              </button>
              <button type="submit" className={styles.primaryBtn} disabled={formLoading}>
                {formLoading ? "Guardando..." : editingId ? "Actualizar residuo" : "Guardar residuo"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.formTitle} style={{ color: "#ef4444" }}>Eliminar registro</h2>
            <p style={{ marginBottom: "1.5rem", color: "var(--text-secondary)" }}>
              ¿Estás seguro de que quieres eliminar <strong>{deleteConfirmName}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className={styles.formActions} style={{ marginTop: 0 }}>
              <button type="button" className={styles.cancelBtn} onClick={() => setDeleteConfirmId(null)} disabled={isDeleting}>
                Cancelar
              </button>
              <button type="button" className={styles.primaryBtn}
                style={{ background: "#ef4444", borderColor: "#ef4444" }}
                onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECOLECCION MODAL */}
      {recoleccionResiduo && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>
                <Truck size={20} style={{ verticalAlign: "middle", marginRight: 8 }} />
                Solicitar Recolección
              </h2>
              <button className={styles.closeBtn} onClick={() => setRecoleccionResiduo(null)}>
                <X size={20} />
              </button>
            </div>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>
              Residuo: <strong>{recoleccionResiduo.nombre}</strong> — {recoleccionResiduo.cantidad} {recoleccionResiduo.unidad}
            </p>

            <div className={styles.fieldGroup} style={{ marginBottom: "1rem" }}>
              <label className={styles.label}>Seleccionar Gestor *</label>
              <select className={styles.input} value={selectedGestorId}
                onChange={(e) => setSelectedGestorId(e.target.value)} required>
                <option value="">— Elegir gestor —</option>
                {gestoresList.map((g) => (
                  <option key={g.id} value={g.id}>{g.full_name} ({g.email})</option>
                ))}
              </select>
            </div>

            <div className={styles.fieldGroup} style={{ marginBottom: "1.5rem" }}>
              <label className={styles.label}>Dirección de recogida *</label>
              <input type="text" className={styles.input}
                placeholder="Ej: Calle 50 #30-20, Medellín"
                value={direccionRecogida}
                onChange={(e) => setDireccionRecogida(e.target.value)} required />
            </div>

            <div className={styles.formActions} style={{ marginTop: 0 }}>
              <button type="button" className={styles.cancelBtn} onClick={() => setRecoleccionResiduo(null)}>
                Cancelar
              </button>
              <button type="button" className={styles.primaryBtn}
                disabled={recoleccionLoading || !selectedGestorId || !direccionRecogida.trim()}
                onClick={submitRecoleccion}>
                {recoleccionLoading ? "Enviando..." : "Confirmar solicitud"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ANALYSIS MODAL */}
      {analysisResiduo && (
        <div className={styles.overlay}>
          <div className={styles.modal} style={{ maxWidth: 560 }}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>
                <FlaskConical size={20} style={{ verticalAlign: "middle", marginRight: 8 }} />
                Resultado Químico
              </h2>
              <button className={styles.closeBtn} onClick={() => { setAnalysisResiduo(null); setAnalysisResult(null); }}>
                <X size={20} />
              </button>
            </div>

            {analysisLoading ? (
              <div className={styles.analysisLoading}>
                <div className={styles.analysisSpinner} />
                <p className={styles.analysisPhase}>{analysisPhase}</p>
              </div>
            ) : analysisResult && (
              <div className={styles.analysisContent}>
                {/* Risk level */}
                <div className={styles.analysisSection}>
                  <h3>⚠️ Nivel de riesgo</h3>
                  <span className={styles.riskBadge} style={{
                    background: `${riskColors[analysisResult.nivel_riesgo]}22`,
                    color: riskColors[analysisResult.nivel_riesgo],
                    border: `1px solid ${riskColors[analysisResult.nivel_riesgo]}44`,
                  }}>
                    {analysisResult.nivel_riesgo.toUpperCase()}
                  </span>
                  <blockquote className={styles.analysisQuote}>
                    {analysisResult.explicacion_riesgo}
                  </blockquote>
                </div>

                {/* Recommendations */}
                <div className={styles.analysisSection}>
                  <h3>📋 Recomendación farmacéutica</h3>
                  <div className={styles.recList}>
                    {analysisResult.no_hacer.map((item, i) => (
                      <div key={i} className={styles.recItem} style={{ color: "#ef4444" }}>
                        ❌ {item}
                      </div>
                    ))}
                    {analysisResult.si_hacer.map((item, i) => (
                      <div key={i} className={styles.recItem} style={{ color: "#10b981" }}>
                        ✅ {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Biotech potential */}
                <div className={styles.analysisSection}>
                  <h3>🔬 Potencial biotecnológico</h3>
                  <blockquote className={styles.analysisQuote}>
                    {analysisResult.potencial_biotecnologico}
                  </blockquote>
                </div>

                {/* Connect with gestor button — NOT shown for gestores */}
                {!isGestor && analysisResiduo.estado === "registrado" && (
                  <button className={styles.primaryBtn} style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}
                    onClick={() => {
                      setAnalysisResiduo(null);
                      setAnalysisResult(null);
                      openRecoleccionModal(analysisResiduo);
                    }}>
                    <Truck size={18} />
                    Conectar con gestor
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* INDIVIDUAL IMPACT MODAL */}
      {impactoResiduo && (
        <div className={styles.overlay}>
          <div className={styles.modal} style={{ maxWidth: 500 }}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>
                <TreePine size={20} style={{ verticalAlign: "middle", marginRight: 8, color: "#10b981" }} />
                Impacto Ambiental
              </h2>
              <button className={styles.closeBtn} onClick={() => { setImpactoResiduo(null); setImpactoData(null); }}>
                <X size={20} />
              </button>
            </div>

            {impactoLoading || !impactoData ? (
              <div className={styles.analysisLoading} style={{ padding: "3rem 1rem" }}>
                <div className={styles.analysisSpinner} />
                <p className={styles.analysisPhase}>Calculando contribución ambiental...</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                <div style={{ padding: "1rem", background: "rgba(16, 185, 129, 0.1)", borderRadius: "12px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "#10b981", marginBottom: "0.5rem" }}>
                    <TreePine size={18} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>CO₂ Evitado</span>
                  </div>
                  <strong style={{ fontSize: "1.5rem", color: "var(--text-primary)" }}>{impactoData.co2_evitado.toLocaleString('es-CO')} kg</strong>
                </div>

                <div style={{ padding: "1rem", background: "rgba(59, 130, 246, 0.1)", borderRadius: "12px", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "#3b82f6", marginBottom: "0.5rem" }}>
                    <Droplets size={18} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Agua Protegida</span>
                  </div>
                  <strong style={{ fontSize: "1.5rem", color: "var(--text-primary)" }}>{impactoData.agua_protegida.toLocaleString('es-CO')} L</strong>
                </div>

                <div style={{ padding: "1rem", background: "rgba(139, 92, 246, 0.1)", borderRadius: "12px", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "#8b5cf6", marginBottom: "0.5rem" }}>
                    <Recycle size={18} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Recuperación</span>
                  </div>
                  <strong style={{ fontSize: "1.5rem", color: "var(--text-primary)" }}>{impactoData.residuos_recuperados.toLocaleString('es-CO')} kg</strong>
                </div>

                <div style={{ padding: "1rem", background: "rgba(245, 158, 11, 0.1)", borderRadius: "12px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "#f59e0b", marginBottom: "0.5rem" }}>
                    <CircleDollarSign size={18} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Valor Econ.</span>
                  </div>
                  <strong style={{ fontSize: "1.5rem", color: "var(--text-primary)" }}>${impactoData.valor_economico.toLocaleString('es-CO')}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LIST OF RESIDUES */}
      {!loading && (
        <div className={styles.listContainer}>
          {residuos.length === 0 ? (
            <div className={styles.emptyState}>
              <Package size={32} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
              <p>{isGestor ? "No tienes residuos asignados aún." : "No tienes ningún residuo registrado."}</p>
            </div>
          ) : (
            residuos.map((residuo) => (
              <div key={residuo.id} className={styles.residuoCard} data-type={residuo.tipo}>
                <div className={styles.cardContent}>
                  <div className={styles.cardTop}>
                    <div className={styles.typeIcon}>
                      <Package size={24} />
                    </div>

                    <div className={styles.residuoInfo}>
                      <div className={styles.residuoHeader}>
                        <h3 className={styles.residuoName}>{residuo.nombre}</h3>
                      </div>
                      <div className={styles.residuoMeta}>
                        <div className={styles.metaItem}>
                          <Settings size={14} />
                          {typeLabels[residuo.tipo] || residuo.tipo}
                        </div>
                        {residuo.condicion_material && (
                          <div className={styles.metaItem}>
                            <Package size={14} />
                            <span style={{ textTransform: "capitalize" }}>
                              {residuo.condicion_material.replace("_", " ")}
                            </span>
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

                    {/* Actions */}
                    <div className={styles.actions}>
                      {/* Analyze — all roles */}
                      <button className={styles.actionBtn} title="Analizar residuo"
                        onClick={() => startAnalysis(residuo)}
                        style={{ color: "#8b5cf6", borderColor: "rgba(139, 92, 246, 0.3)" }}>
                        <FlaskConical size={15} />
                        <span>Analizar</span>
                      </button>

                      {/* Ver Impacto — all roles */}
                      <button className={styles.actionBtn} title="Ver impacto ambiental generado"
                        onClick={() => openImpactView(residuo)}
                        style={{ color: "#10b981", borderColor: "rgba(16, 185, 129, 0.3)", marginLeft: "0.5rem" }}>
                        <TreePine size={15} />
                        <span>Impacto</span>
                      </button>

                      {/* Solicitar recolección — company/person only, only if registrado */}
                      {!isGestor && residuo.estado === "registrado" && (
                        <button className={styles.actionBtn} title="Solicitar recolección"
                          onClick={() => openRecoleccionModal(residuo)}
                          style={{ color: "#10b981", borderColor: "rgba(16, 185, 129, 0.3)" }}>
                          <Truck size={15} />
                          <span>Recolectar</span>
                        </button>
                      )}

                      {/* Edit/Delete — company/person only */}
                      {!isGestor && (
                        <>
                          <button className={styles.iconBtn} title="Editar" onClick={() => openEditForm(residuo)}>
                            <Edit3 size={16} />
                          </button>
                          <button className={styles.iconBtn} title="Eliminar"
                            onClick={() => promptDeleteResiduo(residuo.id, residuo.nombre)}>
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}

                      {/* Gestor: advance status */}
                      {isGestor && residuo.estado !== "recolectado" && residuo.estado !== "registrado" && (
                        <button className={styles.actionBtn} title="Avanzar estado"
                          onClick={() => advanceStatus(residuo)}
                          style={{ color: "#f59e0b", borderColor: "rgba(245, 158, 11, 0.3)" }}>
                          <ArrowRight size={15} />
                          <span>Avanzar estado</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <StatusProgressBar currentStatus={residuo.estado} />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
