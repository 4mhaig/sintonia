import { PROVINCIAS } from '../datos'

interface Props {
  valor: string
  alCambiar: (id: string) => void
  etiqueta?: string
  /** Texto de la opción vacía */
  vacio?: string
}

/** Desplegable de provincias, el mismo en todas las pantallas */
export function SelectorProvincia({ valor, alCambiar, etiqueta = '¿Dónde votas?', vacio = 'Elige tu provincia' }: Props) {
  return (
    <label className="pila" style={{ display: 'block' }}>
      <span style={{ fontWeight: 700 }}>{etiqueta}</span>
      <select value={valor} onChange={(e) => alCambiar(e.target.value)}>
        <option value="">{vacio}</option>
        {PROVINCIAS.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
      </select>
    </label>
  )
}
