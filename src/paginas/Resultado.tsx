import { useEffect, useMemo, useState } from 'react'
import type { Respuestas } from '../logica/tipos'
import { calcularAfinidad } from '../logica/afinidad'
import type { Afinidad } from '../logica/afinidad'
import { AFIRMACIONES, PARTIDOS, partidoPorId, partidosEn, presentaEn, provinciaPorId } from '../datos'
import { Onda } from '../componentes/Onda'
import { Dial } from '../componentes/Dial'
import { SelectorProvincia } from '../componentes/SelectorProvincia'
import { ir } from '../App'

interface Props {
  respuestas: Respuestas
  importantes: string[]
  provincia: string
  alElegirProvincia: (id: string) => void
}

const textoPorId = (id: string) => AFIRMACIONES.find((a) => a.id === id)?.texto ?? id

export function Resultado({ respuestas, importantes, provincia, alElegirProvincia }: Props) {
  const papeleta = useMemo(() => partidosEn(provincia), [provincia])
  const afinidades = useMemo(() => calcularAfinidad(papeleta, AFIRMACIONES, respuestas, importantes), [papeleta, respuestas, importantes])
  // Partidos que no se presentan en tu provincia: solo si se piden
  const otras = useMemo(
    () => provincia ? calcularAfinidad(PARTIDOS.filter((p) => !presentaEn(p, provincia)), AFIRMACIONES, respuestas, importantes) : [],
    [provincia, respuestas, importantes],
  )
  const [verOtros, setVerOtros] = useState(false)
  const [cambiarProvincia, setCambiarProvincia] = useState(false)
  const nombreProvincia = provinciaPorId(provincia)?.nombre
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
          <Dial partidos={papeleta} elegido={mejor.partido} />

          <section aria-live="polite">
            <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)' }}>
              {empatados.length > 1
                ? `Sintonizas por igual con ${empatados.map((a) => partidoPorId(a.partido)?.nombre).join(' y ')}`
                : `Sintonizas más con ${partidoPorId(mejor.partido)?.nombre}`}
            </h1>
            <p className="secundario">
              Coincides en un {mejor.porcentaje}% de las frases.
              {importantes.length > 0 && ' Los temas que marcaste como importantes cuentan el doble.'} Esto no es una recomendación de voto: solo compara tus respuestas con lo que dicen los programas. La decisión es tuya.
            </p>
          </section>

          <section className="pila" aria-label="Dónde votas">
            {cambiarProvincia ? (
              <SelectorProvincia
                valor={provincia}
                vacio="Todavía no lo sé: ver todos"
                alCambiar={(id) => { alElegirProvincia(id); setCambiarProvincia(false); setVerOtros(false) }}
              />
            ) : (
              <p style={{ margin: 0 }}>
                {nombreProvincia
                  ? <>Partidos que se presentan en <strong>{nombreProvincia}</strong>.</>
                  : <>Estás viendo <strong>todos los partidos</strong>. Algunos solo se presentan en ciertas provincias.</>}{' '}
                <button className="boton fantasma" style={{ padding: 0, minHeight: 44 }} onClick={() => setCambiarProvincia(true)}>
                  {nombreProvincia ? 'Cambiar provincia' : 'Elegir dónde votas'}
                </button>
              </p>
            )}
          </section>

          <section className="pila" aria-label="Coincidencia con cada partido">
            {afinidades.map((a, i) => (
              <TarjetaPartido key={a.partido} afinidad={a} orden={i} abierto={abierto} alAbrir={setAbierto} />
            ))}
          </section>

          {otras.length > 0 && (
            <section className="pila" aria-label="Partidos que no se presentan en tu provincia">
              <button className="boton fantasma" style={{ padding: 0, minHeight: 44, alignSelf: 'flex-start' }} aria-expanded={verOtros} onClick={() => setVerOtros((v) => !v)}>
                {verOtros
                  ? 'Ocultar los partidos de otras provincias'
                  : `Ver también ${otras.length === 1 ? 'el partido que no se presenta' : `los ${otras.length} partidos que no se presentan`} en ${nombreProvincia}`}
              </button>
              {verOtros && (
                <>
                  <p className="secundario" style={{ margin: 0 }}>No están en tu papeleta: no puedes votarlos en {nombreProvincia}. Te los enseñamos solo para comparar.</p>
                  {otras.map((a, i) => (
                    <TarjetaPartido key={a.partido} afinidad={a} orden={i} abierto={abierto} alAbrir={setAbierto} />
                  ))}
                </>
              )}
            </section>
          )}

          <div className="fila">
            <button className="boton principal" onClick={() => ir('provincia')}>¿Qué pasa con mi voto en mi provincia?</button>
            <button className="boton" onClick={() => ir('test')}>Repetir el test</button>
          </div>
        </>
      )}
    </div>
  )
}

function TarjetaPartido({ afinidad: a, orden, abierto, alAbrir }: {
  afinidad: Afinidad
  orden: number
  abierto: string | null
  alAbrir: (id: string | null) => void
}) {
  const p = partidoPorId(a.partido)!
  const abiertoAqui = abierto === p.id
  return (
    <div className="tarjeta" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
        <h3 style={{ margin: 0 }}>{p.nombre}</h3>
        <span className="mono" style={{ fontSize: '1.1rem', fontWeight: 500 }}>{a.porcentaje}%</span>
      </div>
      {p.ambito && <p className="secundario" style={{ margin: '0.15rem 0 0', fontSize: '0.9rem' }}>Solo se presenta en {p.ambito}</p>}
      <div style={{ height: 14, background: 'var(--superficie-2)', borderRadius: 7, margin: '0.6rem 0', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%', width: `${a.porcentaje}%`, background: p.color, borderRadius: 7,
            animation: `barra 900ms ${orden * 120}ms both cubic-bezier(.2,.8,.2,1)`,
          }}
        />
      </div>
      {a.pocoFiable && <p className="aviso" style={{ margin: '0.5rem 0' }}>Su programa no habla de muchas de tus frases, así que esta comparación es poco fiable.</p>}
      <button className="boton fantasma" style={{ padding: 0, minHeight: 44 }} aria-expanded={abiertoAqui} onClick={() => alAbrir(abiertoAqui ? null : p.id)}>
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
