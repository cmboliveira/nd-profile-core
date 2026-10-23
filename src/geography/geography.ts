export type BrazilianRegion = (typeof BRAZILIAN_REGIONS)[number];

export type BrazilianState = (typeof BRAZILIAN_STATES)[number];

export const BRAZILIAN_REGIONS = [
  'southeast',
  'northeast',
  'south',
  'north',
  'central_west',
] as const;

export const BRAZILIAN_STATES = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const;

const REGION_BY_STATE = {
  SP: 'southeast',
  RJ: 'southeast',
  MG: 'southeast',
  ES: 'southeast',
  PR: 'south',
  SC: 'south',
  RS: 'south',
  MT: 'central_west',
  MS: 'central_west',
  GO: 'central_west',
  DF: 'central_west',
  BA: 'northeast',
  SE: 'northeast',
  AL: 'northeast',
  PE: 'northeast',
  PB: 'northeast',
  RN: 'northeast',
  CE: 'northeast',
  PI: 'northeast',
  MA: 'northeast',
  AC: 'north',
  AM: 'north',
  AP: 'north',
  PA: 'north',
  RO: 'north',
  RR: 'north',
  TO: 'north',
} as const satisfies Record<BrazilianState, BrazilianRegion>;

export function getRegionByState(state: BrazilianState): BrazilianRegion {
  return REGION_BY_STATE[state];
}
