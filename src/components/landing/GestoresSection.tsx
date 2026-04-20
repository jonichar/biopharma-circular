"use client";

import { useState, useMemo } from "react";
import {
  MapPin,
  Star,
  Truck,
  Phone,
  ArrowRight,
  Search,
  Recycle,
  FlaskConical,
  Sprout,
  Zap,
} from "lucide-react";
import styles from "./GestoresSection.module.css";

const gestoresData = [
  {
    name: "BioRecicla Colombia",
    specialty: "Degradación enzimática de fármacos",
    city: "Bogotá",
    rating: 4.8,
    reviews: 127,
    transforms: 2340,
    categories: ["Farmacéutico", "Químico"],
    icon: FlaskConical,
    color: "primary" as const,
  },
  {
    name: "EcoFarma Verde",
    specialty: "Compostaje de residuos orgánicos hospitalarios",
    city: "Medellín",
    rating: 4.6,
    reviews: 89,
    transforms: 1850,
    categories: ["Orgánico", "Biológico"],
    icon: Sprout,
    color: "secondary" as const,
  },
  {
    name: "BiogásPlus S.A.S",
    specialty: "Generación de biogás a partir de residuos mixtos",
    city: "Cali",
    rating: 4.9,
    reviews: 156,
    transforms: 3100,
    categories: ["Orgánico", "Químico"],
    icon: Zap,
    color: "accent" as const,
  },
  {
    name: "TerraPharm Gestión",
    specialty: "Tratamiento de aguas residuales farmacéuticas",
    city: "Barranquilla",
    rating: 4.5,
    reviews: 72,
    transforms: 980,
    categories: ["Farmacéutico", "Químico"],
    icon: Recycle,
    color: "primary" as const,
  },
  {
    name: "AgroVerde Biotech",
    specialty: "Producción de biofertilizantes a partir de desechos orgánicos",
    city: "Cartagena",
    rating: 4.7,
    reviews: 94,
    transforms: 1620,
    categories: ["Orgánico", "Biológico"],
    icon: Sprout,
    color: "secondary" as const,
  },
  {
    name: "PharmaCycle Labs",
    specialty: "Recuperación de principios activos en fármacos vencidos",
    city: "Bogotá",
    rating: 4.4,
    reviews: 61,
    transforms: 740,
    categories: ["Farmacéutico", "Biológico"],
    icon: FlaskConical,
    color: "accent" as const,
  },
];

// Safe number format helper that avoids hydration mismatch
function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const cities = ["Todas", "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena"];

// Map dot positions for Colombian cities (approximate visual placement)
const mapPins: Record<string, { top: string; left: string }> = {
  Bogotá: { top: "42%", left: "48%" },
  Medellín: { top: "32%", left: "36%" },
  Cali: { top: "55%", left: "32%" },
  Barranquilla: { top: "15%", left: "42%" },
  Cartagena: { top: "18%", left: "32%" },
};

export default function GestoresSection() {
  const [activeCity, setActiveCity] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGestores = useMemo(() => {
    return gestoresData.filter((g) => {
      const matchesCity = activeCity === "Todas" || g.city === activeCity;
      const matchesSearch =
        searchQuery === "" ||
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.categories.some((c) =>
          c.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCity && matchesSearch;
    });
  }, [activeCity, searchQuery]);

  return (
    <section className={styles.section} id="gestores">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.tag}>
            <MapPin size={14} /> Red de Gestores
          </span>
          <h2 className={styles.title}>
            Conecta con{" "}
            <span className="gradient-text">gestores certificados</span> cerca
            de ti
          </h2>
          <p className={styles.subtitle}>
            Más de 340 gestores biotecnológicos en toda Colombia listos para
            transformar tus residuos en productos de valor.
          </p>
        </div>

        {/* Search & Filter bar */}
        <div className={styles.searchBar}>
          <div className={styles.searchInput}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar gestor por nombre o especialidad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className={styles.clearBtn}
                onClick={() => setSearchQuery("")}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
          <div className={styles.filterGroup}>
            {cities.map((city) => (
              <button
                key={city}
                className={`${styles.filterBtn} ${
                  activeCity === city ? styles.filterActive : ""
                }`}
                onClick={() => setActiveCity(city)}
              >
                {city === "Todas" ? "🌐 Todas" : `📍 ${city}`}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className={styles.resultsInfo}>
          <span>
            Mostrando <strong>{filteredGestores.length}</strong> de{" "}
            <strong>{gestoresData.length}</strong> gestores
            {activeCity !== "Todas" && (
              <> en <strong>{activeCity}</strong></>
            )}
          </span>
        </div>

        {/* Map + Gestor cards */}
        <div className={styles.content}>
          {/* Map area */}
          <div className={styles.mapArea}>
            <div className={styles.mapPlaceholder}>
              {/* Colombia silhouette SVG */}
              <svg
                className={styles.mapSvg}
                viewBox="0 0 400 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Simplified Colombia outline */}
                <path
                  d="M160 40 L200 30 L240 40 L260 60 L270 90 L250 100 L260 120 L280 130 L290 160 L280 190 L260 200 L250 230 L240 260 L230 280 L210 300 L190 320 L180 350 L170 380 L160 400 L140 410 L120 390 L110 360 L100 330 L90 300 L100 270 L110 240 L120 210 L130 180 L120 150 L130 120 L140 90 L150 60 Z"
                  fill="rgba(16, 185, 129, 0.06)"
                  stroke="rgba(16, 185, 129, 0.15)"
                  strokeWidth="1.5"
                />
                {/* Grid lines */}
                <line x1="60" y1="100" x2="340" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="60" y1="200" x2="340" y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="60" y1="300" x2="340" y2="300" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="150" y1="20" x2="150" y2="420" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <line x1="250" y1="20" x2="250" y2="420" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              </svg>

              {/* City pins */}
              {Object.entries(mapPins).map(([city, pos]) => {
                const isActive = activeCity === "Todas" || activeCity === city;
                const hasCityResults = filteredGestores.some(
                  (g) => g.city === city
                );
                return (
                  <button
                    key={city}
                    className={`${styles.mapPin} ${
                      isActive && hasCityResults ? styles.mapPinActive : ""
                    } ${activeCity === city ? styles.mapPinSelected : ""}`}
                    style={{ top: pos.top, left: pos.left }}
                    onClick={() =>
                      setActiveCity(activeCity === city ? "Todas" : city)
                    }
                    title={city}
                  >
                    <div className={styles.pinDot} />
                    <span className={styles.pinLabel}>{city}</span>
                  </button>
                );
              })}

              {/* Connecting lines between active cities */}
              <div className={styles.mapGlow} />
            </div>
          </div>

          {/* Gestor cards */}
          <div className={styles.gestorList}>
            {filteredGestores.length === 0 ? (
              <div className={styles.noResults}>
                <Search size={32} />
                <h4>No se encontraron gestores</h4>
                <p>Intenta con otra ciudad o término de búsqueda</p>
                <button
                  className={styles.resetBtn}
                  onClick={() => {
                    setActiveCity("Todas");
                    setSearchQuery("");
                  }}
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              filteredGestores.map((gestor) => (
                <div
                  key={gestor.name}
                  className={`${styles.gestorCard} ${styles[gestor.color]}`}
                >
                  <div className={styles.gestorHeader}>
                    <div className={styles.gestorIcon}>
                      <gestor.icon size={20} />
                    </div>
                    <div className={styles.gestorInfo}>
                      <h4 className={styles.gestorName}>{gestor.name}</h4>
                      <div className={styles.gestorLocation}>
                        <MapPin size={13} />
                        <span>{gestor.city}</span>
                      </div>
                    </div>
                    <div className={styles.gestorRating}>
                      <Star size={14} fill="currentColor" />
                      <span>{gestor.rating}</span>
                      <span className={styles.reviews}>
                        ({gestor.reviews})
                      </span>
                    </div>
                  </div>

                  <p className={styles.gestorSpecialty}>{gestor.specialty}</p>

                  <div className={styles.gestorMeta}>
                    <div className={styles.gestorCategories}>
                      {gestor.categories.map((cat) => (
                        <span key={cat} className={styles.categoryBadge}>
                          {cat}
                        </span>
                      ))}
                    </div>
                    <div className={styles.gestorStat}>
                      <Truck size={14} />
                      <span>{formatNumber(gestor.transforms)} transformaciones</span>
                    </div>
                  </div>

                  <div className={styles.gestorActions}>
                    <button className={styles.contactBtn}>
                      <Phone size={14} />
                      Contactar
                    </button>
                    <button className={styles.detailBtn}>
                      Ver perfil <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
