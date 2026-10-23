export type Audience = (typeof AUDIENCES)[number];

export const AUDIENCES = ['Personal', 'Clinic', 'Company'] as const;
