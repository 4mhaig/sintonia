const QUE_ES = [
  { es: true, titulo: 'Es una ayuda para decidir.', texto: 'Compara lo que tú piensas con lo que dicen los programas de los partidos.' },
  { es: true, titulo: 'Se basa en los programas.', texto: 'Solo usamos lo que cada partido ha publicado en su programa para estas elecciones. Los partidos no siempre cumplen lo que prometen, pero así sabes qué te han propuesto y podrás pedirles cuentas.' },
  { es: true, titulo: 'Es privada.', texto: 'Sin registro y sin guardar tus respuestas: todo se calcula en tu móvil u ordenador.' },
  { es: false, titulo: 'No es una encuesta.', texto: 'No te preguntamos a quién vas a votar, no contamos votos y no hacemos predicciones.' },
  { es: false, titulo: 'No es una recomendación.', texto: 'Te enseña parecidos y diferencias. La decisión es siempre tuya.' },
]

function Lista() {
  return (
    <ul>
      {QUE_ES.map((x) => (
        <li key={x.titulo}>
          <span className={`que-es-icono ${x.es ? 'si' : 'no'}`} aria-hidden="true">{x.es ? '✓' : '✕'}</span>
          <span><strong>{x.titulo}</strong> {x.texto}</span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Pie común. Solo la portada explica qué es y qué no es Sintonía;
 * en el resto de páginas queda únicamente el enlace a «Cómo funciona».
 */
export function Pie({ completo }: { completo: boolean }) {
  if (!completo) {
    return (
      <footer className="pie">
        <a href="#/metodologia" style={{ fontWeight: 700 }}>Cómo funciona <span aria-hidden="true">→</span></a>
      </footer>
    )
  }
  return (
    <footer className="pie que-es" aria-labelledby="que-es">
      <h2 id="que-es" className="mono secundario">Qué es Sintonía y qué no</h2>
      <Lista />
      <p style={{ margin: '1.25rem 0 0' }}>
        <a href="#/metodologia" style={{ fontWeight: 700 }}>Cómo funciona <span aria-hidden="true">→</span></a>
      </p>
    </footer>
  )
}
