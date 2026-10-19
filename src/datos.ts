import elecciones from '../datos/elecciones.json'
import temas from '../datos/temas.json'
import afirmaciones from '../datos/afirmaciones.json'
import escanos from '../datos/provincias/escanos.json'
import resultadosEjemplo from '../datos/provincias/resultados-ejemplo.json'
import type { Afirmacion, Partido, Provincia, ResultadoProvincia, Tema } from './logica/tipos'

const archivosPartidos = import.meta.glob<Partido>('../datos/partidos/*.json', { eager: true, import: 'default' })

/** Fisher–Yates: los partidos nunca aparecen en un orden fijo */
export function mezclar<T>(lista: T[]): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

export const ELECCIONES = elecciones
export const TEMAS = temas as Tema[]
export const AFIRMACIONES = afirmaciones as Afirmacion[]
/** Orden aleatorio fijado al cargar la página, igual en todas las pantallas de esa visita */
export const PARTIDOS = mezclar(Object.values(archivosPartidos))
export const PROVINCIAS = escanos.provincias as Provincia[]
export const UMBRAL = escanos.umbral
export const RESULTADOS = resultadosEjemplo.provincias as Record<string, ResultadoProvincia>
export const RESULTADOS_FICTICIOS = resultadosEjemplo.ficticio

export const partidoPorId = (id: string) => PARTIDOS.find((p) => p.id === id)
export const temaPorId = (id: string) => TEMAS.find((t) => t.id === id)
