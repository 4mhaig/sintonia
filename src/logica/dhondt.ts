import type { ResultadoProvincia } from './tipos'

export interface Reparto {
  escanos: Record<string, number>
  /** Votos válidos = votos a candidaturas + votos en blanco */
  validos: number
  /** Votos mínimos para entrar en el reparto (3 % de los válidos) */
  minimo: number
  /** Partidos que no llegan al 3 % */
  fueraDelUmbral: string[]
  /** Partido que se lleva el último escaño en juego */
  ultimoEscano: string | null
  /** Cociente con el que se ganó el último escaño */
  cocienteUltimo: number
}

/** Reparto de escaños de una provincia con la ley D'Hondt (LOREG art. 163). */
export function repartir(
  { votos, blancos }: ResultadoProvincia,
  totalEscanos: number,
  umbral = 0.03,
): Reparto {
  const validos = Object.values(votos).reduce((s, v) => s + v, 0) + blancos
  const minimo = validos * umbral
  const escanos: Record<string, number> = {}
  const fueraDelUmbral: string[] = []
  const candidatos: string[] = []

  for (const [id, v] of Object.entries(votos)) {
    escanos[id] = 0
    if (v >= minimo && v > 0) candidatos.push(id)
    else fueraDelUmbral.push(id)
  }

  let ultimoEscano: string | null = null
  let cocienteUltimo = 0
  for (let n = 0; n < totalEscanos && candidatos.length; n++) {
    let mejor = candidatos[0]
    let mejorCociente = -1
    for (const id of candidatos) {
      const c = votos[id] / (escanos[id] + 1)
      // Empate: se lo lleva quien tiene más votos en total (LOREG art. 163.1.c)
      if (c > mejorCociente || (c === mejorCociente && votos[id] > votos[mejor])) {
        mejor = id
        mejorCociente = c
      }
    }
    escanos[mejor]++
    ultimoEscano = mejor
    cocienteUltimo = mejorCociente
  }

  return { escanos, validos, minimo: Math.ceil(minimo), fueraDelUmbral, ultimoEscano, cocienteUltimo }
}

/**
 * Cuántos votos más necesitaría un partido para ganar un escaño más,
 * suponiendo que el resto de partidos mantiene sus votos.
 */
export function votosParaOtroEscano(
  resultado: ResultadoProvincia,
  totalEscanos: number,
  partido: string,
  umbral = 0.03,
): number {
  const actuales = repartir(resultado, totalEscanos, umbral).escanos[partido] ?? 0
  if (actuales >= totalEscanos) return Infinity
  const con = (extra: number) =>
    repartir(
      { ...resultado, votos: { ...resultado.votos, [partido]: (resultado.votos[partido] ?? 0) + extra } },
      totalEscanos,
      umbral,
    ).escanos[partido]

  // Más votos nunca quitan escaños al propio partido, así que se puede buscar por bisección
  let alto = 1
  while (con(alto) <= actuales) alto *= 2
  let bajo = Math.floor(alto / 2)
  while (bajo + 1 < alto) {
    const medio = Math.floor((bajo + alto) / 2)
    if (con(medio) > actuales) alto = medio
    else bajo = medio
  }
  return alto
}
