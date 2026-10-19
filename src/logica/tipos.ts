export type Postura = 1 | 0 | -1 | null

export interface Tema {
  id: string
  nombre: string
  icono: string
}

export interface Afirmacion {
  id: string
  tema: string
  texto: string
  explicacion: string
}

export interface PosturaPartido {
  afirmacion: string
  postura: Postura
  cita: string
  pagina: number | null
}

export interface Partido {
  id: string
  nombre: string
  siglas: string
  color: string
  ficticio: boolean
  programa_url: string | null
  programa_publicado: string | null
  posturas: PosturaPartido[]
}

export interface Provincia {
  id: string
  nombre: string
  escanos: number
}

export interface ResultadoProvincia {
  blancos: number
  votos: Record<string, number>
}

/** Respuesta de la persona: 1 de acuerdo, 0 neutral, -1 en desacuerdo, null saltada */
export type Respuestas = Record<string, Postura>
