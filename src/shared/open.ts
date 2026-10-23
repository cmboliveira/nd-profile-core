export type Open<T extends string> = T | (string & Record<never, never>);
