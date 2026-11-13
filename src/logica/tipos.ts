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
  /** Traducción al castellano si la cita está en otra lengua */
  traduccion?: string | null
  pagina: number | null
  /** El programa no lo dice con las palabras de la frase: es lo más cercano que hay */
  aproximada?: boolean
}

export interface TramoPrograma {
  /** apartado: el programa tiene una sección sobre el tema; menciones: medidas sueltas */
  tipo: 'apartado' | 'menciones'
  titulo: string | null
  desde: number
  hasta: number
}

export interface Partido {
  id: string
  nombre: string
  siglas: string
  color: string
  ficticio: boolean
  programa_url: string | null
  /** Fecha en que el partido publicó su programa; null si aún no lo ha hecho */
  programa_publicado: string | null
  /** Fecha en que lo añadimos a Sintonía */
  programa_anadido?: string | null
  programa_titulo?: string
  /** Código de la lengua del programa si no es castellano: ca, gl, eu */
  programa_idioma?: string
  /** Solo para partidos que no se presentan en toda España, p. ej. "Andalucía" */
  ambito?: string
  /** Provincias donde se presenta. Si falta, se presenta en todas. */
  provincias?: string[]
  /** Dónde habla el programa de cada tema (páginas del PDF). null = no habla de ese tema */
  temas_programa?: Record<string, TramoPrograma[] | null>
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
