export type SchoolingLevel = (typeof SCHOOLING_LEVELS)[number];

export type SchoolingYearsRange =
  (typeof SCHOOLING_YEARS_RANGES)[keyof typeof SCHOOLING_YEARS_RANGES];

export const SCHOOLING_LEVELS = [
  'None',
  'IncompletePrimary',
  'CompletePrimary',
  'IncompleteSecondary',
  'CompleteSecondary',
  'IncompleteHigherEducation',
  'CompleteHigherEducation',
] as const;

export const SCHOOLING_YEARS_RANGES = {
  ZeroToFour: '0-4',
  FiveToEight: '5-8',
  NineToEleven: '9-11',
  TwelvePlus: '12+',
} as const;

const YEARS_BY_LEVEL = {
  None: SCHOOLING_YEARS_RANGES.ZeroToFour,
  IncompletePrimary: SCHOOLING_YEARS_RANGES.ZeroToFour,
  CompletePrimary: SCHOOLING_YEARS_RANGES.FiveToEight,
  IncompleteSecondary: SCHOOLING_YEARS_RANGES.FiveToEight,
  CompleteSecondary: SCHOOLING_YEARS_RANGES.NineToEleven,
  IncompleteHigherEducation: SCHOOLING_YEARS_RANGES.TwelvePlus,
  CompleteHigherEducation: SCHOOLING_YEARS_RANGES.TwelvePlus,
} as const satisfies Record<SchoolingLevel, SchoolingYearsRange>;

export function getSchoolingYearsRange(level: SchoolingLevel): SchoolingYearsRange {
  return YEARS_BY_LEVEL[level];
}
