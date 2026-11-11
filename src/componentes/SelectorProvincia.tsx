import { useState } from 'react'
import { PROVINCIAS, provinciaPorId } from '../datos'
import { provinciaActual, type ErrorUbicacion } from '../logica/ubicacion'

interface Props {
  valor: string
  alCambiar: (id: string) => void
  etiqueta?: string
  /** Texto de la opción vacía */
  vacio?: string
  /** Muestra el botón "Usar mi ubicación" */
  conUbicacion?: boolean
}

const ERRORES: Record<ErrorUbicacion, string> = {
  'no-disponible': 'Tu navegador no permite saber la ubicación. Elige la provincia en la lista.',
  denegada: 'No has dado permiso para usar tu ubicación. Elige la provincia en la lista.',
  fuera: 'Parece que ahora no estás en España. Elige la provincia donde votas en la lista.',
  error: 'No hemos podido saber dónde estás. Elige la provincia en la lista.',
}

type Estado = { tipo: 'quieto' } | { tipo: 'buscando' } | { tipo: 'hecho'; id: string } | { tipo: 'error'; motivo: ErrorUbicacion }

/** Desplegable de provincias, el mismo en todas las pantallas */
export function SelectorProvincia({ valor, alCambiar, etiqueta = '¿Dónde votas?', vacio = 'Elige tu provincia', conUbicacion = false }: Props) {
  const [estado, setEstado] = useState<Estado>({ tipo: 'quieto' })

  const ubicar = async () => {
    setEstado({ tipo: 'buscando' })
    try {
      const id = await provinciaActual()
      alCambiar(id)
      setEstado({ tipo: 'hecho', id })
    } catch (e) {
      setEstado({ tipo: 'error', motivo: typeof e === 'string' && e in ERRORES ? (e as ErrorUbicacion) : 'error' })
    }
  }

  return (
    <div className="pila">
      <label className="pila" style={{ display: 'block' }}>
        <span style={{ fontWeight: 700 }}>{etiqueta}</span>
        <select value={valor} onChange={(e) => { alCambiar(e.target.value); setEstado({ tipo: 'quieto' }) }}>
          <option value="">{vacio}</option>
          {PROVINCIAS.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
      </label>

      {conUbicacion && (
        <div aria-live="polite">
          {estado.tipo !== 'hecho' && (
            <button type="button" className="boton fantasma ubicacion-boton" disabled={estado.tipo === 'buscando'} onClick={ubicar}>
              <span aria-hidden="true">◎</span> <span className="ubicacion-texto">{estado.tipo === 'buscando' ? 'Buscando tu provincia…' : 'Usar mi ubicación'}</span>
            </button>
          )}
          {estado.tipo === 'hecho' && valor === estado.id && (
            <p className="secundario" style={{ margin: 0, fontSize: '0.95rem' }}>
              Estás en {provinciaPorId(estado.id)?.nombre}. Si estás censado en otra provincia, cámbiala en la lista.
            </p>
          )}
          {estado.tipo === 'error' && (
            <p className="secundario" style={{ margin: 0, fontSize: '0.95rem' }}>{ERRORES[estado.motivo]}</p>
          )}
          <p className="secundario" style={{ margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            No guardamos tu provincia. Si usas tu ubicación, se calcula en tu dispositivo y no se envía a ningún sitio.
          </p>
        </div>
      )}
    </div>
  )
}
