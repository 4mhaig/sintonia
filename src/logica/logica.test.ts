import { describe, expect, it } from 'vitest'
import { repartir, votosParaOtroEscano } from './dhondt'
import { calcularAfinidad } from './afinidad'
import type { Afirmacion, Partido } from './tipos'

describe("D'Hondt", () => {
  it('reparte como el ejemplo de manual (8 escaños)', () => {
    const r = repartir({ blancos: 0, votos: { a: 100000, b: 80000, c: 30000, d: 20000 } }, 8)
    expect(r.escanos).toEqual({ a: 4, b: 3, c: 1, d: 0 })
    expect(r.ultimoEscano).toBe('a')
    expect(r.cocienteUltimo).toBe(25000)
  })

  it('deja fuera a quien no llega al 3 % aunque su cociente diera para escaño', () => {
    // e tiene 2,9 % de los válidos: su cociente (29) superaría al último (~32) en otro reparto
    const r = repartir({ blancos: 0, votos: { a: 500, b: 300, c: 171, e: 29 } }, 30)
    expect(r.fueraDelUmbral).toEqual(['e'])
    expect(r.escanos.e).toBe(0)
  })

  it('los votos en blanco cuentan para el 3 %', () => {
    const sinBlancos = repartir({ blancos: 0, votos: { a: 960, b: 40 } }, 10)
    const conBlancos = repartir({ blancos: 400, votos: { a: 960, b: 40 } }, 10)
    expect(sinBlancos.fueraDelUmbral).toEqual([])
    expect(conBlancos.fueraDelUmbral).toEqual(['b'])
  })

  it('en empate de cociente gana quien tiene más votos', () => {
    const r = repartir({ blancos: 0, votos: { a: 200, b: 100 } }, 2)
    // cocientes a: 200, 100 · b: 100 → el 2.º escaño empata a 100 y se lo lleva a
    expect(r.escanos).toEqual({ a: 2, b: 0 })
  })

  it('calcula cuántos votos faltan para un escaño más', () => {
    const datos = { blancos: 0, votos: { a: 100000, b: 80000, c: 30000, d: 20000 } }
    const faltan = votosParaOtroEscano(datos, 8, 'd')
    expect(repartir({ ...datos, votos: { ...datos.votos, d: 20000 + faltan } }, 8).escanos.d).toBe(1)
    expect(repartir({ ...datos, votos: { ...datos.votos, d: 20000 + faltan - 1 } }, 8).escanos.d).toBe(0)
  })
})

describe('afinidad', () => {
  const afirmaciones: Afirmacion[] = [
    { id: 'f1', tema: 'vivienda', texto: '', explicacion: '' },
    { id: 'f2', tema: 'sanidad', texto: '', explicacion: '' },
  ]
  const partido = (id: string, p1: 1 | 0 | -1 | null, p2: 1 | 0 | -1 | null): Partido => ({
    id, nombre: id, siglas: id, color: '', ficticio: true, programa_url: null, programa_publicado: null,
    posturas: [
      { afirmacion: 'f1', postura: p1, cita: '', pagina: null },
      { afirmacion: 'f2', postura: p2, cita: '', pagina: null },
    ],
  })

  it('100 % si coincide en todo y 0 % si es lo contrario', () => {
    const r = calcularAfinidad([partido('igual', 1, -1), partido('opuesto', -1, 1)], afirmaciones, { f1: 1, f2: -1 })
    expect(r.map((x) => [x.partido, x.porcentaje])).toEqual([['igual', 100], ['opuesto', 0]])
  })

  it('los temas importantes cuentan doble', () => {
    const p = partido('p', 1, 1)
    expect(calcularAfinidad([p], afirmaciones, { f1: 1, f2: -1 })[0].porcentaje).toBe(50)
    expect(calcularAfinidad([p], afirmaciones, { f1: 1, f2: -1 }, ['vivienda'])[0].porcentaje).toBe(67)
  })

  it('ignora las frases saltadas y avisa si el partido no se pronuncia', () => {
    const r = calcularAfinidad([partido('callado', null, null)], afirmaciones, { f1: 1, f2: null })
    expect(r[0].comparadas).toBe(0)
    expect(r[0].pocoFiable).toBe(true)
  })
})
