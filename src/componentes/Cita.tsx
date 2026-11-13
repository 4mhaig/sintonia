import type { Partido, PosturaPartido } from '../logica/tipos'
import { nombreLengua } from '../datos'

/**
 * Cita del programa con su página. Si está en otra lengua, se lee la traducción
 * y debajo queda el original, que es lo que se puede comprobar en el PDF.
 */
export function Cita({ postura, partido }: { postura: PosturaPartido; partido: Partido }) {
  if (!postura.cita) return null
  const lengua = postura.traduccion ? nombreLengua(partido.programa_idioma) : null
  const pagina = postura.pagina ? ` (pág. ${postura.pagina})` : ''
  const enlace = partido.programa_url && postura.pagina ? `${partido.programa_url}#page=${postura.pagina}` : partido.programa_url

  return (
    <blockquote className="cita secundario">
      {postura.aproximada && (
        <span className="aproximacion">
          <span className="chip aproximacion-chip">≈ Aproximación</span>{' '}
          El programa no lo dice con estas palabras: es lo más cercano que hemos encontrado. Léelo y juzga tú.
        </span>
      )}
      «{postura.traduccion ?? postura.cita}»
      {enlace ? <a href={enlace} target="_blank" rel="noopener noreferrer">{pagina}</a> : pagina}
      {postura.traduccion && (
        <details className="cita-original">
          <summary>{lengua ? `Traducido del ${lengua}. Ver original` : 'Traducción. Ver original'}</summary>
          <span lang={partido.programa_idioma}>«{postura.cita}»</span>
        </details>
      )}
    </blockquote>
  )
}
