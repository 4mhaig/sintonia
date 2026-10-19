import type { Afirmacion, Partido, Respuestas } from './tipos'

export interface Afinidad {
  partido: string
  porcentaje: number
  /** Frases que cuentan para este partido (respondidas y con postura del partido) */
  comparadas: number
  /** true si el partido no se pronuncia en más de la mitad de las frases respondidas */
  pocoFiable: boolean
  coincidencias: string[]
  discrepancias: string[]
}

/**
 * Coincidencia por frase: 2 − |respuesta − postura| (2 coincide, 1 uno es neutral, 0 opuestos).
 * Las frases de temas importantes cuentan doble. Ver METODOLOGIA.md.
 */
export function calcularAfinidad(
  partidos: Partido[],
  afirmaciones: Afirmacion[],
  respuestas: Respuestas,
  temasImportantes: string[] = [],
): Afinidad[] {
  const respondidas = afirmaciones.filter((a) => respuestas[a.id] != null)

  return partidos.map((p) => {
    const posturas = new Map(p.posturas.map((x) => [x.afirmacion, x.postura]))
    let puntos = 0
    let posibles = 0
    let comparadas = 0
    const coincidencias: string[] = []
    const discrepancias: string[] = []

    for (const a of respondidas) {
      const postura = posturas.get(a.id)
      if (postura == null) continue
      const r = respuestas[a.id] as number
      const peso = temasImportantes.includes(a.tema) ? 2 : 1
      const coincide = 2 - Math.abs(r - postura)
      puntos += coincide * peso
      posibles += 2 * peso
      comparadas++
      if (coincide === 2) coincidencias.push(a.id)
      if (coincide === 0) discrepancias.push(a.id)
    }

    return {
      partido: p.id,
      porcentaje: posibles ? Math.round((puntos / posibles) * 100) : 0,
      comparadas,
      pocoFiable: respondidas.length > 0 && comparadas < respondidas.length / 2,
      coincidencias,
      discrepancias,
    }
  }).sort((a, b) => b.porcentaje - a.porcentaje)
}
