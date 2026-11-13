import { PARTIDOS, tienePrograma } from '../datos'

const fecha = (iso?: string | null) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : '—'

/** Tabla pública: qué programa usamos de cada partido y cuándo lo añadimos */
function EstadoProgramas() {
  const reales = [...PARTIDOS].filter((p) => !p.ficticio).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  if (!reales.length) {
    return <p>Los partidos reales se añadirán el 13 de noviembre, al empezar la campaña, con los programas que se hayan publicado para entonces. Los demás se irán añadiendo en un máximo de 48 horas desde que se publiquen.</p>
  }
  return (
    <ul className="lista-programas">
      {reales.map((p) => (
        <li key={p.id}>
          <strong>{p.nombre}</strong>
          {tienePrograma(p) && p.programa_url ? (
            <span>
              <a href={p.programa_url} target="_blank" rel="noopener noreferrer">{p.programa_titulo ?? 'Programa (PDF)'}</a>
              <span className="secundario"> · publicado el {fecha(p.programa_publicado)} · añadido el {fecha(p.programa_anadido)}</span>
            </span>
          ) : (
            <span className="secundario">Programa aún no publicado</span>
          )}
        </li>
      ))}
    </ul>
  )
}

export function Metodologia() {
  return (
    <article className="texto pila">
      <h1>Cómo funciona</h1>

      <h2>Para qué sirve</h2>
      <p>Sintonía es una ayuda para decidir tu voto si aún no lo tienes claro. No es una encuesta: no preguntamos a quién vas a votar, no contamos votos y no hacemos predicciones. Tampoco es una recomendación: te enseña qué programas se parecen más a lo que piensas y la decisión es tuya.</p>

      <h2>Las frases</h2>
      <p>Cada frase describe una medida concreta y pertenece a un tema. Para cada partido anotamos si su programa la defiende o la rechaza, siempre con la cita literal y la página. Si no dice nada, ponemos «No lo menciona». Si habla del tema pero no de ese punto concreto, ponemos «No lo menciona tal cual» y te enseñamos lo que sí dice; en ese caso no cuenta para tu resultado.</p>
      <p>Las frases las escribimos nosotros para poder comparar a todos los partidos con la misma vara, y los programas no siempre usan esas palabras. Cuando un programa no habla exactamente de lo que dice la frase pero sí de algo muy cercano, lo marcamos como «≈ Aproximación» junto a la cita, con el mismo criterio para todos. Si no dice nada sobre ese punto concreto, ponemos «No lo menciona»: no deducimos posturas por la ideología del partido.</p>

      <h2>Tu resultado</h2>
      <p>Por cada frase que respondes, sumas 2 puntos con un partido si pensáis lo mismo, 1 si uno de los dos es neutral y 0 si pensáis lo contrario. Los temas que marcas como importantes cuentan el doble. Las frases que te saltas, o de las que un partido no habla, no cuentan.</p>
      <p>Si nos dices dónde votas, te comparamos solo con los partidos que se presentan en tu provincia, porque son los que vas a encontrar en tu papeleta. Puedes ver también el resto, o no decirnos la provincia.</p>

      <h2>Qué partidos aparecen</h2>
      <p>Los que tienen hoy al menos un diputado en el Congreso o un eurodiputado, en las provincias donde presentan candidatura según el BOE. Es un criterio fijado de antemano, igual para todos.</p>
      <p>Si un partido aún no ha publicado su programa, aparece como «Programa aún no publicado» y no se compara con tus respuestas: no le atribuimos posturas que no ha escrito. Cuando lo publica, lo añadimos en un máximo de 48 horas con el mismo método.</p>

      <h2>Programas que usamos</h2>
      <EstadoProgramas />

      <h2>Neutralidad</h2>
      <p>Los partidos aparecen en orden aleatorio en cada visita. En la portada, todos salen el mismo tiempo. El código y los datos son públicos para que cualquiera pueda revisarlos.</p>

      <h2>Privacidad</h2>
      <p>Tus respuestas y tu provincia no salen de tu dispositivo: no las guardamos ni las enviamos a ningún sitio. Si cierras la página, se borran.</p>
      <p>Si pulsas «Usar mi ubicación», el navegador te pide permiso y la provincia se calcula en tu dispositivo con un mapa de provincias del Instituto Geográfico Nacional. Tus coordenadas no se envían a ningún sitio. Es solo una sugerencia: votas donde estás censado, y puedes cambiar la provincia siempre.</p>

      <h2>Encuestas</h2>
      <p>Entre el 24 y el 28 de noviembre la ley prohíbe publicar sondeos. Sintonía no hace ni publica encuestas, y el simulador por provincia no usa sondeos.</p>

      <p><a href="https://github.com/4mhaig/sintonia/blob/main/METODOLOGIA.md">Metodología completa en GitHub</a></p>
    </article>
  )
}
