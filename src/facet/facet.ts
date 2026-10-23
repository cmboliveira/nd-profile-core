import type { Open } from '../shared/index.js';

export type FacetType = (typeof FACET_TYPES)[number];

export type AreaKind = (typeof AREA_KINDS)[number];

export type KnownFacetAttribute = (typeof FACET_TYPE_ATTRIBUTES)[FacetType][number];

export type FacetAttribute = Open<KnownFacetAttribute>;

export type FacetAttributesOf<T extends FacetType> = (typeof FACET_TYPE_ATTRIBUTES)[T][number];

export interface Facet {
  type: FacetType;
  areas: AreaKind[];
  attribute: FacetAttribute;
}

export const FACET_TYPES = [
  'Cognition',
  'Learning',
  'Communication',
  'Social',
  'Regulation',
  'Mobility',
  'Environment',
] as const;

export const AREA_KINDS = [
  'Function',
  'Activity',
  'EnvironmentalFactor',
  'SensoryChannel',
] as const;

export const FACET_TYPE_ATTRIBUTES = {
  Cognition: [
    'visual sensitivity',
    'auditory sensitivity',
    'security support',
    'assertive and normative communication',
    'individual attitudes',
    'social attitudes',
    'norms and ideologies',
    'healthcare professional support',
    'professional_support',
    'attention',
    'memory',
    'reasoning',
  ],
  Learning: ['reading', 'calculating', 'imitating', 'writing', 'visual', 'concepts'],
  Communication: [
    'verbal',
    'written',
    'non-verbal',
    'sign language',
    'use of devices and communication techniques',
    'tactile',
  ],
  Regulation: [
    'sleep',
    'energy',
    'stress',
    'visual',
    'auditory',
    'tactile',
    'olfactory',
    'gustatory',
    'pain',
  ],
  Mobility: ['public transportation', 'driving'],
  Social: [
    'social_interaction',
    'family',
    'security support',
    'basic interpersonal interactions',
    'relationships with strangers',
  ],
  Environment: [],
} as const satisfies Record<FacetType, readonly string[]>;

export function isKnownFacetAttribute(value: string): value is KnownFacetAttribute {
  for (const type of FACET_TYPES) {
    if ((FACET_TYPE_ATTRIBUTES[type] as readonly string[]).includes(value)) {
      return true;
    }
  }
  return false;
}

export function facetAttributesFor(type: FacetType): readonly KnownFacetAttribute[] {
  return FACET_TYPE_ATTRIBUTES[type] as readonly KnownFacetAttribute[];
}
