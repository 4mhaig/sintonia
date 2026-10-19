import { useState } from 'react'
import type { Postura, Respuestas } from '../logica/tipos'
import { AFIRMACIONES, TEMAS, temaPorId } from '../datos'
import { Onda } from '../componentes/Onda'

interface Props {
  alTerminar: (respuestas: Respuestas, importantes: string[]) => void
}

const OPCIONES: { valor: Postura; texto: string }[] = [
  { valor: 1, texto: 'De acuerdo' },
  { valor: 0, texto: 'Neutral' },
  { valor: -1, texto: 'En desacuerdo' },
]
const MAX_IMPORTANTES = 3

export function Test({ alTerminar }: Props) {
  const [paso, setPaso] = useState(0)
  const [respuestas, setRespuestas] = useState<Respuestas>({})
  const [importantes, setImportantes] = useState<string[]>([])
  const [verExplicacion, setVerExplicacion] = useState(false)

  const total = AFIRMACIONES.length
  const enTemas = paso >= total
  const senal = Math.round((Math.min(paso, total) / total) * 100)
  // El ruido nunca llega a cero dentro del test: la claridad total es el resultado
  const ruido = 1 - (Math.min(paso, total) / total) * 0.8

  const responder = (valor: Postura) => {
    const a = AFIRMACIONES[paso]
    setRespuestas((r) => ({ ...r, [a.id]: valor }))
    setVerExplicacion(false)
    setPaso((p) => p + 1)
  }

  const alternarTema = (id: string) =>
    setImportantes((imp) =>
      imp.includes(id) ? imp.filter((t) => t !== id) : imp.length < MAX_IMPORTANTES ? [...imp, id] : imp,
    )

  return (
    <div className="pila">
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <span className="mono secundario">señal {senal}% · {senal < 50 ? 'mucho ruido' : 'sintonizando'}</span>
          <span className="mono secundario">{enTemas ? 'último paso' : `${paso + 1} de ${total}`}</span>
        </div>
        <div className="tarjeta" style={{ padding: 0, marginTop: 8, overflow: 'hidden' }}>
          <Onda ruido={ruido} />
        </div>
      </div>

      {!enTemas ? (
        <section aria-live="polite" className="pila">
          <span className="chip">{temaPorId(AFIRMACIONES[paso].tema)?.nombre}</span>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2rem)' }}>{AFIRMACIONES[paso].texto}</h1>

          <div>
            <button className="boton fantasma" style={{ padding: 0, minHeight: 44 }} aria-expanded={verExplicacion} onClick={() => setVerExplicacion((v) => !v)}>
              {verExplicacion ? 'Ocultar explicación' : '¿Qué significa esto?'}
            </button>
            {verExplicacion && <p className="secundario texto">{AFIRMACIONES[paso].explicacion}</p>}
          </div>

          <div className="rejilla">
            {OPCIONES.map((o) => (
              <button key={o.texto} className="boton" onClick={() => responder(o.valor)}>{o.texto}</button>
            ))}
          </div>
          <div className="fila" style={{ justifyContent: 'space-between' }}>
            <button className="boton fantasma" disabled={paso === 0} onClick={() => setPaso((p) => p - 1)} style={{ visibility: paso === 0 ? 'hidden' : 'visible' }}>
              ← Anterior
            </button>
            <button className="boton fantasma" onClick={() => responder(null)}>Saltar esta frase</button>
          </div>
        </section>
      ) : (
        <section className="pila">
          <h1 style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2rem)' }}>¿Qué temas te importan más?</h1>
          <p className="secundario">Elige hasta {MAX_IMPORTANTES}. Contarán el doble en tu resultado. Puedes no elegir ninguno.</p>
          <div className="rejilla">
            {TEMAS.map((t) => (
              <button key={t.id} className="boton" aria-pressed={importantes.includes(t.id)} onClick={() => alternarTema(t.id)}>
                {importantes.includes(t.id) ? '✓ ' : ''}{t.nombre}
              </button>
            ))}
          </div>
          <div className="fila" style={{ justifyContent: 'space-between' }}>
            <button className="boton fantasma" onClick={() => setPaso(total - 1)}>← Anterior</button>
            <button className="boton principal" onClick={() => alTerminar(respuestas, importantes)}>Ver mi resultado</button>
          </div>
        </section>
      )}
    </div>
  )
}
