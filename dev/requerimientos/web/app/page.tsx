import FormularioRequerimientos from "@/components/FormularioRequerimientos";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-card-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-heading font-bold text-primary tracking-tight">
              Flex<span className="text-accent">point</span>
            </span>
          </div>
          <a
            href="https://www.flexpoint.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-secondary hover:text-accent transition-colors"
          >
            www.flexpoint.cl ↗
          </a>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-8">
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-xs text-accent font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow"></span>
            Propuesta personalizada — sin costo
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-text-primary leading-tight">
            Cuéntanos tu{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              proyecto
            </span>
          </h1>
          <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Completa el formulario o sube la grabación de tu reunión. Nuestro equipo preparará
            una propuesta técnica y comercial personalizada para ti.
          </p>
        </div>

        {/* ── Selector de flujo ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {/* Opción A — Formulario */}
          <div className="group bg-card border-2 border-primary rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Opción A</span>
                <h2 className="text-lg font-heading font-bold text-text-primary leading-tight">
                  Completar formulario
                </h2>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed flex-1">
              Responde las preguntas de nuestro formulario guiado. El proceso toma menos de 10 minutos
              y nos ayuda a entender tu proyecto en detalle.
            </p>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Recomendado si prefieres escribir
            </div>
          </div>

          {/* Opción B — Audio */}
          <Link href="/audio" className="group bg-card border-2 border-card-border hover:border-accent rounded-2xl p-6 flex flex-col gap-4 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">Opción B</span>
                <h2 className="text-lg font-heading font-bold text-text-primary leading-tight">
                  Subir grabación de audio
                </h2>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed flex-1">
              Sube la grabación de tu reunión y nuestra IA transcribirá el audio, extraerá los
              requerimientos y generará la propuesta automáticamente.
            </p>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              .m4a, .mp3, .wav, .mp4 — máx. 100MB
            </div>
          </Link>
        </div>

        {/* Separador */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-card-border"></div>
          <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">Opción A — Formulario manual</span>
          <div className="flex-1 h-px bg-card-border"></div>
        </div>

        <FormularioRequerimientos />
      </div>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 mt-16 border-t border-card-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <span>© 2025 Flexpoint — Todos los derechos reservados</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
            Tus datos están seguros y no serán compartidos con terceros
          </span>
        </div>
      </footer>
    </main>
  );
}
