# Cómo añadir o actualizar datos

## Añadir un partido real

1. Copia la ficha del partido en `partidos/` (ya existe una por candidatura, con `programa_publicado: null` si aún no tiene programa).
2. Rellena `nombre`, `siglas`, `color` (el de su identidad), `programa_url` y `programa_publicado` (fecha).
3. Cambia `"ficticio": true` por `"ficticio": false`.
4. En `posturas`, para cada frase pon `postura` (1, 0, -1 o null), la `cita` literal y la `pagina`.
5. Guarda el PDF del programa en `programas-pdf/`.
6. Si el partido **no se presenta en toda España**, añade `"ambito"` (por ejemplo `"Andalucía"`) y `"provincias"` con los identificadores de `provincias/escanos.json` donde se presenta. Compruébalo con las candidaturas proclamadas en el BOE. Sin `provincias`, se entiende que se presenta en todas.

Rellena `programa_url`, `programa_titulo`, `programa_publicado` (fecha del partido) y `programa_anadido` (fecha en que lo añadimos). En `temas_programa` pon, para cada tema, los tramos de páginas del PDF que lo tratan: `{"tipo": "apartado" | "menciones", "titulo", "desde", "hasta"}` (`null` si no lo trata). Las posturas aproximadas llevan `"aproximada": true`; si el programa habla del tema pero no del punto concreto, `postura: null` con la cita.

## Resultados por provincia

El simulador de escaños usa sus propios partidos inventados (`simulador/partidos-ejemplo.json`) y votos inventados (`simulador/resultados-ejemplo.json`), separados de los partidos reales. Para usar resultados reales de 2023 habría que crear `provincias/resultados-2023.json` con este formato:

```json
{
  "ficticio": false,
  "provincias": {
    "madrid": { "blancos": 12345, "votos": { "nombre-partido": 100000 } }
  }
}
```

Los identificadores de partido tienen que coincidir con los nombres de archivo de `partidos/`.
