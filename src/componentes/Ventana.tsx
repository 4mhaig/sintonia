import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Ventana emergente accesible (usa <dialog>): se cierra con el botón, con Esc
 * o pulsando fuera. El foco vuelve al enlace que la abrió.
 */
export function Ventana({ abierta, titulo, alCerrar, children }: {
  abierta: boolean
  titulo: string
  alCerrar: () => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (abierta && !d.open) d.showModal()
    if (!abierta && d.open) d.close()
  }, [abierta])

  return (
    <dialog
      ref={ref}
      className="ventana"
      aria-labelledby="ventana-titulo"
      onClose={alCerrar}
      onClick={(e) => { if (e.target === ref.current) alCerrar() }}
    >
      <div className="ventana-cabecera">
        <h2 id="ventana-titulo">{titulo}</h2>
        <button type="button" className="boton ventana-cerrar" onClick={alCerrar} aria-label="Cerrar">✕</button>
      </div>
      <div className="ventana-cuerpo">{abierta && children}</div>
    </dialog>
  )
}
