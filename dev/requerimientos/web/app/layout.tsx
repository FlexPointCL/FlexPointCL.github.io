import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solicitud de Propuesta — Flexpoint",
  description:
    "Completa este formulario para que el equipo de Flexpoint prepare tu propuesta técnica y comercial personalizada.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>",
  },
  openGraph: {
    title: "Solicitud de Propuesta — Flexpoint",
    description: "Cuéntanos tu proyecto y prepararemos una propuesta técnica y comercial a medida.",
    url: "https://propuesta.flexpoint.cl",
    siteName: "Flexpoint",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
