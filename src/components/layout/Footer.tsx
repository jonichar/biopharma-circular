import {
  Leaf,
  Mail,
  MapPin,
  Phone,
  Globe,
  Link2,
  MessageSquare,
} from "lucide-react";
import styles from "./Footer.module.css";

const footerLinks = {
  plataforma: [
    { label: "Registro de Residuos", href: "#" },
    { label: "Sistema Inteligente", href: "#" },
    { label: "Mapa de Gestores", href: "#" },
    { label: "Calculadora de Impacto", href: "#" },
  ],
  empresas: [
    { label: "Reportes de Sostenibilidad", href: "#" },
    { label: "Gestión Regulada", href: "#" },
    { label: "API & Integraciones", href: "#" },
    { label: "Planes y Precios", href: "#" },
  ],
  recursos: [
    { label: "Documentación", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Centro de Ayuda", href: "#" },
    { label: "Comunidad", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className={styles.footer} id="main-footer">
      <div className={styles.container}>
        {/* Top Section */}
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <Leaf size={22} />
              </div>
              <div>
                <div className={styles.logoName}>
                  <span>BioPharma</span>
                  <span className={styles.logoAccent}>Circular</span>
                </div>
                <p className={styles.tagline}>
                  Transformando residuos en oportunidades
                </p>
              </div>
            </div>
            <p className={styles.description}>
              Plataforma de economía circular que conecta ciudadanos, empresas y
              gestores biotecnológicos para la gestión inteligente de residuos
              farmacéuticos y biológicos.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink} aria-label="Website">
                <Globe size={18} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Links">
                <Link2 size={18} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Messages">
                <MessageSquare size={18} />
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div className={styles.linksGrid}>
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Plataforma</h4>
              {footerLinks.plataforma.map((link) => (
                <a key={link.label} href={link.href} className={styles.link}>
                  {link.label}
                </a>
              ))}
            </div>
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Empresas</h4>
              {footerLinks.empresas.map((link) => (
                <a key={link.label} href={link.href} className={styles.link}>
                  {link.label}
                </a>
              ))}
            </div>
            <div className={styles.linkColumn}>
              <h4 className={styles.columnTitle}>Recursos</h4>
              {footerLinks.recursos.map((link) => (
                <a key={link.label} href={link.href} className={styles.link}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact bar */}
        <div className={styles.contactBar}>
          <div className={styles.contactItem}>
            <Mail size={16} />
            <span>contacto@biopharmacircular.com</span>
          </div>
          <div className={styles.contactItem}>
            <Phone size={16} />
            <span>+57 300 123 4567</span>
          </div>
          <div className={styles.contactItem}>
            <MapPin size={16} />
            <span>Colombia</span>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} BioPharma Circular. Todos los derechos
            reservados.
          </p>
          <div className={styles.bottomLinks}>
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
