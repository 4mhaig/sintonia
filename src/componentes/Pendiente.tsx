import type { Partido } from '../logica/tipos'
import { tienePrograma } from '../datos'

/** Nombre del partido con un asterisco si aún no ha publicado su programa */
export function NombrePartido({ partido }: { partido: Partido }) {
  if (tienePrograma(partido)) return <>{partido.nombre}</>
  return (
    <>
      {partido.nombre}
      <sup className="asterisco" aria-hidden="true">*</sup>
      <span className="solo-lectores"> (aún no ha publicado su programa)</span>
    </>
  )
}

/** Nota al pie que explica el asterisco. Solo se muestra si alguno de los partidos está pendiente. */
export function NotaPendientes({ partidos }: { partidos: Partido[] }) {
  if (!partidos.some((p) => !tienePrograma(p))) return null
  return (
    <p className="nota-pendientes secundario">
      <span aria-hidden="true">* </span>
      Aún no ha publicado su programa electoral para estas elecciones, así que no podemos saber qué propone. Lo añadiremos en un máximo de 48 horas desde que lo publique.
    </p>
  )
}
