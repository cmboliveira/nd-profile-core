// SPDX-License-Identifier: Apache-2.0
export type Audience = (typeof AUDIENCES)[number];

export const AUDIENCES = ['Personal', 'Company'] as const;
