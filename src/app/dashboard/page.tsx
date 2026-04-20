"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Package,
  TrendingUp,
  Leaf,
  Recycle,
  ArrowRight,
  Plus,
  BarChart3,
  MapPin,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

type DashboardStats = {
  totalResiduos: number;
  residuosPendientes: number;
  co2Evitado: number;
  conexionesActivas: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalResiduos: 0,
    residuosPendientes: 0,
    co2Evitado: 0,
    conexionesActivas: 0,
  });
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("person");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUserName(profile.full_name || user.email?.split("@")[0] || "Usuario");
        setUserRole(profile.role);
      }

      // Get residuos count
      const { count: totalResiduos } = await supabase
        .from("residuos")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Get pending residuos
      const { count: pendientes } = await supabase
        .from("residuos")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("estado", "registrado");

      // Get impact
      const { data: impacto } = await supabase
        .from("impacto_logs")
        .select("co2_evitado_kg")
        .eq("user_id", user.id);

      const co2Total = impacto?.reduce((sum, log) => sum + (log.co2_evitado_kg || 0), 0) || 0;

      // Get conexiones
      const { count: conexiones } = await supabase
        .from("conexiones")
        .select("*, residuos!inner(user_id)", { count: "exact", head: true })
        .eq("residuos.user_id", user.id);

      setStats({
        totalResiduos: totalResiduos || 0,
        residuosPendientes: pendientes || 0,
        co2Evitado: co2Total,
        conexionesActivas: conexiones || 0,
      });
    };

    fetchData();
  }, []);

  const statCards = [
    {
      label: "Residuos registrados",
      value: stats.totalResiduos.toString(),
      icon: Package,
      color: "primary",
      href: "/dashboard/residuos",
    },
    {
      label: "Pendientes",
      value: stats.residuosPendientes.toString(),
      icon: Clock,
      color: "accent",
      href: "/dashboard/residuos",
    },
    {
      label: "CO₂ evitado",
      value: `${stats.co2Evitado.toFixed(1)} kg`,
      icon: Leaf,
      color: "secondary",
      href: "/dashboard/impacto",
    },
    {
      label: "Conexiones",
      value: stats.conexionesActivas.toString(),
      icon: Recycle,
      color: "primary",
      href: "/dashboard/conexiones",
    },
  ];

  const quickActions = [
    {
      icon: Plus,
      label: "Registrar residuo",
      desc: "Agrega un nuevo residuo farmacéutico o biológico",
      href: "/dashboard/residuos",
      color: "primary",
    },
    {
      icon: MapPin,
      label: "Buscar gestores",
      desc: "Encuentra gestores biotecnológicos cerca de ti",
      href: "/dashboard/gestores",
      color: "secondary",
    },
    {
      icon: BarChart3,
      label: "Ver impacto",
      desc: "Consulta tu huella positiva en el medio ambiente",
      href: "/dashboard/impacto",
      color: "accent",
    },
  ];

  const roleMessages: Record<string, string> = {
    person: "🌱 Como ciudadano, puedes registrar tus residuos y conectar con gestores certificados.",
    company: "🏢 Como empresa, gestiona tus residuos, genera reportes y cumple la normativa ambiental.",
    gestor: "🔬 Como gestor, recibe conexiones, transforma residuos y genera impacto medible.",
    admin: "⚡ Panel de administración completo.",
  };

  return (
    <div className={styles.page}>
      {/* Welcome header */}
      <div className={styles.welcomeHeader}>
        <div>
          <h1 className={styles.welcomeTitle}>
            ¡Hola, {userName}! 👋
          </h1>
          <p className={styles.welcomeSubtitle}>
            {roleMessages[userRole] || roleMessages.person}
          </p>
        </div>
        <Link href="/dashboard/residuos" className={styles.primaryBtn}>
          <Plus size={18} />
          Registrar residuo
        </Link>
      </div>

      {/* Stat cards */}
      <div className={styles.statsGrid}>
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`${styles.statCard} ${styles[stat.color]}`}
          >
            <div className={styles.statIcon}>
              <stat.icon size={22} />
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Acciones rápidas</h2>
        <div className={styles.actionsGrid}>
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`${styles.actionCard} ${styles[action.color]}`}
            >
              <div className={styles.actionIcon}>
                <action.icon size={24} />
              </div>
              <div className={styles.actionContent}>
                <h3>{action.label}</h3>
                <p>{action.desc}</p>
              </div>
              <ArrowRight size={18} className={styles.actionArrow} />
            </Link>
          ))}
        </div>
      </div>

      {/* Empty state hint */}
      {stats.totalResiduos === 0 && (
        <div className={styles.emptyState}>
          <AlertTriangle size={28} />
          <h3>¡Comienza registrando tu primer residuo!</h3>
          <p>
            Registra un medicamento vencido o residuo biológico para conectar
            con gestores y ver tu impacto ambiental.
          </p>
          <Link href="/dashboard/residuos" className={styles.emptyBtn}>
            <Plus size={16} />
            Registrar ahora
          </Link>
        </div>
      )}
    </div>
  );
}
