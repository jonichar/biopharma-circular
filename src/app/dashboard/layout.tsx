"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import {
  Leaf,
  LayoutDashboard,
  Package,
  MapPin,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Link2,
} from "lucide-react";
import styles from "./dashboard.module.css";

type Profile = {
  full_name: string;
  role: string;
  email: string;
};

const navItems = [
  {
    section: "Principal",
    links: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Resumen" },
      { href: "/dashboard/residuos", icon: Package, label: "Mis Residuos", badge: "Nuevo" },
      { href: "/dashboard/gestores", icon: MapPin, label: "Gestores" },
      { href: "/dashboard/conexiones", icon: Link2, label: "Conexiones" },
    ],
  },
  {
    section: "Análisis",
    links: [
      { href: "/dashboard/impacto", icon: BarChart3, label: "Mi Impacto" },
      { href: "/dashboard/reportes", icon: FileText, label: "Reportes" },
    ],
  },
  {
    section: "Cuenta",
    links: [
      { href: "/dashboard/configuracion", icon: Settings, label: "Configuración" },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("full_name, role, email")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
      } else {
        setProfile({
          full_name: user.email?.split("@")[0] || "Usuario",
          role: "person",
          email: user.email || "",
        });
      }

      setLoading(false);
    };

    getProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const roleLabels: Record<string, string> = {
    person: "Persona",
    company: "Empresa",
    gestor: "Gestor",
    admin: "Admin",
  };

  if (loading) {
    return (
      <div className={styles.dashboardLayout}>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              border: "3px solid rgba(16, 185, 129, 0.2)",
              borderTopColor: "var(--color-primary)",
              borderRadius: "50%",
              animation: "spin 0.6s linear infinite",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardLayout}>
      {/* Mobile toggle */}
      <button
        className={styles.mobileToggle}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${
          mobileOpen ? styles.sidebarOpen : ""
        }`}
      >
        {/* Brand */}
        <Link
          href="/"
          className={styles.sidebarBrand}
          onClick={() => setMobileOpen(false)}
        >
          <div className={styles.sidebarBrandIcon}>
            <Leaf size={18} />
          </div>
          <div className={styles.sidebarBrandName}>
            Bio<span>Pharma</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className={styles.sidebarNav}>
          {navItems.map((section) => (
            <div key={section.section} className={styles.navSection}>
              <span className={styles.navSectionTitle}>
                {section.section}
              </span>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${styles.navLink} ${
                    pathname === link.href ? styles.navLinkActive : ""
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <link.icon size={18} />
                  {link.label}
                  {"badge" in link && link.badge && (
                    <span className={styles.navBadge}>{link.badge}</span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* User card */}
        {profile && (
          <div className={styles.sidebarFooter}>
            <div className={styles.userCard}>
              <div className={styles.userAvatar}>
                {getInitials(profile.full_name || "U")}
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>
                  {profile.full_name || "Usuario"}
                </div>
                <div className={styles.userRole}>
                  {roleLabels[profile.role] || profile.role}
                </div>
              </div>
              <button
                className={styles.logoutBtn}
                onClick={handleLogout}
                title="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
