import type { Scenery } from '../draw'
import type { SceneryId } from '../song'
import { BATTERIA } from './batteria'
import { CODICE } from './codice'
import { CUTOVER } from './cutover'
import { DELFI } from './delfi'
import { FAVOLA } from './favola'
import { GOLIVE } from './golive'
import { HANA } from './hana'
import { LICEO } from './liceo'
import { PRINCIPIO } from './principio'
import { ROSA } from './rosa'
import { STOA } from './stoa'
import { TEMPIO } from './tempio'
import { VENERDI } from './venerdi'

// Every scenery, by the name a song gives in `scenery`.
export const SCENERIES: Record<SceneryId, Scenery> = { rosa: ROSA, codice: CODICE, golive: GOLIVE, tempio: TEMPIO, stoa: STOA, hana: HANA, delfi: DELFI, liceo: LICEO, principio: PRINCIPIO, batteria: BATTERIA, cutover: CUTOVER, venerdi: VENERDI, favola: FAVOLA }
