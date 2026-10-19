import { useEffect, useState } from 'react'
import { PARTIDOS } from '../datos'
import './glitch.css'

const DURACION = 650 // ms por partido: igual para todos y por debajo de 3 cambios por segundo

/**
 * Portada: las siglas de todos los partidos pasan con efecto glitch (mismo tiempo, orden aleatorio)
 * hasta "sintonizar" en la marca. Entre tanto ruido, encuentra tu señal.
 */
export function Glitch() {
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [paso, setPaso] = useState(quieto ? PARTIDOS.length : 0)

  useEffect(() => {
    if (paso >= PARTIDOS.length) return
    const id = setTimeout(() => setPaso((p) => p + 1), DURACION)
    return () => clearTimeout(id)
  }, [paso])

  const partido = PARTIDOS[paso]
  const final = !partido

  return (
    <div className="glitch-escena" aria-hidden="true">
      {final ? (
        <span key="marca" className="glitch-marca glitch-entra" data-texto="Sintonía">Sintonía</span>
      ) : (
        <span
          key={partido.id}
          className="glitch-siglas glitch-activo"
          data-texto={partido.siglas}
          style={{ ['--color' as string]: partido.color }}
        >
          {partido.siglas}
        </span>
      )}
      <span className="glitch-dial mono">
        {final ? '◉ señal encontrada' : `buscando señal · ${String(paso + 1).padStart(2, '0')}/${String(PARTIDOS.length).padStart(2, '0')}`}
      </span>
    </div>
  )
}
