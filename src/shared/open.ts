// SPDX-License-Identifier: Apache-2.0
export type Open<T extends string> = T | (string & Record<never, never>);
