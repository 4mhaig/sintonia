# Sintonía · ¿Con quién sintonizas?

Herramienta web, gratuita y sin registro, para comparar los programas electorales de las **elecciones generales del 29 de noviembre de 2026** y descubrir qué partido se parece más a lo que piensas.

- **Test:** responde frases sobre los temas que te importan. La onda pasa de ruido a señal limpia mientras respondes.
- **Resultado:** porcentaje de coincidencia con cada partido, con la cita del programa que lo justifica.
- **Por temas:** qué propone cada partido sobre vivienda, sanidad, pensiones…
- **Mi provincia:** cuántos escaños se reparten donde votas y qué pasa con tu voto si tu partido no llega.

> **Estado:** prototipo. Los partidos y los votos que aparecen ahora son **ficticios** (Partido Alfa, Beta…). Se sustituirán por los reales cuando se proclamen las candidaturas y se publiquen los programas.

## Privacidad

Todo se calcula en tu navegador. No se guardan ni se envían tus respuestas a ningún servidor. Las opiniones políticas son datos especialmente protegidos (RGPD, art. 9) y preferimos no tocarlas.

## Neutralidad

- Cada postura de un partido enlaza a la cita literal y la página de su programa.
- Los partidos se muestran siempre en orden aleatorio.
- La forma de calcular la afinidad es pública: ver [METODOLOGIA.md](METODOLOGIA.md).
- Entre el 24 y el 28 de noviembre (veda de encuestas, LOREG art. 69.7) el simulador solo usa resultados de 2023, nunca sondeos.

## Estructura

```
datos/                    ← todo el contenido, separado del diseño
  elecciones.json         fecha, convocatoria, campaña, veda
  temas.json              los temas (vivienda, sanidad…)
  afirmaciones.json       las frases del test
  partidos/*.json         un archivo por partido, con sus posturas y citas
  provincias/
    escanos.json          escaños por provincia (RD 806/2026)
    resultados-*.json     votos por provincia para el simulador
src/
  paginas/                Inicio, Test, Resultado, Temas, Provincia
  componentes/            Onda (ruido → señal), Glitch, Dial, Hemiciclo
  logica/                 afinidad.ts y dhondt.ts (con tests)
  estilos/                tokens de color y tipografía
programas-pdf/            PDF originales de los programas, como fuente
```

## Para desarrollar

```bash
npm install
npm run dev      # abre la web en local
npm test         # comprueba los cálculos
npm run build    # genera la versión publicable en dist/
```

Se publica automáticamente en GitHub Pages con cada cambio en `main`.

## Calendario

| Fecha | Hito |
|---|---|
| 21–26 oct | Presentación de candidaturas |
| 13 nov | Empieza la campaña · **Sintonía debe estar publicada** |
| 24–28 nov | Veda de encuestas |
| 29 nov | Elecciones |

## Licencia

Código bajo licencia MIT. Los programas electorales pertenecen a sus partidos y se citan con fines informativos.
