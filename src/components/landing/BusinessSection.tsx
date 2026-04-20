import {
  CreditCard,
  Handshake,
  Database,
  ArrowRight,
  Check,
  Crown,
  Zap,
  Building2,
} from "lucide-react";
import styles from "./BusinessSection.module.css";

const businessModels = [
  {
    icon: CreditCard,
    title: "Suscripción Empresarial",
    description:
      "Planes mensuales para empresas con reportes de sostenibilidad, gestión regulada y cumplimiento ambiental.",
    features: ["Reportes ilimitados", "Dashboard avanzado", "Soporte prioritario", "API access"],
  },
  {
    icon: Handshake,
    title: "Marketplace de Residuos",
    description:
      "Conexión entre generadores de residuos y gestores biotecnológicos. Comisión por cada transacción exitosa.",
    features: ["Match inteligente", "Logística integrada", "Trazabilidad completa", "Pagos seguros"],
  },
  {
    icon: Database,
    title: "Datos Ambientales",
    description:
      "Venta de datos anonimizados sobre generación, gestión y transformación de residuos para investigación.",
    features: ["Datos anonimizados", "API de consulta", "Informes sectoriales", "Tendencias"],
  },
];

const plans = [
  {
    name: "Persona",
    icon: Zap,
    price: "Gratis",
    period: "",
    features: [
      "Registro de residuos",
      "Análisis básico",
      "Mapa de gestores",
      "Calculadora de impacto",
    ],
    cta: "Comenzar gratis",
    popular: false,
  },
  {
    name: "Empresa",
    icon: Crown,
    price: "$49",
    period: "/mes",
    features: [
      "Todo lo de Persona",
      "Reportes de sostenibilidad",
      "Gestión regulada",
      "Dashboard avanzado",
      "Soporte prioritario",
      "API access",
    ],
    cta: "Prueba 14 días gratis",
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    period: "",
    features: [
      "Todo lo de Empresa",
      "Multi-sede",
      "Integraciones custom",
      "SLA garantizado",
      "Account manager",
      "Datos avanzados",
    ],
    cta: "Contactar ventas",
    popular: false,
  },
];

export default function BusinessSection() {
  return (
    <section className={styles.section} id="empresas">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.tag}>💰 Modelo de Negocio</span>
          <h2 className={styles.title}>
            Un modelo <span className="gradient-text">sostenible</span> en todos
            los sentidos
          </h2>
          <p className={styles.subtitle}>
            Tres fuentes de ingreso que hacen la plataforma viable y escalable
            como startup real.
          </p>
        </div>

        {/* Business models */}
        <div className={styles.modelsGrid}>
          {businessModels.map((model) => (
            <div key={model.title} className={styles.modelCard}>
              <div className={styles.modelIcon}>
                <model.icon size={28} />
              </div>
              <h3 className={styles.modelTitle}>{model.title}</h3>
              <p className={styles.modelDesc}>{model.description}</p>
              <ul className={styles.modelFeatures}>
                {model.features.map((f) => (
                  <li key={f}>
                    <Check size={14} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className={styles.pricing}>
          <h3 className={styles.pricingTitle}>Planes y precios</h3>
          <div className={styles.plansGrid}>
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`${styles.planCard} ${
                  plan.popular ? styles.popular : ""
                }`}
              >
                {plan.popular && (
                  <div className={styles.popularBadge}>Más popular</div>
                )}
                <div className={styles.planHeader}>
                  <plan.icon size={22} className={styles.planIcon} />
                  <h4 className={styles.planName}>{plan.name}</h4>
                </div>
                <div className={styles.planPrice}>
                  <span className={styles.priceAmount}>{plan.price}</span>
                  {plan.period && (
                    <span className={styles.pricePeriod}>{plan.period}</span>
                  )}
                </div>
                <ul className={styles.planFeatures}>
                  {plan.features.map((f) => (
                    <li key={f}>
                      <Check size={14} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className={`${styles.planCta} ${
                    plan.popular ? styles.planCtaPrimary : ""
                  }`}
                >
                  {plan.cta}
                  <ArrowRight size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
