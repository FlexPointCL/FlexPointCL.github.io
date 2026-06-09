import { NextRequest, NextResponse } from "next/server";
import anthropic, { MODEL } from "@/lib/claude";
import { generarWord, type PropuestaData } from "@/lib/generarWord";
import { enviarEmailPropuesta } from "@/lib/enviarEmail";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { respuestas, respuestasAdicionales } = await req.json();

    if (!respuestas) {
      return NextResponse.json({ error: "Respuestas requeridas" }, { status: 400 });
    }

    // Format all answers for Claude
    const labelsBase: Record<string, string> = {
      nombreEmpresa: "Nombre de la empresa",
      rubro: "Rubro / Industria",
      nombreCargo: "Nombre y cargo",
      cantidadEmpleados: "Cantidad de empleados",
      ciudadRegion: "Ciudad / Región",
      problemaResolver: "Problema a resolver",
      comoLoResuelveHoy: "Cómo lo resuelve hoy",
      resultadoEsperado: "Resultado esperado",
      tiempoConProblema: "Tiempo con el problema",
      perdidasCostos: "Pérdidas o costos extra",
      cantidadUsuarios: "Cantidad de usuarios",
      fechaLimite: "Fecha límite",
      presupuesto: "Presupuesto estimado",
      tomadorDecision: "Tomador de decisión",
      intentosPrevios: "Intentos previos",
      usaWhatsApp: "Usa WhatsApp",
      necesitaIA: "Necesita IA",
      sistemasActuales: "Sistemas actuales",
      sitioweb: "Sitio web",
      datosSensibles: "Datos sensibles",
      infoAdicional: "Información adicional",
    };

    const respuestasFormateadas = Object.entries(respuestas as Record<string, string>)
      .map(([clave, valor]) => `${labelsBase[clave] || clave}: ${valor || "(no respondido)"}`)
      .join("\n");

    const respuestasAdicionalesFormateadas =
      respuestasAdicionales && Object.keys(respuestasAdicionales).length > 0
        ? "\n\nINFORMACIÓN ADICIONAL:\n" +
          Object.entries(respuestasAdicionales as Record<string, string>)
            .map(([p, r]) => `${p}: ${r}`)
            .join("\n")
        : "";

    const todasLasRespuestas = respuestasFormateadas + respuestasAdicionalesFormateadas;

    const prompt = `Eres el encargado de propuestas técnicas y comerciales de Flexpoint, empresa chilena de desarrollo de software con IA.
Genera el contenido completo para una propuesta basándote en los requerimientos del cliente.

REQUERIMIENTOS COMPLETOS DEL CLIENTE:
${todasLasRespuestas}

STACK TECNOLÓGICO DISPONIBLE:
- Frontend: Next.js 15, TypeScript, Tailwind CSS
- Backend: Next.js API Routes, Node.js
- Base de datos: PostgreSQL, Redis
- Infraestructura: Hetzner + Docker + Coolify
- CDN/Seguridad: Cloudflare
- Mensajería: Twilio (WhatsApp/SMS)
- Email: Resend
- IA: OpenAI GPT-4o o Anthropic Claude (según conveniencia)
- Pagos: si aplica, Transbank o Mercado Pago

TARIFAS:
- Valor hora desarrollo: $65.000 CLP
- Mensualidad base (hasta 5 usuarios): $149.900 CLP
- Usuarios adicionales: $15.000 CLP/usuario/mes
- Mínimo soporte: 6 meses
- Pago: 50% al firmar, 50% entrega final

INSTRUCCIONES:
1. El "nombreProyecto" debe ser un nombre corto y descriptivo del sistema (ej: "Sistema de Gestión de Turnos para Clínica X")
2. El "resumenEjecutivo" debe ser 2-3 párrafos explicando el problema entendido y la solución propuesta
3. Los módulos deben ser realistas y específicos al requerimiento
4. El cronograma debe ser detallado semana a semana
5. Las horas deben ser realistas (mínimo 80 horas para proyectos simples, hasta 600+ para complejos)
6. Los montos deben calcularse con las tarifas indicadas
7. La mensualidad base es $149.900, más $15.000 por cada usuario adicional sobre 5
8. "totalImplementacion" = totalHoras × 65000
9. "hito1" y "hito2" = totalImplementacion / 2
10. "mensualidadTotal" = 149900 + max(0, usuariosBase - 5) × 15000
11. "totalContrato" = totalImplementacion + mensualidadTotal × 6 (mínimo 6 meses)
12. Si menciona WhatsApp o comunicación por chat → incluyeWhatsApp: true
13. Si menciona IA, automatización inteligente → incluyeIA: true

Genera un JSON con toda la información (sin markdown, sin backticks, solo JSON puro):
{
  "nombreProyecto": "",
  "resumenEjecutivo": "",
  "modulosSolucion": [
    {
      "nombre": "",
      "descripcion": "",
      "funcionalidades": ["funcionalidad 1", "funcionalidad 2"],
      "horas": 0
    }
  ],
  "integraciones": ["integración 1"],
  "cronograma": [
    {
      "semana": 1,
      "modulos": "Nombre del módulo o actividad",
      "entregable": "Qué se entrega esta semana"
    }
  ],
  "totalHoras": 0,
  "totalImplementacion": 0,
  "usuariosBase": 0,
  "mensualidadTotal": 0,
  "hito1": 0,
  "hito2": 0,
  "totalContrato": 0,
  "semanasTotales": 0,
  "incluyeIA": false,
  "proveedorIA": "Anthropic",
  "incluyeWhatsApp": false,
  "datosEspecialesSeguridad": ""
}`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = message.content[0].type === "text" ? message.content[0].text : "";

    let propuestaJson: Omit<PropuestaData, "nombreEmpresa" | "nombreCargo" | "ciudadRegion" | "rubro">;

    try {
      const cleaned = rawText.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
      propuestaJson = JSON.parse(cleaned);
    } catch {
      console.error("Error parsing Claude proposal response:", rawText.slice(0, 500));
      return NextResponse.json(
        { error: "Error al procesar la respuesta de IA" },
        { status: 500 }
      );
    }

    // Build full PropuestaData
    const propuestaData: PropuestaData = {
      ...propuestaJson,
      nombreEmpresa: (respuestas as Record<string, string>).nombreEmpresa || "Cliente",
      nombreCargo: (respuestas as Record<string, string>).nombreCargo || "",
      ciudadRegion: (respuestas as Record<string, string>).ciudadRegion || "",
      rubro: (respuestas as Record<string, string>).rubro || "",
    };

    // Generate Word document
    const wordBuffer = await generarWord(propuestaData);

    // Guardar copia local siempre (backup ante fallo de email)
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const empresa = (propuestaData.nombreEmpresa || "cliente").replace(/[^a-zA-Z0-9]/g, "_");
    const backupDir = path.join(process.cwd(), "propuestas-backup");
    fs.mkdirSync(backupDir, { recursive: true });
    const baseName = `${timestamp}_${empresa}`;
    fs.writeFileSync(path.join(backupDir, `${baseName}.docx`), wordBuffer);
    fs.writeFileSync(
      path.join(backupDir, `${baseName}.json`),
      JSON.stringify({ propuestaData, respuestas, respuestasAdicionales }, null, 2)
    );
    console.log(`[backup] Propuesta guardada en propuestas-backup/${baseName}`);

    // Send email — si falla, no bloquea: la copia local ya está guardada
    let emailEnviado = true;
    try {
      await enviarEmailPropuesta(
        propuestaData,
        wordBuffer,
        respuestas as Record<string, string>,
        (respuestasAdicionales as Record<string, string>) || {}
      );
    } catch (emailError) {
      emailEnviado = false;
      console.error("[email] Fallo al enviar — propuesta guardada localmente en:", backupDir);
      console.error(emailError);
    }

    return NextResponse.json({ ok: true, emailEnviado });
  } catch (error) {
    console.error("Error en /api/generar:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
