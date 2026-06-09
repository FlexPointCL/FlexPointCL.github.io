import SubidaAudio from "@/components/SubidaAudio";
import Link from "next/link";

export default function AudioPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-card-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-heading font-bold text-primary tracking-tight hover:opacity-80 transition-opacity">
              Flex<span className="text-accent">point</span>
            </Link>
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
      <div className="max-w-2xl mx-auto px-4 pt-12 pb-8">
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-xs text-accent font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow"></span>
            Transcripción automática con IA
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary leading-tight">
            Sube la grabación de tu{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              reunión
            </span>
          </h1>
          <p className="text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
            Nuestro sistema transcribirá el audio, extraerá los requerimientos y generará
            una propuesta personalizada automáticamente.
          </p>
          <p className="text-xs text-text-secondary">
            Acepta archivos .m4a, .mp3, .wav, .mp4 — máximo 100MB
          </p>
        </div>

        <SubidaAudio />

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-text-secondary hover:text-accent transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al formulario manual
          </Link>
        </div>
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
