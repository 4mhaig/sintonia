/** Qué vas a hacer en el test y cómo se calcula el resultado. Se abre desde la pantalla de inicio del test. */
export function ExplicacionTest({ alCerrar }: { alCerrar: () => void }) {
  return (
    <div className="texto pila explicacion-test">
      <h3>Qué vas a hacer</h3>
      <ol>
        <li><strong>Lees 20 frases</strong> sobre vivienda, sanidad, empleo, impuestos, pensiones, educación, medio ambiente, inmigración, territorio e igualdad.</li>
        <li><strong>Dices si estás de acuerdo, neutral o en desacuerdo</strong> con cada una. Si no lo tienes claro, puedes saltarla.</li>
        <li><strong>Marcas hasta 3 temas</strong> que te importen más. Cuentan el doble.</li>
      </ol>
      <p>Tardarás unos 5 minutos.</p>

      <h3>Qué ves al final</h3>
      <p>Un porcentaje de coincidencia con cada partido, de más a menos. Para cada uno puedes ver en qué frases pensáis lo mismo y en cuáles lo contrario, con la cita literal de su programa y el enlace a la página para que lo compruebes.</p>
      <p>Es muy difícil coincidir al 100% con un partido: lo normal es estar de acuerdo en unas cosas y no en otras.</p>

      <h3>De dónde salen las posturas</h3>
      <p>Solo de los programas electorales que los partidos han publicado para estas elecciones. Las frases las hemos escrito nosotros para comparar a todos con la misma vara, así que los programas no siempre usan esas palabras. Cuando un programa no lo dice exactamente pero sí algo muy cercano, lo verás marcado como «≈ Aproximación». Si un partido no habla de una frase, esa frase no cuenta con él.</p>

      <h3>Lo que no es</h3>
      <p>No es una encuesta ni una recomendación de voto: no te preguntamos a quién vas a votar y la decisión es tuya. Tus respuestas no se guardan ni se envían a ningún sitio.</p>

      <p style={{ margin: 0 }}>
        <a href="#/metodologia" onClick={alCerrar} style={{ fontWeight: 700 }}>Más detalles en «Cómo funciona» <span aria-hidden="true">→</span></a>
      </p>
    </div>
  )
}
