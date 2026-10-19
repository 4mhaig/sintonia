import { useEffect, useMemo, useState } from 'react'
import type { Respuestas } from '../logica/tipos'
import { calcularAfinidad } from '../logica/afinidad'
import { AFIRMACIONES, PARTIDOS, partidoPorId } from '../datos'
import { Onda } from '../componentes/Onda'
import { Dial } from '../componentes/Dial'
import { ir } from '../App'

interface Props {
  respuestas: Respuestas
  importantes: string[]
}

const textoPorId = (id: string) => AFIRMACIONES.find((a) => a.id === id)?.texto ?? id

export function Resultado({ respuestas, importantes }: Props) {
  const afinidades = useMemo(() => calcularAfinidad(PARTIDOS, AFIRMACIONES, respuestas, importantes), [respuestas, importantes])
  const [listo, setListo] = useState(false)
  const [abierto, setAbierto] = useState<string | null>(null)

  useEffect(() => {
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = setTimeout(() => setListo(true), quieto ? 0 : 1600)
    return () => clearTimeout(id)
  }, [])

  const mejor = afinidades[0]
  const empatados = afinidades.filter((a) => a.porcentaje === mejor.porcentaje)

  return (
    <div className="pila">
      <div>
        <span className="mono secundario" aria-live="polite">{listo ? 'señal 100% · sin ruido' : 'sintonizando…'}</span>
        <div className="tarjeta" style={{ padding: 0, marginTop: 8, overflow: 'hidden' }}>
          <Onda ruido={listo ? 0 : 0.2} />
        </div>
      </div>

      {listo && (
        <>
          <Dial partidos={PARTIDOS} elegido={mejor.partido} />

          <section aria-live="polite">
            <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)' }}>
              {empatados.length > 1
                ? `Sintonizas por igual con ${empatados.map((a) => partidoPorId(a.partido)?.nombre).join(' y ')}`
                : `Sintonizas más con ${partidoPorId(mejor.partido)?.nombre}`}
            </h1>
            <p className="secundario">
              Coincides en un {mejor.porcentaje}% de las frases.
              {importantes.length > 0 && ' Los temas que marcaste como importantes cuentan el doble.'} Esto no es una recomendación de voto: es una comparación con lo que dicen sus programas.
            </p>
          </section>

          <section className="pila" aria-label="Coincidencia con cada partido">
            {afinidades.map((a, i) => {
              const p = partidoPorId(a.partido)!
              const abiertoAqui = abierto === p.id
              return (
                <div key={p.id} className="tarjeta" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
                    <h3 style={{ margin: 0 }}>{p.nombre}</h3>
                    <span className="mono" style={{ fontSize: '1.1rem', fontWeight: 500 }}>{a.porcentaje}%</span>
                  </div>
                  <div style={{ height: 14, background: 'var(--superficie-2)', borderRadius: 7, margin: '0.6rem 0', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%', width: `${a.porcentaje}%`, background: p.color, borderRadius: 7,
                        animation: `barra 900ms ${i * 120}ms both cubic-bezier(.2,.8,.2,1)`,
                      }}
                    />
                  </div>
                  {a.pocoFiable && <p className="aviso" style={{ margin: '0.5rem 0' }}>Su programa no habla de muchas de tus frases: este resultado es poco fiable.</p>}
                  <button className="boton fantasma" style={{ padding: 0, minHeight: 44 }} aria-expanded={abiertoAqui} onClick={() => setAbierto(abiertoAqui ? null : p.id)}>
                    {abiertoAqui ? 'Ocultar detalle' : 'En qué coincidís y en qué no'}
                  </button>
                  {abiertoAqui && (
                    <div className="pila" style={{ marginTop: '0.5rem' }}>
                      <Lista titulo="Coincidís en" ids={a.coincidencias} partido={p.id} />
                      <Lista titulo="Pensáis lo contrario en" ids={a.discrepancias} partido={p.id} />
                    </div>
                  )}
                </div>
              )
            })}
          </section>

          <div className="fila">
            <button className="boton principal" onClick={() => ir('provincia')}>¿Qué pasa con mi voto en mi provincia?</button>
            <button className="boton" onClick={() => ir('test')}>Repetir el test</button>
          </div>
        </>
      )}
    </div>
  )
}

function Lista({ titulo, ids, partido }: { titulo: string; ids: string[]; partido: string }) {
  if (!ids.length) return null
  const p = partidoPorId(partido)!
  return (
    <div>
      <h4 style={{ margin: '0 0 0.25rem' }}>{titulo}</h4>
      <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
        {ids.map((id) => {
          const cita = p.posturas.find((x) => x.afirmacion === id)
          return (
            <li key={id} style={{ marginBottom: '0.5rem' }}>
              {textoPorId(id)}
              {cita?.cita && (
                <blockquote className="secundario" style={{ margin: '0.25rem 0 0', fontSize: '0.95rem' }}>
                  «{cita.cita}»{cita.pagina ? ` (pág. ${cita.pagina})` : ''}
                </blockquote>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
