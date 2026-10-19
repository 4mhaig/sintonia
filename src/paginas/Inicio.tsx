import { Glitch } from '../componentes/Glitch'

const diasHasta = (fecha: string) =>
  Math.max(0, Math.ceil((new Date(`${fecha}T00:00:00`).getTime() - Date.now()) / 86_400_000))

export function Inicio() {
  const dias = diasHasta('2026-11-29')

  return (
    <div className="pila">
      <Glitch />

      <section className="texto">
        <h1>¿Con quién sintonizas?</h1>
        <p style={{ fontSize: '1.2rem' }}>
          Responde unas frases sobre lo que te importa y te enseñamos qué partido piensa más parecido a ti. Con las citas de sus programas, para que lo compruebes.
        </p>
        <p className="mono secundario">
          {dias > 0 ? `Quedan ${dias} días para las elecciones del 29 de noviembre` : 'Hoy se vota'}
        </p>
      </section>

      <section className="rejilla" aria-label="Por dónde empezar">
        <a href="#/test" className="tarjeta" style={{ textDecoration: 'none', color: 'inherit', borderColor: 'var(--acento)', borderWidth: 2 }}>
          <span className="chip" style={{ background: 'var(--acento-suave)', color: 'var(--acento)' }}>Unos 5 minutos</span>
          <h2 style={{ marginTop: '0.75rem' }}>Hacer el test</h2>
          <p className="secundario">Si no sabes por dónde empezar. 20 frases, una a una.</p>
          <span className="boton principal" style={{ width: '100%' }}>Empezar</span>
        </a>
        <a href="#/temas" className="tarjeta" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2>Ver por temas</h2>
          <p className="secundario">Qué propone cada partido sobre vivienda, sanidad, pensiones…</p>
        </a>
        <a href="#/provincia" className="tarjeta" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h2>Mi provincia</h2>
          <p className="secundario">Cuántos diputados se eligen donde votas y qué pasa con tu voto.</p>
        </a>
      </section>

      <p className="secundario texto">
        Sin registro. No guardamos tus respuestas: todo se calcula en tu móvil u ordenador.
      </p>
    </div>
  )
}
