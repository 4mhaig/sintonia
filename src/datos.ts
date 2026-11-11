import elecciones from '../datos/elecciones.json'
import temas from '../datos/temas.json'
import afirmaciones from '../datos/afirmaciones.json'
import escanos from '../datos/provincias/escanos.json'
import resultadosEjemplo from '../datos/simulador/resultados-ejemplo.json'
import partidosEjemplo from '../datos/simulador/partidos-ejemplo.json'
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

/** Partidos inventados del simulador de escaños: siempre los mismos, separados de los partidos reales */
export type PartidoSimulador = Pick<Partido, 'id' | 'nombre' | 'siglas' | 'color' | 'ambito' | 'provincias'>
export const PARTIDOS_SIMULADOR = mezclar(partidosEjemplo.partidos as PartidoSimulador[])
export const simuladorEn = (provinciaId: string) =>
  PARTIDOS_SIMULADOR.filter((p) => !p.provincias || p.provincias.includes(provinciaId))
export const simuladorPorId = (id: string) => PARTIDOS_SIMULADOR.find((p) => p.id === id)

export const partidoPorId = (id: string) => PARTIDOS.find((p) => p.id === id)
export const provinciaPorId = (id: string) => PROVINCIAS.find((p) => p.id === id)

/** ¿Está este partido en la papeleta de esa provincia? */
export const presentaEn = (partido: Partido, provinciaId: string) =>
  !partido.provincias || partido.provincias.includes(provinciaId)

/** Partidos de la papeleta de una provincia; sin provincia, todos */
export const partidosEn = (provinciaId: string) =>
  provinciaId ? PARTIDOS.filter((p) => presentaEn(p, provinciaId)) : PARTIDOS

/** Un partido real sin programa publicado no se puede comparar: no tiene posturas */
export const tienePrograma = (p: Partido) => p.ficticio || p.programa_publicado !== null

const LENGUAS: Record<string, string> = { ca: 'catalán', gl: 'gallego', eu: 'euskera', va: 'valenciano' }
export const nombreLengua = (codigo?: string) => (codigo ? LENGUAS[codigo] ?? codigo : null)
export const temaPorId = (id: string) => TEMAS.find((t) => t.id === id)
