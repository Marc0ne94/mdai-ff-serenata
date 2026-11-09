import type { Ambience } from '../draw'
import type { AmbienceId } from '../song'
import { ANTICO } from './antico'
import { DATACENTER } from './datacenter'
import { RAVE } from './rave'
import { SERATA } from './serata'

// The band's own club, as first drawn: it sets nothing, so the stage draws its
// room, lights, sign and instruments as they have always been.
const CLUB: Ambience = {}

// Every ambience, by the name a collection gives in `ambience`.
export const AMBIENCES: Record<AmbienceId, Ambience> = { club: CLUB, antico: ANTICO, datacenter: DATACENTER, serata: SERATA, rave: RAVE }
