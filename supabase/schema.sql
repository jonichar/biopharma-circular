-- =============================================
-- BioPharma Circular — Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Profiles (extends Supabase auth.users)
-- =============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'person' CHECK (role IN ('person', 'company', 'gestor', 'admin')),
  avatar_url TEXT,
  phone TEXT,
  company_name TEXT,
  company_nit TEXT,
  address TEXT,
  city TEXT,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Residuos
-- =============================================
CREATE TABLE residuos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('farmaceutico', 'organico', 'quimico', 'biologico')),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  cantidad DECIMAL NOT NULL DEFAULT 0,
  unidad TEXT NOT NULL DEFAULT 'kg',
  estado TEXT NOT NULL DEFAULT 'registrado' CHECK (estado IN ('registrado', 'en_analisis', 'disponible', 'recogido', 'transformado')),
  nivel_riesgo TEXT CHECK (nivel_riesgo IN ('bajo', 'medio', 'alto', 'critico')),
  ubicacion_lat DECIMAL,
  ubicacion_lng DECIMAL,
  direccion TEXT,
  foto_url TEXT,
  analisis_resultado JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Gestores Biotecnológicos
-- =============================================
CREATE TABLE gestores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  especialidad TEXT[] DEFAULT '{}',
  certificaciones TEXT[] DEFAULT '{}',
  ubicacion_lat DECIMAL NOT NULL,
  ubicacion_lng DECIMAL NOT NULL,
  direccion TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  capacidad_mensual DECIMAL DEFAULT 0,
  rating DECIMAL DEFAULT 0,
  total_transformaciones INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Conexiones (Residuo ↔ Gestor)
-- =============================================
CREATE TABLE conexiones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  residuo_id UUID REFERENCES residuos(id) ON DELETE CASCADE NOT NULL,
  gestor_id UUID REFERENCES gestores(id) ON DELETE CASCADE NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aceptada', 'en_proceso', 'completada', 'cancelada')),
  fecha_recogida TIMESTAMPTZ,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Impacto Logs
-- =============================================
CREATE TABLE impacto_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  residuo_id UUID REFERENCES residuos(id) ON DELETE SET NULL,
  co2_evitado_kg DECIMAL DEFAULT 0,
  agua_protegida_litros DECIMAL DEFAULT 0,
  energia_generada_kwh DECIMAL DEFAULT 0,
  valor_economico_usd DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Reportes Empresariales
-- =============================================
CREATE TABLE reportes_empresariales (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  periodo TEXT NOT NULL,
  total_residuos INTEGER DEFAULT 0,
  total_transformados INTEGER DEFAULT 0,
  co2_evitado_total DECIMAL DEFAULT 0,
  cumplimiento_porcentaje DECIMAL DEFAULT 0,
  generado_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE residuos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gestores ENABLE ROW LEVEL SECURITY;
ALTER TABLE conexiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE impacto_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reportes_empresariales ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Residuos: Users can CRUD own, gestores can view available
CREATE POLICY "Users can view own residuos" ON residuos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Gestores can view available residuos" ON residuos FOR SELECT USING (estado = 'disponible');
CREATE POLICY "Users can insert own residuos" ON residuos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own residuos" ON residuos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own residuos" ON residuos FOR DELETE USING (auth.uid() = user_id);

-- Gestores: Public read, owner write
CREATE POLICY "Gestores are viewable by everyone" ON gestores FOR SELECT USING (activo = true);
CREATE POLICY "Gestores can update own data" ON gestores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create gestor profile" ON gestores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Conexiones: Involved parties can view
CREATE POLICY "Users can view own conexiones" ON conexiones FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM residuos WHERE id = residuo_id
      UNION
      SELECT user_id FROM gestores WHERE id = gestor_id
    )
  );
CREATE POLICY "Users can create conexiones" ON conexiones FOR INSERT WITH CHECK (true);

-- Impacto: Users can view own
CREATE POLICY "Users can view own impacto" ON impacto_logs FOR SELECT USING (auth.uid() = user_id);

-- Reportes: Company can view own
CREATE POLICY "Companies can view own reports" ON reportes_empresariales FOR SELECT USING (auth.uid() = empresa_id);

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX idx_residuos_user_id ON residuos(user_id);
CREATE INDEX idx_residuos_estado ON residuos(estado);
CREATE INDEX idx_residuos_tipo ON residuos(tipo);
CREATE INDEX idx_gestores_ciudad ON gestores(ciudad);
CREATE INDEX idx_gestores_activo ON gestores(activo);
CREATE INDEX idx_conexiones_residuo ON conexiones(residuo_id);
CREATE INDEX idx_conexiones_gestor ON conexiones(gestor_id);
CREATE INDEX idx_impacto_user ON impacto_logs(user_id);
