import type {
  Assertion,
  AssertionBranch,
  AssertionStatus,
  AssertionType,
  Polarity,
} from '../assertion/index.js';
import type { Audience } from '../audience/index.js';
import type { Consent } from '../consent/index.js';
import type { Facet } from '../facet/index.js';

export interface AssertionView {
  id: string;
  branch: AssertionBranch;
  type: AssertionType;
  facet: Facet;
  value: string | number;
  construct: string;
  status: AssertionStatus;
  polarity?: Polarity;
  description: string;
}

export interface ProfileView {
  userId: string;
  visibility: Audience;
  visibleAssertions: AssertionView[];
  generatedAt: Date;
  expiresAt: Date | null;
}

export interface ProfileBuildInput {
  userId: string;
  visibility: Audience;
  assertions: readonly Assertion[];
  consents: readonly Consent[];
  now?: Date;
}

export function describeAssertion(assertion: Assertion): string {
  const { facet, construct, value } = assertion;
  return `${facet.type} / ${facet.attribute}: ${construct} = ${value}`;
}

function toView(assertion: Assertion): AssertionView {
  const view: AssertionView = {
    id: assertion.id,
    branch: assertion.branch,
    type: assertion.type,
    facet: assertion.facet,
    value: assertion.value,
    construct: assertion.construct,
    status: assertion.status,
    description: describeAssertion(assertion),
  };
  if (assertion.polarity !== undefined) {
    view.polarity = assertion.polarity;
  }
  return view;
}

export class ProfileService {
  build(input: ProfileBuildInput): ProfileView {
    const now = input.now ?? new Date();
    const own = input.assertions.filter((assertion) => assertion.userId === input.userId);

    if (input.visibility === 'Personal') {
      return {
        userId: input.userId,
        visibility: input.visibility,
        visibleAssertions: own.map(toView),
        generatedAt: now,
        expiresAt: null,
      };
    }

    const activeConsents = input.consents.filter(
      (consent) =>
        consent.userId === input.userId &&
        consent.targetAudience === input.visibility &&
        !consent.revoked &&
        consent.expiresAt.getTime() > now.getTime(),
    );

    const sharedIds = new Set(activeConsents.flatMap((consent) => consent.sharedAssertionIds));
    const visible = own.filter((assertion) => sharedIds.has(assertion.id));

    const expiresAt =
      activeConsents.length === 0
        ? null
        : new Date(Math.min(...activeConsents.map((consent) => consent.expiresAt.getTime())));

    return {
      userId: input.userId,
      visibility: input.visibility,
      visibleAssertions: visible.map(toView),
      generatedAt: now,
      expiresAt,
    };
  }
}
