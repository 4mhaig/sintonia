/** Contornos de provincias: cada anillo es una lista plana [lon, lat, lon, lat…] */
export type MapaProvincias = Record<string, number[][]>

// Si el punto cae en el mar o en una costa muy recortada, se acepta la provincia más cercana hasta esta distancia
const MAX_KM_COSTA = 25

/** Regla par-impar con todos los anillos de la provincia (los agujeros se restan solos) */
function dentro(lon: number, lat: number, anillos: number[][]): boolean {
  let fuera = true
  for (const r of anillos) {
    for (let i = 0, j = r.length - 2; i < r.length; j = i, i += 2) {
      const xi = r[i], yi = r[i + 1], xj = r[j], yj = r[j + 1]
      if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) fuera = !fuera
    }
  }
  return !fuera
}

/** Distancia aproximada en km de un punto al borde más cercano de la provincia */
function distanciaKm(lon: number, lat: number, anillos: number[][]): number {
  const kx = 111.32 * Math.cos((lat * Math.PI) / 180)
  const ky = 110.57
  let min = Infinity
  for (const r of anillos) {
    for (let i = 0; i + 3 < r.length; i += 2) {
      const ax = (r[i] - lon) * kx, ay = (r[i + 1] - lat) * ky
      const bx = (r[i + 2] - lon) * kx, by = (r[i + 3] - lat) * ky
      const dx = bx - ax, dy = by - ay
      const t = Math.max(0, Math.min(1, -(ax * dx + ay * dy) / (dx * dx + dy * dy || 1)))
      min = Math.min(min, Math.hypot(ax + t * dx, ay + t * dy))
    }
  }
  return min
}

/** Provincia que contiene el punto, o la más cercana si está muy cerca de la costa. null si está fuera de España. */
export function provinciaEn(lat: number, lon: number, mapa: MapaProvincias): string | null {
  for (const [id, anillos] of Object.entries(mapa)) {
    if (dentro(lon, lat, anillos)) return id === 'gibraltar' ? null : id
  }
  let mejor: string | null = null
  let dist = MAX_KM_COSTA
  for (const [id, anillos] of Object.entries(mapa)) {
    const d = distanciaKm(lon, lat, anillos)
    if (d < dist) { dist = d; mejor = id }
  }
  return mejor === 'gibraltar' ? null : mejor
}

export type ErrorUbicacion = 'no-disponible' | 'denegada' | 'fuera' | 'error'

/**
 * Pide la ubicación al navegador y la convierte en provincia sin salir del dispositivo:
 * el mapa se descarga de esta misma web y las coordenadas no se envían a ningún sitio.
 */
export async function provinciaActual(): Promise<string> {
  if (!('geolocation' in navigator)) throw 'no-disponible' satisfies ErrorUbicacion
  const [posicion, mapa] = await Promise.all([
    new Promise<GeolocationPosition>((ok, mal) =>
      navigator.geolocation.getCurrentPosition(ok, mal, { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 }),
    ).catch((e: GeolocationPositionError) => { throw (e.code === e.PERMISSION_DENIED ? 'denegada' : 'error') satisfies ErrorUbicacion }),
    import('../../datos/provincias/mapa.json').then((m) => m.default.provincias as MapaProvincias),
  ])
  const id = provinciaEn(posicion.coords.latitude, posicion.coords.longitude, mapa)
  if (!id) throw 'fuera' satisfies ErrorUbicacion
  return id
}
