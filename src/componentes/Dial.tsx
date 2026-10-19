import { useEffect, useState } from 'react'
import type { Partido } from '../logica/tipos'

interface Props {
  partidos: Partido[]
  /** Partido en el que se para la aguja */
  elegido: string
}

/** Dial de radio: cada partido es una emisora y la aguja se para en la que más sintonizas. */
export function Dial({ partidos, elegido }: Props) {
  const ancho = 640
  const margen = 50
  const x = (i: number) => margen + (i * (ancho - 2 * margen)) / Math.max(1, partidos.length - 1)
  const destino = x(Math.max(0, partidos.findIndex((p) => p.id === elegido)))
  const [aguja, setAguja] = useState(margen)

  useEffect(() => {
    const id = requestAnimationFrame(() => setAguja(destino))
    return () => cancelAnimationFrame(id)
  }, [destino])

  return (
    <svg viewBox={`0 0 ${ancho} 96`} width="100%" role="img" aria-label={`Dial con ${partidos.length} partidos`}>
      <rect x="0" y="0" width={ancho} height="96" rx="16" fill="var(--superficie-2)" />
      {Array.from({ length: 41 }, (_, i) => {
        const xi = margen + (i * (ancho - 2 * margen)) / 40
        return <line key={i} x1={xi} x2={xi} y1={i % 5 ? 34 : 28} y2="44" stroke="var(--borde-fuerte)" strokeWidth="1.5" />
      })}
      {partidos.map((p, i) => (
        <g key={p.id}>
          <circle cx={x(i)} cy="56" r="6" fill={p.color} />
          <text x={x(i)} y="84" textAnchor="middle" fontSize="15" fontWeight="700" fontFamily="var(--mono)" fill="var(--texto-2)">
            {p.siglas}
          </text>
        </g>
      ))}
      <line
        x1={aguja} x2={aguja} y1="12" y2="66"
        stroke="var(--acento)" strokeWidth="4" strokeLinecap="round"
        style={{ transition: 'all 1400ms cubic-bezier(.25,1.4,.5,1)' }}
      />
    </svg>
  )
}
