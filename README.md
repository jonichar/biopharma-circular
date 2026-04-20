# 🌱💊 BioPharma Circular

> **Plataforma de gestión y valorización de residuos farmacéuticos y biológicos**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-green?style=flat-square&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

---

## 🧠 ¿Qué es BioPharma Circular?

Una plataforma web de **economía circular** que conecta:

- 👤 **Personas** — hogares con medicamentos vencidos o residuos orgánicos
- 🏢 **Empresas** — farmacias, clínicas, laboratorios, restaurantes
- 🔬 **Gestores biotecnológicos** — emprendimientos que transforman residuos

Todo enfocado en **recolectar, analizar y transformar residuos en nuevos productos útiles**.

> *"Nuestro proyecto transforma residuos farmacéuticos y biológicos en oportunidades económicas mediante biotecnología, reduciendo el impacto ambiental y conectando ciudadanos con la industria en un modelo de economía circular."*

---

## 🔗 ¿Cómo une Química + Farmacia + Biotecnología?

| 🧪 Química | 💊 Farmacia | 🌱 Biotecnología |
|------------|------------|-----------------|
| Clasificación de fármacos | Manejo seguro de medicamentos | Biofertilizantes |
| Evaluación de toxicidad | Educación sobre uso correcto | Biogás |
| Análisis de estabilidad | Disposición final regulada | Enzimas y biomateriales |
| Impacto ambiental | Cumplimiento normativo | Economía circular |

---

## 🌐 Funcionalidades

### 📲 Registro de Residuos
Personas y empresas registran tipo, cantidad y ubicación de sus residuos.

### 🧠 Sistema Inteligente
Análisis automático: riesgo químico, disposición correcta, uso biotecnológico.

### 🗺️ Conexión con Gestores
Marketplace que conecta residuos con gestores certificados.

### 📊 Calculadora de Impacto
CO₂ evitado, contaminación reducida, valor económico generado.

### 🏢 Módulo Empresarial
Reportes de sostenibilidad, gestión regulada, cumplimiento ambiental.

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|-----------|-----|
| **Next.js 15** (App Router) | Framework frontend + API |
| **TypeScript** | Tipado estático |
| **CSS Modules** | Estilos modulares (vanilla CSS) |
| **Supabase** | Auth, PostgreSQL, Storage, Realtime |
| **Vercel** | Hosting + CI/CD |
| **Lucide React** | Iconografía |

---

## 🚀 Getting Started

### Prerrequisitos

- Node.js 18+
- npm 9+
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Vercel](https://vercel.com) (opcional para deploy)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/biopharma-circular.git
cd biopharma-circular

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router (páginas)
│   ├── layout.tsx          # Layout raíz
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Design system
│   └── (auth)/             # Rutas de autenticación
├── components/
│   ├── layout/             # Header, Footer
│   ├── landing/            # Secciones landing page
│   ├── ui/                 # Componentes base
│   └── dashboard/          # Componentes dashboard
├── lib/
│   ├── supabase/           # Clientes Supabase
│   └── utils.ts            # Utilidades
├── types/                  # Definiciones TypeScript
├── hooks/                  # Custom hooks
└── middleware.ts            # Auth middleware
```

---

## 🔒 Variables de Entorno

| Variable | Descripción | Requerida |
|----------|------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima (pública) | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (server-only) | ✅ |

---

## 💰 Modelo de Negocio

- **Suscripción empresarial** — Planes mensuales para reportes y gestión
- **Marketplace** — Comisión por conexión residuo-gestor
- **Datos ambientales** — Venta de datos anonimizados para investigación

---

## 📄 Licencia

MIT License — ver [LICENSE](LICENSE) para más detalles.

---

## 👥 Equipo

Desarrollado con ❤️ para la innovación en bioeconomía circular.
