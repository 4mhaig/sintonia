import { Glitch } from '../componentes/Glitch'

const diasHasta = (fecha: string) =>
  Math.max(0, Math.ceil((new Date(`${fecha}T00:00:00`).getTime() - Date.now()) / 86_400_000))

const QUE_ES = [
  { es: true, titulo: 'Es una ayuda para decidir.', texto: 'Compara lo que tú piensas con lo que dicen los programas de los partidos.' },
  { es: false, titulo: 'No es una encuesta.', texto: 'No te preguntamos a quién vas a votar, no contamos votos y no hacemos predicciones.' },
  { es: false, titulo: 'No es una recomendación.', texto: 'Te enseña parecidos y diferencias. La decisión es siempre tuya.' },
]

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
              <strong>domingo 29 de noviembre</strong>
            </>
          ) : (
            <>Hoy se vota: <strong>domingo 29 de noviembre</strong></>
          )}
        </p>
        <h1>¿Con quién sintonizas?</h1>
        <p style={{ fontSize: '1.2rem' }}>
          Responde unas frases sobre lo que te importa y te enseñamos qué programa electoral se parece más a lo que piensas, con sus citas para que lo compruebes.
        </p>
      </section>

      {/* Bloque informativo: sin caja ni borde, para que no parezca clicable */}
      <section className="que-es" aria-labelledby="que-es">
        <h2 id="que-es" className="mono secundario">Qué es Sintonía y qué no</h2>
        <ul>
          {QUE_ES.map((x) => (
            <li key={x.titulo}>
              <span className={`que-es-icono ${x.es ? 'si' : 'no'}`} aria-hidden="true">{x.es ? '✓' : '✕'}</span>
              <span><strong>{x.titulo}</strong> {x.texto}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rejilla" aria-label="Por dónde empezar">
        <a href="#/test" className="tarjeta tarjeta-enlace destacada">
          <span className="chip" style={{ background: 'var(--acento-suave)', color: 'var(--acento)', alignSelf: 'flex-start' }}>Unos 5 minutos</span>
          <h2 style={{ marginTop: '0.75rem' }}>Hacer el test</h2>
          <p className="secundario">Si no sabes por dónde empezar. 20 frases, una a una.</p>
          <span className="boton principal" style={{ width: '100%' }}>Empezar</span>
        </a>
        <a href="#/temas" className="tarjeta tarjeta-enlace">
          <h2>Ver por temas</h2>
          <p className="secundario">Qué propone cada partido sobre vivienda, sanidad, pensiones…</p>
          <span className="tarjeta-accion">Ver temas <span aria-hidden="true">→</span></span>
        </a>
        <a href="#/provincia" className="tarjeta tarjeta-enlace">
          <h2>Mi provincia</h2>
          <p className="secundario">Cuántos diputados se eligen donde votas y qué pasa con tu voto.</p>
          <span className="tarjeta-accion">Elegir provincia <span aria-hidden="true">→</span></span>
        </a>
      </section>

      <p className="secundario texto">
        Sin registro. No guardamos tus respuestas: todo se calcula en tu móvil u ordenador.
      </p>
    </div>
  )
}
