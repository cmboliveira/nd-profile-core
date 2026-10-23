// SPDX-License-Identifier: Apache-2.0
import type { Facet } from '../facet/index.js';

export type AssertionBranch = (typeof ASSERTION_BRANCHES)[number];

export type AssertionType = (typeof ASSERTION_TYPES)[number];

export type AssertionStatus = (typeof ASSERTION_STATUSES)[number];

export type AssertionSourceKind = (typeof ASSERTION_SOURCE_KINDS)[number];

export type Polarity = (typeof POLARITIES)[number];

export type AssertionSource =
  | { kind: 'document'; date: Date; fileId: string }
  | { kind: 'self_report'; date: Date; fileId?: never }
  | { kind: 'professional_evaluation'; date: Date; fileId?: never };

export interface AssertionProps {
  branch: AssertionBranch;
  type: AssertionType;
  facet: Facet;
  value: string | number;
  construct: string;
  source: AssertionSource;
  polarity?: Polarity;
  status: AssertionStatus;
}

export interface Assertion extends AssertionProps {
  id: string;
  userId: string;
  authorId: string;
  createdAt: Date;
}

export const ASSERTION_BRANCHES = ['Condition', 'Functioning', 'Context', 'Preference'] as const;

export const ASSERTION_TYPES = ['Diagnosis', 'Strength', 'Difficulty', 'Need'] as const;

export const ASSERTION_STATUSES = ['Confirmed', 'Suggestive'] as const;

export const ASSERTION_SOURCE_KINDS = ['document', 'self_report', 'professional_evaluation'] as const;

export const POLARITIES = [
  'higher_is_more_symptoms',
  'higher_is_better',
  'neutral',
  'lower_is_better',
  'lower_is_more_symptoms',
] as const;
