# Metodología

Cómo convierte Sintonía los programas electorales en un resultado. Esta página es pública a propósito: si no se puede explicar, no es fiable.

## 1. Las frases del test

- Cada frase pertenece a un tema y describe **una medida concreta**, no una ideología ("Subir el salario mínimo", no "¿Eres de izquierdas?").
- Se redactan en lenguaje llano, sin términos que delaten a un partido.
- Cada frase lleva una explicación corta para quien no conozca el término.
- Una frase entra en el test solo si **al menos dos partidos** tienen postura clara y distinta sobre ella; si todos opinan igual, no sirve para diferenciar.

## 2. La postura de cada partido

Para cada frase y cada partido se anota:

| Valor | Significa |
|---|---|
| `1` | El programa la defiende |
| `0` | Postura intermedia o ambigua |
| `-1` | El programa se opone |
| `null` | El programa no dice nada |

Cada valor **tiene que llevar la cita literal y la página** del programa. Sin cita, el valor es `null`.

Proceso de revisión: una persona codifica, otra lo revisa sin ver la primera codificación, y las discrepancias se discuten con el texto delante. Si es posible, se envía a cada partido su ficha para que la revise (como hace el Wahl-O-Mat alemán).

## 3. Cálculo de la afinidad

Para cada frase respondida:

- La coincidencia es `2 − |tu respuesta − postura del partido|` → 2 puntos si coincidís, 1 si uno es neutral, 0 si sois opuestos.
- Si marcas un tema como importante, sus frases cuentan **doble**.
- Las frases que te saltas, o en las que el partido no dice nada (`null`), no cuentan para ese partido.

Afinidad = puntos obtenidos ÷ puntos posibles × 100.

Si un partido no se pronuncia en más de la mitad de las frases que has respondido, se avisa de que su resultado es poco fiable.

## 4. "¿Y mi voto?": el simulador por provincia

- En el Congreso cada provincia reparte sus escaños por separado con la **ley D'Hondt** (LOREG, art. 163).
- Solo entran en el reparto las candidaturas con al menos el **3 % de los votos válidos** de esa provincia. Los votos en blanco cuentan como válidos (suben ese 3 %); los nulos no.
- **El voto no se transfiere a otro partido.** Si tu partido no consigue escaño, tu voto no va a nadie, pero tampoco desaparece del todo: al contar en el total, ayuda a fijar dónde cae el último escaño, que normalmente se lleva uno de los partidos grandes de esa provincia.
- El simulador muestra cuántos votos le faltarían a cada partido para conseguir un escaño más y quién se queda ese escaño si no.

## 5. Fuentes

- Escaños por provincia: Real Decreto 806/2026, de 5 de octubre.
- Resultados anteriores: Ministerio del Interior, infoelectoral.interior.gob.es.
- Programas: los PDF oficiales que publica cada partido, guardados en `programas-pdf/`.
