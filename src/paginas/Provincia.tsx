import { useMemo, useState } from 'react'
import { repartir, votosParaOtroEscano } from '../logica/dhondt'
import { PARTIDOS, PROVINCIAS, RESULTADOS, RESULTADOS_FICTICIOS, UMBRAL, partidoPorId } from '../datos'
import { Hemiciclo } from '../componentes/Hemiciclo'

const n = (x: number) => x.toLocaleString('es-ES')
const pct = (x: number) => (x * 100).toLocaleString('es-ES', { maximumFractionDigits: 1 })

export function Provincia() {
  const [provinciaId, setProvinciaId] = useState('')
  const [partidoId, setPartidoId] = useState('')

  const provincia = PROVINCIAS.find((p) => p.id === provinciaId)
  const datos = provincia ? RESULTADOS[provincia.id] : undefined
  const reparto = useMemo(() => (provincia && datos ? repartir(datos, provincia.escanos, UMBRAL) : null), [provincia, datos])

  return (
    <div className="pila">
      <h1>Mi provincia</h1>
      <p className="texto">
        Al Congreso no se vota en toda España a la vez: cada provincia elige sus propios diputados. Por eso tu voto no pesa igual en Madrid que en Soria.
      </p>

      <label className="pila" style={{ display: 'block' }}>
        <span style={{ fontWeight: 700 }}>¿Dónde votas?</span>
        <select value={provinciaId} onChange={(e) => { setProvinciaId(e.target.value); setPartidoId('') }}>
          <option value="">Elige tu provincia</option>
          {PROVINCIAS.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
      </label>

      {provincia && reparto && datos && (
        <>
          <section className="tarjeta pila">
            <div>
              <span className="mono secundario">{provincia.nombre} elige</span>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>{provincia.escanos} {provincia.escanos === 1 ? 'diputado' : 'diputados'}</h2>
            </div>
            <Hemiciclo key={provincia.id} escanos={reparto.escanos} partidos={PARTIDOS} />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} className="pila">
              {[...PARTIDOS].sort((a, b) => datos.votos[b.id] - datos.votos[a.id]).map((p) => (
                <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                    <span aria-hidden="true" style={{ flexShrink: 0, width: 14, height: 14, borderRadius: 7, background: p.color }} />
                    <span>
                      {p.nombre}
                      <span className="secundario" style={{ display: 'block', fontSize: '0.85rem' }}>{pct(datos.votos[p.id] / reparto.validos)} % de los votos</span>
                    </span>
                  </span>
                  <strong style={{ whiteSpace: 'nowrap' }}>
                    {reparto.escanos[p.id]} {reparto.escanos[p.id] === 1 ? 'escaño' : 'escaños'}
                  </strong>
                </li>
              ))}
            </ul>
            {RESULTADOS_FICTICIOS && <p className="aviso" style={{ margin: 0 }}>Votos inventados para probar. Aquí irán los resultados reales de 2023.</p>}
          </section>

          <label className="pila" style={{ display: 'block' }}>
            <span style={{ fontWeight: 700 }}>¿A quién piensas votar?</span>
            <select value={partidoId} onChange={(e) => setPartidoId(e.target.value)}>
              <option value="">Elige un partido</option>
              {PARTIDOS.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </label>

          {partidoId && <QuePasaConMiVoto partidoId={partidoId} provinciaId={provincia.id} />}
        </>
      )}

      <details className="tarjeta">
        <summary style={{ fontWeight: 700, cursor: 'pointer', minHeight: 44 }}>¿Cómo se reparten los escaños? (ley D'Hondt)</summary>
        <div className="texto" style={{ marginTop: '0.75rem' }}>
          <p>1. Solo entran los partidos con al menos el 3 % de los votos válidos de la provincia. Los votos en blanco cuentan como válidos; los nulos, no.</p>
          <p>2. Los votos de cada partido se dividen entre 1, 2, 3… hasta el número de escaños.</p>
          <p>3. Los escaños van a los resultados más altos de esas divisiones.</p>
          <p style={{ margin: 0 }}>Por eso en las provincias que eligen pocos diputados es difícil que entren los partidos pequeños.</p>
        </div>
      </details>
    </div>
  )
}

function QuePasaConMiVoto({ partidoId, provinciaId }: { partidoId: string; provinciaId: string }) {
  const provincia = PROVINCIAS.find((p) => p.id === provinciaId)!
  const datos = RESULTADOS[provinciaId]
  const reparto = repartir(datos, provincia.escanos, UMBRAL)
  const partido = partidoPorId(partidoId)!
  const votos = datos.votos[partidoId]
  const escanos = reparto.escanos[partidoId]
  const faltan = votosParaOtroEscano(datos, provincia.escanos, partidoId, UMBRAL)
  const ultimo = reparto.ultimoEscano ? partidoPorId(reparto.ultimoEscano)?.nombre : null
  const fuera = reparto.fueraDelUmbral.includes(partidoId)

  return (
    <section className="tarjeta pila" aria-live="polite" style={{ borderColor: partido.color, borderWidth: 2 }}>
      {escanos > 0 ? (
        <>
          <h2>{partido.nombre} consigue {escanos} {escanos === 1 ? 'escaño' : 'escaños'} en {provincia.nombre}</h2>
          <p>Tu voto ayuda a elegir a sus diputados. Para conseguir uno más le harían falta unos <strong>{n(faltan)} votos</strong> más.</p>
        </>
      ) : fuera ? (
        <>
          <h2>{partido.nombre} no llega al 3 % en {provincia.nombre}</h2>
          <p>Para optar a escaño hacen falta al menos {n(reparto.minimo)} votos y tiene {n(votos)}.</p>
          <p><strong>Tu voto no pasa a otro partido.</strong> No elige a ningún diputado, pero sí cuenta para calcular ese 3 %.</p>
        </>
      ) : (
        <>
          <h2>{partido.nombre} se queda sin escaño en {provincia.nombre}</h2>
          <p>Supera el 3 %, pero no le llega para un diputado: le faltarían unos <strong>{n(faltan)} votos</strong>.</p>
          <p><strong>Tu voto no pasa a otro partido.</strong> El último escaño en juego se lo lleva {ultimo}.</p>
        </>
      )}
      <p className="secundario" style={{ margin: 0 }}>Cálculo suponiendo que el resto de partidos saca los mismos votos.</p>
    </section>
  )
}
