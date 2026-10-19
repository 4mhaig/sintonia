import { useEffect, useRef } from 'react'

interface Props {
  /** 0 = señal limpia, 1 = todo ruido */
  ruido: number
  alto?: number
}

const reducirMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Onda de radio: con ruido mientras haces el test, limpia cuando terminas. Decorativa. */
export function Onda({ ruido, alto = 96 }: Props) {
  const lienzo = useRef<HTMLCanvasElement>(null)
  const objetivo = useRef(ruido)
  objetivo.current = ruido
  // Con movimiento reducido no hay bucle: se vuelve a pintar cada vez que cambia el ruido
  const repintar = reducirMovimiento() ? ruido : 0

  useEffect(() => {
    const c = lienzo.current!
    const ctx = c.getContext('2d')!
    let actual = objetivo.current
    let t = 0
    let frame = 0
    const quieto = reducirMovimiento()

    const pintar = () => {
      const dpr = window.devicePixelRatio || 1
      const w = c.clientWidth * dpr
      const h = alto * dpr
      if (c.width !== w || c.height !== h) { c.width = w; c.height = h }
      const estilos = getComputedStyle(c)
      actual += (objetivo.current - actual) * (quieto ? 1 : 0.06)
      t += 0.035

      ctx.clearRect(0, 0, w, h)
      // Estática de fondo
      ctx.fillStyle = estilos.getPropertyValue('--ruido')
      ctx.globalAlpha = 0.45
      for (let k = 0; k < actual * 320; k++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 1.5 * dpr, 1.5 * dpr)
      }
      // Onda
      ctx.globalAlpha = 1
      ctx.strokeStyle = estilos.getPropertyValue('--senal')
      ctx.lineWidth = 3 * dpr
      ctx.lineJoin = 'round'
      ctx.beginPath()
      const m = h / 2
      for (let x = 0; x <= w; x += 3 * dpr) {
        const p = x / w
        const envolvente = Math.sin(p * Math.PI)
        const limpia = Math.sin(p * 16 + t * 2) * h * 0.3 * envolvente
        const sucia = (Math.random() - 0.5) * h * 0.75 * actual
        const y = m + limpia * (1 - actual * 0.5) + sucia
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      if (!quieto) frame = requestAnimationFrame(pintar)
    }
    pintar()
    return () => cancelAnimationFrame(frame)
  }, [alto, repintar])

  return <canvas ref={lienzo} aria-hidden="true" style={{ width: '100%', height: alto, display: 'block' }} />
}
