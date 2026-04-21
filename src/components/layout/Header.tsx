"use client";

import { useState, useEffect } from "react";
import {
  Leaf,
  Menu,
  X,
  FlaskConical,
  BarChart3,
  Building2,
  MapPin,
  LogIn,
} from "lucide-react";
import styles from "./Header.module.css";

const navLinks = [
  { href: "#features", label: "Características", icon: FlaskConical },
  { href: "#impact", label: "Impacto", icon: BarChart3 },
  { href: "#gestores", label: "Gestores", icon: MapPin },
  { href: "#empresas", label: "Empresas", icon: Building2 },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
      id="main-header"
    >
      <div className={styles.container}>
        <a href="/" className={styles.logo} id="logo-link">
          <div className={styles.logoIcon}>
            <Leaf size={24} />
          </div>
          <div className={styles.logoText}>
            <span className={styles.logoPrimary}>Pharma</span>
            <span className={styles.logoSecondary}>BioNet</span>
          </div>
        </a>

        <nav
          className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ""}`}
          id="main-nav"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.navLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <link.icon size={16} />
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href="/login" className={styles.loginBtn} id="login-btn">
            <LogIn size={18} />
            <span>Iniciar Sesión</span>
          </a>
          <a href="/register" className={styles.ctaBtn} id="register-btn">
            Registrarse
          </a>
          <button
            className={styles.mobileToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
