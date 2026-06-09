import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";

// ─── Clientes ──────────────────────────────────────────────────────────────

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

const DESTINATARIO = "corvalan.jorge@gmail.com";

// ─── Tipos ─────────────────────────────────────────────────────────────────

interface Requerimientos {
  nombreEmpresa: string;
  rubro: string;
  contacto: string;
  empleados: string;
  ciudad: string;
  problema: string;
  comoResuelveHoy: string;
  resultadoEsperado: string;
  tiempoConProblema: string;
  perdidasCostos: string;
  numUsuarios: string;
  fechaLimite: string;
  presupuesto: string;
  decisor: string;
  intentosPrevios: string;
  usaWhatsapp: string;
  necesitaIA: string;
  sistemasActuales: string;
  sitioWeb: string;
  datosSensibles: string;
  otros: string;
  informacionAdicional: string;
}

// ─── Generación del documento Word ─────────────────────────────────────────

function crearPropuestaWord(req: Requerimientos, propuestaTexto: string): Buffer {
  const hoy = new Date().toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  function fila(label: string, valor: string): TableRow {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 35, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [new TextRun({ text: label, bold: true, size: 20 })],
            }),
          ],
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
          },
          shading: { fill: "F3F4F6" },
        }),
        new TableCell({
          width: { size: 65, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [new TextRun({ text: valor || "—", size: 20 })],
            }),
          ],
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
          },
        }),
      ],
    });
  }

  const doc = new Document({
    sections: [
      {
        children: [
          // Encabezado
          new Paragraph({
            text: "FLEXPOINT",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Requerimientos extraídos de grabación de reunión",
                color: "6B7280",
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [new TextRun({ text: `Generado: ${hoy}`, size: 20, color: "9CA3AF" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Datos del cliente
          new Paragraph({
            text: "Datos del Cliente",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              fila("Empresa", req.nombreEmpresa),
              fila("Rubro", req.rubro),
              fila("Contacto", req.contacto),
              fila("Empleados", req.empleados),
              fila("Ciudad", req.ciudad),
            ],
          }),

          // Problema
          new Paragraph({
            text: "Sobre el Problema",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              fila("Problema principal", req.problema),
              fila("Solución actual", req.comoResuelveHoy),
              fila("Resultado esperado", req.resultadoEsperado),
              fila("Tiempo con el problema", req.tiempoConProblema),
              fila("Pérdidas / costos", req.perdidasCostos),
            ],
          }),

          // Alcance
          new Paragraph({
            text: "Alcance del Proyecto",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              fila("Nº de usuarios", req.numUsuarios),
              fila("Fecha límite", req.fechaLimite),
              fila("Presupuesto", req.presupuesto),
              fila("Tomador de decisión", req.decisor),
              fila("Intentos previos", req.intentosPrevios),
            ],
          }),

          // Tecnología
          new Paragraph({
            text: "Tecnología e Integraciones",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              fila("Usa WhatsApp", req.usaWhatsapp),
              fila("Necesita IA", req.necesitaIA),
              fila("Sistemas actuales", req.sistemasActuales),
              fila("Sitio web", req.sitioWeb),
              fila("Datos sensibles", req.datosSensibles),
            ],
          }),

          // Otros
          new Paragraph({
            text: "Información Adicional",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              fila("Otros comentarios", req.otros),
              fila("Información adicional", req.informacionAdicional),
            ],
          }),

          // Propuesta generada
          new Paragraph({
            text: "Propuesta Técnica (Generada por IA)",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 600, after: 300 },
          }),
          ...propuestaTexto.split("\n").map(
            (linea) =>
              new Paragraph({
                children: [new TextRun({ text: linea, size: 20 })],
                spacing: { after: 160 },
              })
          ),
        ],
      },
    ],
  });

  return Buffer.from(Packer.toBuffer(doc) as unknown as ArrayBuffer);
}

// ─── Generar propuesta con Claude ──────────────────────────────────────────

async function generarPropuestaTexto(req: Requerimientos): Promise<string> {
  const resumen = `
Empresa: ${req.nombreEmpresa || "—"}
Rubro: ${req.rubro || "—"}
Contacto: ${req.contacto || "—"}
Empleados: ${req.empleados || "—"}
Ciudad: ${req.ciudad || "—"}

Problema: ${req.problema || "—"}
Cómo lo resuelven hoy: ${req.comoResuelveHoy || "—"}
Resultado esperado: ${req.resultadoEsperado || "—"}
Tiempo con el problema: ${req.tiempoConProblema || "—"}
Pérdidas/costos: ${req.perdidasCostos || "—"}

Usuarios: ${req.numUsuarios || "—"}
Fecha límite: ${req.fechaLimite || "—"}
Presupuesto: ${req.presupuesto || "—"}
Decisor: ${req.decisor || "—"}
Intentos previos: ${req.intentosPrevios || "—"}

Usa WhatsApp: ${req.usaWhatsapp || "—"}
Necesita IA: ${req.necesitaIA || "—"}
Sistemas actuales: ${req.sistemasActuales || "—"}
Sitio web: ${req.sitioWeb || "—"}
Datos sensibles: ${req.datosSensibles || "—"}

Información adicional: ${req.informacionAdicional || "—"}
`.trim();

  const mensaje = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Eres el asistente comercial de Flexpoint, una empresa de desarrollo de software a medida e integraciones con IA.

Se te entregan los requerimientos extraídos de una reunión con un cliente. Genera una propuesta técnica preliminar en español con:
1. Resumen ejecutivo del proyecto
2. Solución propuesta (arquitectura general, tecnologías sugeridas)
3. Módulos o funcionalidades principales
4. Consideraciones técnicas importantes
5. Próximos pasos recomendados

Sé concreto y profesional. Máximo 600 palabras.

REQUERIMIENTOS:
${resumen}`,
      },
    ],
  });

  const bloque = mensaje.content[0];
  return bloque.type === "text" ? bloque.text : "";
}

// ─── POST handler ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const archivo = formData.get("audio") as File | null;

    if (!archivo) {
      return NextResponse.json({ error: "No se recibió archivo de audio" }, { status: 400 });
    }

    const MAX_MB = 100;
    if (archivo.size > MAX_MB * 1024 * 1024) {
      return NextResponse.json({ error: `El archivo supera los ${MAX_MB}MB` }, { status: 400 });
    }

    // 1. Transcribir con Whisper
    const transcripcion = await openai.audio.transcriptions.create({
      file: archivo,
      model: "whisper-1",
      language: "es",
    });

    const texto = transcripcion.text;

    // 2. Extraer requerimientos con Claude
    const extraccion = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `Eres el asistente de Flexpoint. Se te entrega la transcripción de una reunión de toma de requerimientos con un cliente.

Transcripción:
${texto}

Extrae toda la información relevante y genera ÚNICAMENTE un JSON válido (sin texto adicional, sin markdown, sin bloques de código) con los requerimientos del cliente:
{
  "nombreEmpresa": "",
  "rubro": "",
  "contacto": "",
  "empleados": "",
  "ciudad": "",
  "problema": "",
  "comoResuelveHoy": "",
  "resultadoEsperado": "",
  "tiempoConProblema": "",
  "perdidasCostos": "",
  "numUsuarios": "",
  "fechaLimite": "",
  "presupuesto": "",
  "decisor": "",
  "intentosPrevios": "",
  "usaWhatsapp": "",
  "necesitaIA": "",
  "sistemasActuales": "",
  "sitioWeb": "",
  "datosSensibles": "",
  "otros": "",
  "informacionAdicional": ""
}
Si algún dato no se menciona en la transcripción, deja el campo vacío.`,
        },
      ],
    });

    const bloqueExtraccion = extraccion.content[0];
    if (bloqueExtraccion.type !== "text") {
      throw new Error("Respuesta inesperada de Claude al extraer requerimientos");
    }

    let requerimientos: Requerimientos;
    try {
      // Limpiar posibles backticks o markdown
      const jsonLimpio = bloqueExtraccion.text
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/gi, "")
        .trim();
      requerimientos = JSON.parse(jsonLimpio);
    } catch {
      throw new Error("No se pudo parsear el JSON de requerimientos");
    }

    // 3. Generar propuesta técnica con Claude
    const propuestaTexto = await generarPropuestaTexto(requerimientos);

    // 4. Crear documento Word
    const wordBuffer = crearPropuestaWord(requerimientos, propuestaTexto);

    // 5. Enviar por email con Resend
    const empresa = requerimientos.nombreEmpresa || "cliente";
    const hoy = new Date().toLocaleDateString("es-CL");

    await resend.emails.send({
      from: "Flexpoint <noreply@flexpoint.cl>",
      to: DESTINATARIO,
      subject: `[Audio] Requerimientos de ${empresa} — ${hoy}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nueva propuesta generada desde grabación de audio</h2>
          <p><strong>Empresa:</strong> ${empresa}</p>
          <p><strong>Rubro:</strong> ${requerimientos.rubro || "—"}</p>
          <p><strong>Contacto:</strong> ${requerimientos.contacto || "—"}</p>
          <p><strong>Ciudad:</strong> ${requerimientos.ciudad || "—"}</p>
          <hr style="border-color: #e2e8f0; margin: 20px 0;" />
          <p><strong>Problema:</strong> ${requerimientos.problema || "—"}</p>
          <p><strong>Presupuesto:</strong> ${requerimientos.presupuesto || "—"}</p>
          <hr style="border-color: #e2e8f0; margin: 20px 0;" />
          <p style="color: #6b7280; font-size: 12px;">
            La propuesta completa se adjunta en el archivo Word.<br />
            Generado automáticamente por Flexpoint AI — ${hoy}
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `propuesta-${empresa.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.docx`,
          content: wordBuffer.toString("base64"),
        },
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("[audio/route] Error:", error);
    const mensaje = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json({ error: mensaje }, { status: 500 });
  }
}
