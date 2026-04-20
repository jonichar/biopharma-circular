import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BioPharma Circular | Gestión y Valorización de Residuos Farmacéuticos",
  description:
    "Plataforma de economía circular que transforma residuos farmacéuticos y biológicos en oportunidades económicas mediante biotecnología. Conectamos ciudadanos, empresas y gestores biotecnológicos.",
  keywords: [
    "residuos farmacéuticos",
    "bioeconomía",
    "biotecnología",
    "economía circular",
    "reciclaje medicamentos",
    "gestión residuos",
    "sostenibilidad",
    "biofertilizantes",
  ],
  authors: [{ name: "BioPharma Circular Team" }],
  openGraph: {
    title: "BioPharma Circular",
    description:
      "Transformamos residuos farmacéuticos y biológicos en oportunidades económicas mediante biotecnología.",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
