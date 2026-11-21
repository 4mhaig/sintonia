import { Glitch } from '../componentes/Glitch'

const diasHasta = (fecha: string) =>
  Math.max(0, Math.ceil((new Date(`${fecha}T00:00:00`).getTime() - Date.now()) / 86_400_000))

export function Inicio() {
  const dias = diasHasta('2026-11-29')

  return (
    <div className="pila">
      <Glitch />

      <section className="texto">
        <p className="cuenta-atras">
          {dias > 0 ? (
            <>
              {dias === 1 ? 'Queda ' : 'Quedan '}
              <strong className="cuenta-atras-numero">{dias} {dias === 1 ? 'día' : 'días'}</strong> para las elecciones del{' '}
              <strong>domingo 29 de noviembre de 2026</strong>
            </>
          ) : (
            <>Hoy se vota: <strong>domingo 29 de noviembre de 2026</strong></>
          )}
        </p>
        <h1>¿Con quién sintonizas?</h1>
        <p style={{ fontSize: '1.2rem' }}>
          Responde unas frases sobre lo que te importa y te enseñamos qué programa electoral se parece más a lo que piensas, con sus citas para que lo compruebes.
        </p>
      </section>

      <section className="rejilla" aria-label="Por dónde empezar">
        <a href="#/test" className="tarjeta tarjeta-enlace destacada">
          <h2>Hacer el test</h2>
          <p className="secundario">Di si estás de acuerdo o no con 20 frases sobre temas como la vivienda o las pensiones, y mira con qué partidos coincides más.</p>
          <span className="chip" style={{ background: 'var(--acento-suave)', color: 'var(--acento)', alignSelf: 'flex-start', marginBottom: '1rem' }}>Unos 5 minutos</span>
          <span className="tarjeta-accion">Empezar el test <span aria-hidden="true">→</span></span>
        </a>
        <a href="#/temas" className="tarjeta tarjeta-enlace">
          <h2>Ver por temas</h2>
          <p className="secundario">Qué propone cada partido sobre vivienda, sanidad, pensiones…</p>
          <span className="tarjeta-accion">Ver temas <span aria-hidden="true">→</span></span>
        </a>
        <a href="#/provincia" className="tarjeta tarjeta-enlace">
          <h2>Mi provincia</h2>
          <p className="secundario">Cada provincia elige un número distinto de diputados. Mira cuántos se eligen en la tuya y cómo se reparten entre los partidos según los votos, con un ejemplo inventado.</p>
          <span className="tarjeta-accion">Ver cómo se reparten <span aria-hidden="true">→</span></span>
        </a>
      </section>
    </div>
  )
}
