# Cómo añadir o actualizar datos

## Añadir un partido real

1. Copia uno de los ejemplos de `partidos/` (por ejemplo `alfa.json`) con el nombre del partido en minúsculas y sin tildes: `partidos/nombre-partido.json`.
2. Rellena `nombre`, `siglas`, `color` (el de su identidad), `programa_url` y `programa_publicado` (fecha).
3. Cambia `"ficticio": true` por `"ficticio": false`.
4. En `posturas`, para cada frase pon `postura` (1, 0, -1 o null), la `cita` literal y la `pagina`.
5. Guarda el PDF del programa en `programas-pdf/`.

Cuando haya algún partido real, borra los ficticios y pon `"datos_de_ejemplo": false` en `elecciones.json`.

## Resultados por provincia

`provincias/resultados-ejemplo.json` tiene votos inventados. Para los reales de 2023 crea `provincias/resultados-2023.json` con el mismo formato:

```json
{
  "ficticio": false,
  "provincias": {
    "madrid": { "blancos": 12345, "votos": { "nombre-partido": 100000 } }
  }
}
```

Los identificadores de partido tienen que coincidir con los nombres de archivo de `partidos/`.
