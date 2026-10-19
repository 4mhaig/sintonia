import { useEffect, useState } from 'react'
import type { Ruta } from '../App'

const TAMANOS = [
  { id: 'normal', etiqueta: 'A', nombre: 'Letra normal' },
  { id: 'grande', etiqueta: 'A+', nombre: 'Letra grande' },
  { id: 'muy-grande', etiqueta: 'A++', nombre: 'Letra muy grande' },
]

const leerTamano = () => {
  try { return localStorage.getItem('sintonia-texto') ?? 'normal' } catch { return 'normal' }
}

export function Cabecera({ ruta }: { ruta: Ruta }) {
  const [tamano, setTamano] = useState(leerTamano)
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.texto = tamano
    try { localStorage.setItem('sintonia-texto', tamano) } catch { /* sin almacenamiento: no pasa nada */ }
  }, [tamano])

  const enlace = (r: Ruta, texto: string) => (
    <a href={`#/${r}`} aria-current={ruta === r ? 'page' : undefined}>{texto}</a>
  )

  return (
    <header className="cabecera">
      <a href="#/" className="marca" aria-label="Sintonía, ir al inicio">
        <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="8" fill="var(--texto)" />
          <path d="M4 16c3-8 5-8 8 0s5 8 8 0 5-8 8 0" fill="none" stroke="var(--senal)" strokeWidth="3" strokeLinecap="round" />
        </svg>
        Sintonía
      </a>
      <nav className="nav" aria-label="Secciones">
        {enlace('test', 'Test')}
        {enlace('temas', 'Por temas')}
        {enlace('provincia', 'Mi provincia')}
      </nav>
      {/* Discreto a propósito: un "Aa" pequeño que despliega las opciones */}
      <div className="tamano-letra">
        <button
          className="tamano-letra-boton"
          aria-expanded={abierto}
          aria-label="Cambiar el tamaño de la letra"
          title="Tamaño de la letra"
          onClick={() => setAbierto((a) => !a)}
        >
          Aa
        </button>
        {abierto && (
          <div className="tamano-letra-menu" role="group" aria-label="Tamaño de la letra">
            {TAMANOS.map((t) => (
              <button
                key={t.id}
                className="boton"
                style={{ minHeight: 44, padding: '0 0.75em', fontSize: '0.95rem' }}
                aria-pressed={tamano === t.id}
                aria-label={t.nombre}
                onClick={() => { setTamano(t.id); setAbierto(false) }}
              >
                {t.etiqueta}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
