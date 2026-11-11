import { useMemo, useState } from 'react'
import type { Postura } from '../logica/tipos'
import { AFIRMACIONES, PARTIDOS, TEMAS, partidosEn, provinciaPorId, tienePrograma } from '../datos'
import { Cita } from '../componentes/Cita'

const ETIQUETA: Record<string, { texto: string; color: string }> = {
  '1': { texto: 'A favor', color: 'var(--acento)' },
  '0': { texto: 'Postura intermedia', color: 'var(--texto-2)' },
  '-1': { texto: 'En contra', color: 'var(--aviso)' },
  null: { texto: 'No lo menciona', color: 'var(--texto-2)' },
}
const etiqueta = (p: Postura) => ETIQUETA[String(p)]

const normalizar = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')

export function Temas({ provincia }: { provincia: string }) {
  const [tema, setTema] = useState(TEMAS[0].id)
  const [busqueda, setBusqueda] = useState('')
  const [soloPapeleta, setSoloPapeleta] = useState(true)
  const nombreProvincia = provinciaPorId(provincia)?.nombre
  const filtrando = Boolean(provincia) && soloPapeleta
  const partidos = filtrando ? partidosEn(provincia) : PARTIDOS
  const ocultos = PARTIDOS.length - partidosEn(provincia).length

  const frases = useMemo(() => {
    const q = normalizar(busqueda.trim())
    if (!q) return AFIRMACIONES.filter((a) => a.tema === tema)
    return AFIRMACIONES.filter((a) =>
      normalizar(`${a.texto} ${a.explicacion}`).includes(q) ||
      partidos.some((p) => normalizar(`${p.posturas.find((x) => x.afirmacion === a.id)?.cita ?? ''} ${p.posturas.find((x) => x.afirmacion === a.id)?.traduccion ?? ''}`).includes(q)),
    )
  }, [tema, busqueda, partidos])

  return (
    <div className="pila">
      <h1>Qué propone cada partido</h1>

      {nombreProvincia && ocultos > 0 && (
        <p style={{ margin: 0 }}>
          {filtrando
            ? <>Ves los partidos que se presentan en <strong>{nombreProvincia}</strong>.</>
            : <>Ves <strong>todos los partidos</strong>, también los que no se presentan en {nombreProvincia}.</>}{' '}
          <button className="boton fantasma" style={{ padding: 0, minHeight: 44 }} onClick={() => setSoloPapeleta((v) => !v)}>
            {filtrando ? 'Ver todos' : `Ver solo los de ${nombreProvincia}`}
          </button>
        </p>
      )}

      <label className="pila" style={{ display: 'block' }}>
        <span style={{ fontWeight: 700 }}>Buscar una palabra</span>
        <input type="search" placeholder="alquiler, pensiones, IVA…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      </label>

      {!busqueda && (
        <div className="fila" role="group" aria-label="Elige un tema" style={{ gap: '0.5rem' }}>
          {TEMAS.map((t) => (
            <button key={t.id} className="boton" style={{ minHeight: 44, fontSize: '0.95rem' }} aria-pressed={tema === t.id} onClick={() => setTema(t.id)}>
              {t.nombre}
            </button>
          ))}
        </div>
      )}

      {busqueda && <p className="secundario" aria-live="polite">{frases.length} {frases.length === 1 ? 'resultado' : 'resultados'} para «{busqueda}»</p>}

      {frases.map((a) => (
        <section key={a.id} className="tarjeta pila">
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>{a.texto}</h2>
            <p className="secundario" style={{ margin: 0 }}>{a.explicacion}</p>
          </div>
          {partidos.map((p) => {
            const postura = p.posturas.find((x) => x.afirmacion === a.id)
            const pendiente = !tienePrograma(p)
            const e = pendiente ? { texto: 'Programa aún no publicado', color: 'var(--texto-2)' } : etiqueta(postura?.postura ?? null)
            return (
              <div key={p.id} style={{ borderTop: '1px solid var(--borde)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: 6, background: p.color }} />
                    {p.nombre}
                    {p.ambito && <span className="secundario" style={{ fontWeight: 400, fontSize: '0.9rem' }}>· solo en {p.ambito}</span>}
                  </strong>
                  <span style={{ color: e.color, fontWeight: pendiente ? 400 : 700, fontStyle: pendiente ? 'italic' : 'normal' }}>{e.texto}</span>
                </div>
                {postura && postura.postura !== null && <Cita postura={postura} partido={p} />}
              </div>
            )
          })}
        </section>
      ))}

      {busqueda && frases.length === 0 && (
        <p>No hay ninguna frase con esa palabra. Prueba con otra o elige un tema.</p>
      )}
    </div>
  )
}
