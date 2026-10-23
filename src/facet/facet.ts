// SPDX-License-Identifier: Apache-2.0
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

export const AREA_KINDS = ['Function', 'Activity', 'Context', 'Sensory'] as const;

export const FACET_TYPE_ATTRIBUTES = {
  Cognition: [
    'attention',
    'memory',
    'reasoning',
    'sensory sensitivity',
    'visual sensitivity',
    'auditory sensitivity',
    'personal attitudes',
    'group attitudes',
    'social norms',
    'professional_support',
    'safety support',
    'assertive communication',
  ],
  Learning: ['reading', 'writing', 'calculating', 'imitating', 'visual', 'concepts'],
  Communication: [
    'verbal',
    'written',
    'non-verbal',
    'sign language',
    'communication aids',
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
  Mobility: ['transportation', 'driving'],
  Social: [
    'social_interaction',
    'family',
    'interpersonal reciprocity',
    'interactions with unfamiliar people',
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
