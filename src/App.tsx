import { useEffect, useState } from 'react'
import type { Respuestas } from './logica/tipos'
import { ELECCIONES } from './datos'
import { Cabecera } from './componentes/Cabecera'
import { Pie } from './componentes/Pie'
import { Inicio } from './paginas/Inicio'
import { Test } from './paginas/Test'
import { Resultado } from './paginas/Resultado'
import { Temas } from './paginas/Temas'
import { Provincia } from './paginas/Provincia'
import { Metodologia } from './paginas/Metodologia'

export type Ruta = 'inicio' | 'test' | 'resultado' | 'temas' | 'provincia' | 'metodologia'

const leerRuta = (): Ruta => {
  const r = window.location.hash.replace('#/', '') as Ruta
  return ['test', 'resultado', 'temas', 'provincia', 'metodologia'].includes(r) ? r : 'inicio'
}

export const ir = (ruta: Ruta) => { window.location.hash = ruta === 'inicio' ? '/' : `/${ruta}` }

export function App() {
  const [ruta, setRuta] = useState<Ruta>(leerRuta)
  // Las respuestas solo viven en memoria: no se guardan ni se envían a ningún sitio
  const [respuestas, setRespuestas] = useState<Respuestas>({})
  const [importantes, setImportantes] = useState<string[]>([])

  useEffect(() => {
    const cambiar = () => { setRuta(leerRuta()); window.scrollTo(0, 0) }
    window.addEventListener('hashchange', cambiar)
    return () => window.removeEventListener('hashchange', cambiar)
  }, [])

  const terminado = Object.keys(respuestas).length > 0

  return (
    <div className="contenedor">
      <Cabecera ruta={ruta} />
      {ELECCIONES.datos_de_ejemplo && (
        <p className="aviso" role="note">
          <strong>Versión de prueba.</strong> Los partidos que ves (Alfa, Beta…) son inventados. Los reales llegarán cuando se publiquen los programas.
        </p>
      )}
      <main style={{ paddingTop: '1rem' }}>
        {ruta === 'inicio' && <Inicio />}
        {ruta === 'test' && (
          <Test
            alTerminar={(r, imp) => { setRespuestas(r); setImportantes(imp); ir('resultado') }}
          />
        )}
        {ruta === 'resultado' && (terminado ? <Resultado respuestas={respuestas} importantes={importantes} /> : <Inicio />)}
        {ruta === 'temas' && <Temas />}
        {ruta === 'provincia' && <Provincia />}
        {ruta === 'metodologia' && <Metodologia />}
      </main>
      <Pie />
    </div>
  )
}
