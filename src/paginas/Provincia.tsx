import { useMemo, useState } from 'react'
import { repartir, votosParaOtroEscano } from '../logica/dhondt'
import { PROVINCIAS, RESULTADOS, RESULTADOS_FICTICIOS, UMBRAL, simuladorEn, simuladorPorId } from '../datos'
import { Hemiciclo } from '../componentes/Hemiciclo'
import { SelectorProvincia } from '../componentes/SelectorProvincia'

const n = (x: number) => x.toLocaleString('es-ES')
const pct = (x: number) => (x * 100).toLocaleString('es-ES', { maximumFractionDigits: 1 })

export function Provincia({ provincia: provinciaId, alElegirProvincia }: { provincia: string; alElegirProvincia: (id: string) => void }) {
  const [partidoId, setPartidoId] = useState('')

  const provincia = PROVINCIAS.find((p) => p.id === provinciaId)
  const datos = provincia ? RESULTADOS[provincia.id] : undefined
  const papeleta = useMemo(() => simuladorEn(provinciaId), [provinciaId])
  const reparto = useMemo(() => (provincia && datos ? repartir(datos, provincia.escanos, UMBRAL) : null), [provincia, datos])

  // Porcentaje de votos con el que un partido se asegura al menos un escaño:
  // con D'Hondt, más de 1/(escaños + 1) de los votos; y nunca menos del 3 % legal.
  const asegura = (escanos: number) => Math.max(UMBRAL, 1 / (escanos + 1))
  const ordenadas = [...PROVINCIAS].sort((x, y) => y.escanos - x.escanos)
  const comparar = provincia
    ? [ordenadas.find((x) => x.id !== provincia.id)!, [...ordenadas].reverse().find((x) => x.id !== provincia.id && x.escanos > 1)!]
    : []

  return (
    <div className="pila">
      <h1>¿Cuánto pesa tu voto en tu provincia?</h1>
      <p className="texto">
        En las elecciones al Congreso no hay una sola lista para toda España: cada provincia elige a sus propios diputados. Por eso, según dónde votes, un partido necesita más o menos votos para conseguir un escaño.
      </p>

      <SelectorProvincia valor={provinciaId} alCambiar={(id) => { alElegirProvincia(id); setPartidoId('') }} conUbicacion />

      {provincia && (
        <section className="tarjeta pila" aria-live="polite">
          <div>
            <span className="mono secundario">{provincia.nombre} elige</span>
            <h2 style={{ fontSize: '2rem', margin: 0 }}>{provincia.escanos} {provincia.escanos === 1 ? 'diputado' : 'diputados'}</h2>
            <span className="secundario">de los 350 del Congreso</span>
          </div>
          <p style={{ margin: 0 }}>
            Un partido que saque <strong>más del {pct(asegura(provincia.escanos))} % de los votos</strong> en {provincia.nombre} tiene asegurado al menos un diputado. Con menos, puede conseguirlo o no, según cómo se repartan los votos el resto de partidos.
          </p>
          <p className="secundario" style={{ margin: 0 }}>
            Para comparar: en {comparar[0].nombre} ({comparar[0].escanos} diputados) basta con más del {pct(asegura(comparar[0].escanos))} %, y en {comparar[1].nombre} ({comparar[1].escanos} diputados) hace falta más del {pct(asegura(comparar[1].escanos))} %.
          </p>
          <p style={{ margin: 0 }}>
            {provincia.escanos >= 10
              ? 'Como aquí se eligen bastantes diputados, también los partidos medianos y pequeños tienen opciones de sacar escaño.'
              : provincia.escanos <= 2
                ? 'Como aquí se eligen muy pocos diputados, en la práctica solo los partidos que sacan muchos votos consiguen escaño.'
                : 'Como aquí se eligen pocos diputados, a los partidos pequeños les cuesta mucho sacar escaño.'}
            {' '}<strong>Tu voto nunca pasa a otro partido:</strong> si el tuyo no saca escaño, tu voto no se suma a ningún otro.
          </p>
        </section>
      )}

      <section className="pila">
        <h2 style={{ fontSize: '1.3rem', margin: '0.5rem 0 0' }}>Cómo se reparten los escaños</h2>
        <ol className="texto" style={{ margin: 0, paddingLeft: '1.3rem', display: 'grid', gap: '0.4rem' }}>
          <li>Solo entran en el reparto los partidos con al menos el 3 % de los votos válidos de la provincia. Los votos en blanco cuentan como válidos; los nulos, no.</li>
          <li>Los votos de cada partido se dividen entre 1, 2, 3… hasta el número de diputados de la provincia.</li>
          <li>Los diputados van a los resultados más altos de esas divisiones. Es lo que se llama ley D'Hondt.</li>
        </ol>
      </section>

      {provincia && reparto && datos && (
        <details className="tarjeta">
          <summary style={{ fontWeight: 700, cursor: 'pointer', minHeight: 44 }}>Pruébalo con un ejemplo inventado</summary>
          <div className="pila" style={{ marginTop: '0.75rem' }}>
            {RESULTADOS_FICTICIOS && <p className="aviso" style={{ margin: 0 }}>Partidos y votos inventados para explicar el reparto. No representan a ningún partido real ni son una predicción.</p>}
            <Hemiciclo key={provincia.id} escanos={reparto.escanos} partidos={papeleta} />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} className="pila">
              {[...papeleta].sort((a, b) => datos.votos[b.id] - datos.votos[a.id]).map((p) => (
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

            <label className="pila" style={{ display: 'block' }}>
              <span style={{ fontWeight: 700 }}>Elige uno de estos partidos inventados para ver qué pasaría con un voto a él</span>
              <select value={partidoId} onChange={(e) => setPartidoId(e.target.value)}>
                <option value="">Elige un partido de ejemplo</option>
                {papeleta.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </label>

            {partidoId && <QuePasaConMiVoto partidoId={partidoId} provinciaId={provincia.id} />}
          </div>
        </details>
      )}
    </div>
  )
}

function QuePasaConMiVoto({ partidoId, provinciaId }: { partidoId: string; provinciaId: string }) {
  const provincia = PROVINCIAS.find((p) => p.id === provinciaId)!
  const datos = RESULTADOS[provinciaId]
  const reparto = repartir(datos, provincia.escanos, UMBRAL)
  const partido = simuladorPorId(partidoId)!
  const votos = datos.votos[partidoId]
  const escanos = reparto.escanos[partidoId]
  const faltan = votosParaOtroEscano(datos, provincia.escanos, partidoId, UMBRAL)
  const ultimo = reparto.ultimoEscano ? simuladorPorId(reparto.ultimoEscano)?.nombre : null
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
