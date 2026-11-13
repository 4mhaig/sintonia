import { useState } from 'react'
import type { Postura, Respuestas } from '../logica/tipos'
import { AFIRMACIONES, TEMAS, partidosEn, temaPorId, tienePrograma } from '../datos'
import { Onda } from '../componentes/Onda'
import { SelectorProvincia } from '../componentes/SelectorProvincia'

interface Props {
  provincia: string
  alElegirProvincia: (id: string) => void
  alTerminar: (respuestas: Respuestas, importantes: string[]) => void
}

const OPCIONES: { valor: Postura; texto: string }[] = [
  { valor: 1, texto: 'De acuerdo' },
  { valor: 0, texto: 'Neutral' },
  { valor: -1, texto: 'En desacuerdo' },
]
const MAX_IMPORTANTES = 3

export function Test({ provincia, alElegirProvincia, alTerminar }: Props) {
  // Paso -1: "¿Dónde votas?" antes de la primera frase
  const [paso, setPaso] = useState(-1)
  const [eleccion, setEleccion] = useState(provincia)
  const [respuestas, setRespuestas] = useState<Respuestas>({})
  const [importantes, setImportantes] = useState<string[]>([])
  const [verExplicacion, setVerExplicacion] = useState(false)

  const total = AFIRMACIONES.length
  const enTemas = paso >= total
  const antes = paso < 0
  const avance = Math.max(0, Math.min(paso, total))
  const senal = Math.round((avance / total) * 100)
  // El ruido nunca llega a cero dentro del test: la claridad total es el resultado
  const ruido = 1 - (avance / total) * 0.8

  const empezar = (id: string) => {
    alElegirProvincia(id)
    setPaso(0)
  }
  const enPapeleta = eleccion ? partidosEn(eleccion).filter(tienePrograma).length : 0
  const sinProgramaAun = eleccion ? partidosEn(eleccion).filter((p) => !tienePrograma(p)).length : 0

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
          <span className="mono secundario">{antes ? `0 de ${total}` : enTemas ? 'último paso' : `${paso + 1} de ${total}`}</span>
        </div>
        <div className="tarjeta" style={{ padding: 0, marginTop: 8, overflow: 'hidden' }}>
          <Onda ruido={ruido} />
        </div>
      </div>

      {antes ? (
        <section className="pila">
          <h1 style={{ fontSize: 'clamp(1.5rem, 4.5vw, 2rem)' }}>Antes de empezar: ¿dónde votas?</h1>
          <p className="texto">
            En cada provincia la papeleta es distinta: hay partidos que solo se presentan en algunas. Así te comparamos con los que de verdad puedes votar.
          </p>
          <SelectorProvincia valor={eleccion} alCambiar={setEleccion} etiqueta="Provincia donde votas" conUbicacion />
          {eleccion && (
            <p className="secundario" aria-live="polite" style={{ margin: 0 }}>
              En tu provincia te compararemos con {enPapeleta} {enPapeleta === 1 ? 'partido' : 'partidos'}.
              {sinProgramaAun === 1 && ' Otro aún no ha publicado su programa.'}
              {sinProgramaAun > 1 && ` Otros ${sinProgramaAun} aún no han publicado su programa.`}
            </p>
          )}
          <div className="acciones-inicio">
            <button className="boton principal" disabled={!eleccion} onClick={() => empezar(eleccion)}>
              Empezar el test
            </button>
            <button className="boton fantasma" onClick={() => empezar('')}>
              Todavía no lo sé: ver todos los partidos
            </button>
          </div>
        </section>
      ) : !enTemas ? (
        <section aria-live="polite" className="pila">
          {paso === 0 && (
            <p className="nota-frases">
              Las frases las hemos escrito nosotros para poder comparar. Los programas no siempre lo dicen con estas palabras, pero cada partido se acerca más o menos a ellas. En tu resultado verás la cita de cada uno para que lo compruebes.
            </p>
          )}
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
            <button className="boton fantasma" onClick={() => setPaso((p) => p - 1)}>
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
