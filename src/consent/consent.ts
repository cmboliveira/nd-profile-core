// SPDX-License-Identifier: Apache-2.0
import type { Audience } from '../audience/index.js';

export interface ConsentProps {
  userId: string;
  targetAudience: Audience;
  sharedAssertionIds: string[];
  expiresAt: Date;
  revoked: boolean;
}

export interface Consent extends ConsentProps {
  id: string;
}
