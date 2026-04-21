/* =============================================
   PharmaBioNet — Type Definitions
   ============================================= */

// ---- User & Auth ----
export type UserRole = "person" | "company" | "gestor" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  company_name?: string;
  company_nit?: string;
  address?: string;
  city?: string;
  department?: string;
  created_at: string;
  updated_at: string;
}

// ---- Residuos ----
export type ResiduoType = "farmaceutico" | "organico" | "quimico" | "biologico";

export type ResiduoStatus =
  | "registrado"
  | "solicitud_enviada"
  | "en_proceso"
  | "recolectado";

export type RiskLevel = "bajo" | "medio" | "alto" | "critico";

export interface Residuo {
  id: string;
  user_id: string;
  tipo: ResiduoType;
  nombre: string;
  descripcion?: string;
  cantidad: number;
  unidad: string;
  estado: ResiduoStatus;
  condicion_material?: string;
  nivel_riesgo?: RiskLevel;
  ubicacion_lat?: number;
  ubicacion_lng?: number;
  direccion?: string;
  foto_url?: string;
  analisis_resultado?: AnalisisResultado;
  created_at: string;
  updated_at: string;
}

export interface AnalisisResultado {
  nivel_riesgo: RiskLevel;
  explicacion: string;
  no_hacer: string;
  si_hacer: string;
  potencial_biotecnologico: string;
  impacto_ambiental: string;
}

// ---- Gestores ----
export interface Gestor {
  id: string;
  user_id: string;
  nombre: string;
  descripcion: string;
  especialidad: string[];
  certificaciones: string[];
  ubicacion_lat: number;
  ubicacion_lng: number;
  direccion: string;
  ciudad: string;
  telefono: string;
  email: string;
  capacidad_mensual: number;
  rating: number;
  total_transformaciones: number;
  activo: boolean;
  created_at: string;
}

// ---- Conexiones (Match residuo-gestor) ----
export type ConexionStatus =
  | "pendiente"
  | "aceptada"
  | "en_proceso"
  | "completada"
  | "cancelada";

export interface Conexion {
  id: string;
  residuo_id: string;
  gestor_id: string;
  solicitante_id: string;
  estado: ConexionStatus;
  direccion_recogida?: string;
  fecha_recogida?: string;
  notas?: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  residuos?: Residuo;
  gestor_profile?: Profile;
  solicitante_profile?: Profile;
}

// ---- Impacto ----
export interface ImpactoLog {
  id: string;
  user_id: string;
  residuo_id: string;
  co2_evitado: number;
  agua_protegida: number;
  residuos_recuperados: number;
  valor_economico: number;
  created_at: string;
}

export interface TiposResiduosFactores {
  tipo: ResiduoType;
  factor_co2: number;
  factor_agua: number;
  porcentaje_aprovechamiento: number;
  factor_valorizacion: number;
}

// ---- Reportes Empresariales ----
export interface ReporteEmpresarial {
  id: string;
  empresa_id: string;
  periodo: string;
  total_residuos: number;
  total_transformados: number;
  co2_evitado_total: number;
  cumplimiento_porcentaje: number;
  generado_at: string;
}

// ---- Analysis Result (for modal) ----
export interface AnalisisCompleto {
  nivel_riesgo: RiskLevel;
  explicacion_riesgo: string;
  no_hacer: string[];
  si_hacer: string[];
  potencial_biotecnologico: string;
}
