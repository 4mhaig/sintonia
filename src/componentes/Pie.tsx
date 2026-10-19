const QUE_ES = [
  { es: true, titulo: 'Es una ayuda para decidir.', texto: 'Compara lo que tú piensas con lo que dicen los programas de los partidos.' },
  { es: true, titulo: 'Es privada.', texto: 'Sin registro y sin guardar tus respuestas: todo se calcula en tu móvil u ordenador.' },
  { es: false, titulo: 'No es una encuesta.', texto: 'No te preguntamos a quién vas a votar, no contamos votos y no hacemos predicciones.' },
  { es: false, titulo: 'No es una recomendación.', texto: 'Te enseña parecidos y diferencias. La decisión es siempre tuya.' },
]

/** Pie común a todas las páginas: el único sitio donde se explica qué es y qué no es Sintonía. */
export function Pie() {
  return (
    <footer className="pie que-es" aria-labelledby="que-es">
      <h2 id="que-es" className="mono secundario">Qué es Sintonía y qué no</h2>
      <ul>
        {QUE_ES.map((x) => (
          <li key={x.titulo}>
            <span className={`que-es-icono ${x.es ? 'si' : 'no'}`} aria-hidden="true">{x.es ? '✓' : '✕'}</span>
            <span><strong>{x.titulo}</strong> {x.texto}</span>
          </li>
        ))}
      </ul>
      <p style={{ margin: '1.25rem 0 0' }}>
        <a href="#/metodologia" style={{ fontWeight: 700 }}>Cómo funciona <span aria-hidden="true">→</span></a>
      </p>
    </footer>
  )
}
