import type { Partido } from '../logica/tipos'

interface Props {
  escanos: Record<string, number>
  partidos: Partido[]
}

/** Escaños de una provincia dibujados como un pequeño hemiciclo. */
export function Hemiciclo({ escanos, partidos }: Props) {
  const total = Object.values(escanos).reduce((s, n) => s + n, 0)
  const filas = total <= 6 ? 1 : total <= 16 ? 2 : total <= 30 ? 3 : 4
  const radioMin = 70
  const radioMax = 150
  const radios = Array.from({ length: filas }, (_, f) => (filas === 1 ? 110 : radioMin + (f * (radioMax - radioMin)) / (filas - 1)))
  const sumaRadios = radios.reduce((s, r) => s + r, 0)

  // Reparte los asientos por fila según la longitud de cada arco
  const porFila = radios.map((r) => Math.round((total * r) / sumaRadios))
  porFila[filas - 1] += total - porFila.reduce((s, n) => s + n, 0)

  const asientos: { x: number; y: number; angulo: number }[] = []
  radios.forEach((r, f) => {
    const n = porFila[f]
    for (let i = 0; i < n; i++) {
      const angulo = n === 1 ? Math.PI / 2 : Math.PI - (i * Math.PI) / (n - 1)
      asientos.push({ x: 170 + r * Math.cos(angulo), y: 165 - r * Math.sin(angulo), angulo })
    }
  })
  asientos.sort((a, b) => b.angulo - a.angulo)

  const colores = partidos
    .filter((p) => escanos[p.id])
    .sort((a, b) => escanos[b.id] - escanos[a.id])
    .flatMap((p) => Array(escanos[p.id]).fill(p.color) as string[])

  // Radio del círculo según el hueco más estrecho (entre filas o entre asientos de una fila)
  const huecos = radios.map((r, f) => (porFila[f] > 1 ? (Math.PI * r) / (porFila[f] - 1) : 40))
  if (filas > 1) huecos.push((radioMax - radioMin) / (filas - 1))
  const tam = Math.min(16, Math.min(...huecos) * 0.42)

  return (
    <svg viewBox="0 0 340 175" width="100%" style={{ maxWidth: 420 }} role="img" aria-label={`${total} escaños`}>
      {asientos.map((a, i) => (
        <circle
          key={i} cx={a.x} cy={a.y} r={tam} fill={colores[i] ?? 'var(--borde)'}
          style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: `asiento 400ms ${i * 35}ms both` }}
        />
      ))}
    </svg>
  )
}
