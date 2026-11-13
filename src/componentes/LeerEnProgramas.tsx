import type { Partido } from '../logica/tipos'
import { tienePrograma } from '../datos'

const paginas = (desde: number, hasta: number) => (desde === hasta ? `pág. ${desde}` : `págs. ${desde}–${hasta}`)

/** Enlaces a la parte del programa de cada partido que habla de un tema, para leer más allá de las frases */
export function LeerEnProgramas({ tema, nombreTema, partidos }: { tema: string; nombreTema: string; partidos: Partido[] }) {
  const conPrograma = partidos.filter((p) => tienePrograma(p) && p.programa_url)
  const sinPrograma = partidos.filter((p) => !(tienePrograma(p) && p.programa_url))
  return (
    <section className="tarjeta pila leer-programas" aria-labelledby="leer-programas">
      <div>
        <h2 id="leer-programas" style={{ fontSize: '1.2rem' }}>Lee qué dice cada partido sobre {nombreTema.toLowerCase()}</h2>
        <p className="secundario" style={{ margin: 0, fontSize: '0.95rem' }}>
          Las frases de arriba son solo una parte. Aquí tienes las páginas de cada programa que tratan este tema. Se abren en otra pestaña, en la web del partido.
        </p>
      </div>
      <ul>
        {conPrograma.map((p) => {
          const tramos = p.temas_programa?.[tema]
          return (
            <li key={p.id}>
              <strong className="leer-programas-partido">
                <span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: 6, background: p.color, flexShrink: 0 }} />
                {p.nombre}
              </strong>
              {!tramos?.length ? (
                <span className="secundario">Su programa no trata este tema.</span>
              ) : (
                <span className="leer-programas-enlaces">
                  {tramos.map((t) => (
                    <a key={`${t.desde}-${t.hasta}`} href={`${p.programa_url}#page=${t.desde}`} target="_blank" rel="noopener noreferrer">
                      {t.tipo === 'apartado' && t.titulo ? `«${t.titulo}»` : 'Medidas sueltas sobre el tema'}, {paginas(t.desde, t.hasta)}
                      <span aria-hidden="true"> ↗</span>
                      <span className="solo-lectores"> (se abre en otra pestaña)</span>
                    </a>
                  ))}
                </span>
              )}
            </li>
          )
        })}
      </ul>
      {sinPrograma.length > 0 && (
        <p className="secundario" style={{ margin: 0, fontSize: '0.95rem' }}>
          <strong>Aún sin programa:</strong> {sinPrograma.map((p) => p.nombre).join(', ')}.
        </p>
      )}
    </section>
  )
}
