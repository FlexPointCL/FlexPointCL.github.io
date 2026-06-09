import { NextRequest, NextResponse } from "next/server";
import anthropic, { MODEL } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const { respuestas } = await req.json();

    if (!respuestas) {
      return NextResponse.json({ error: "Respuestas requeridas" }, { status: 400 });
    }

    const respuestasFormateadas = Object.entries(respuestas)
      .map(([clave, valor]) => {
        const labels: Record<string, string> = {
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
        const label = labels[clave] || clave;
        return `${label}: ${valor || "(no respondido)"}`;
      })
      .join("\n");

    const prompt = `Eres el asistente de Flexpoint, empresa de desarrollo de software con IA.
Analizas los requerimientos de un cliente para determinar si hay información faltante crítica para preparar una propuesta técnica y comercial.

Respuestas del formulario:
${respuestasFormateadas}

Determina:
1. ¿Hay información crítica que falta para poder estimar el proyecto?
2. Si falta información, genera máximo 5 preguntas específicas y concretas.
3. No preguntes cosas que ya fueron respondidas.
4. Solo pregunta si ES CRÍTICO para la propuesta — no seas exhaustivo.
5. Si el problema está suficientemente descrito para hacer una estimación razonable, responde con necesitaPreguntas: false.

Responde en JSON exactamente así (sin markdown, sin backticks, solo JSON puro):
{
  "necesitaPreguntas": true,
  "preguntasAdicionales": ["pregunta 1", "pregunta 2"],
  "razonamiento": "breve explicación"
}`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const rawText = message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from response
    let parsed: {
      necesitaPreguntas: boolean;
      preguntasAdicionales: string[];
      razonamiento: string;
    };

    try {
      // Remove potential markdown code blocks
      const cleaned = rawText.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Error parsing Claude response:", rawText);
      // Default: no additional questions needed
      parsed = {
        necesitaPreguntas: false,
        preguntasAdicionales: [],
        razonamiento: "No se pudo analizar la respuesta",
      };
    }

    return NextResponse.json({
      necesitaPreguntas: parsed.necesitaPreguntas ?? false,
      preguntasAdicionales: parsed.preguntasAdicionales ?? [],
      razonamiento: parsed.razonamiento ?? "",
    });
  } catch (error) {
    console.error("Error en /api/analizar:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
