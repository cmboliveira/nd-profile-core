export { AUDIENCES } from './audience/index.js';
export type { Audience } from './audience/index.js';

export {
  ASSERTION_BRANCHES,
  ASSERTION_TYPES,
  ASSERTION_STATUSES,
  ASSERTION_SOURCE_KINDS,
  POLARITIES,
} from './assertion/index.js';
export type {
  AssertionBranch,
  AssertionType,
  AssertionStatus,
  AssertionSourceKind,
  Polarity,
  AssertionSource,
  AssertionProps,
  Assertion,
} from './assertion/index.js';

export type { ConsentProps, Consent } from './consent/index.js';

export {
  FACET_TYPES,
  AREA_KINDS,
  FACET_TYPE_ATTRIBUTES,
  isKnownFacetAttribute,
  facetAttributesFor,
} from './facet/index.js';
export type {
  FacetType,
  AreaKind,
  KnownFacetAttribute,
  FacetAttribute,
  Facet,
  FacetAttributesOf,
} from './facet/index.js';

export { BRAZILIAN_REGIONS, BRAZILIAN_STATES, getRegionByState } from './geography/index.js';
export type { BrazilianRegion, BrazilianState } from './geography/index.js';

export { ProfileService, describeAssertion } from './profile/index.js';
export type { AssertionView, ProfileView, ProfileBuildInput } from './profile/index.js';

export {
  SCHOOLING_LEVELS,
  SCHOOLING_YEARS_RANGES,
  getSchoolingYearsRange,
} from './schooling/index.js';
export type { SchoolingLevel, SchoolingYearsRange } from './schooling/index.js';

export type { Open } from './shared/index.js';

export { USER_ROLES } from './user/index.js';
export type { UserRole, UserProps, User } from './user/index.js';
