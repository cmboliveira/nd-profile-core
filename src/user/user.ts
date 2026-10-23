// SPDX-License-Identifier: Apache-2.0
import type { BrazilianRegion, BrazilianState } from '../geography/index.js';
import type { SchoolingLevel } from '../schooling/index.js';

export type UserRole = (typeof USER_ROLES)[number];

export interface UserProps {
  name: string;
  email: string;
  role: UserRole;
  birthDate: Date;
  region: BrazilianRegion;
  state: BrazilianState;
  schooling: SchoolingLevel;
  pseudonymizedId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends UserProps {
  id: string;
}

export const USER_ROLES = ['Individual', 'Professional', 'Admin'] as const;
