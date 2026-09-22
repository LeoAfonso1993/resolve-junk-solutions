import { priorityRules } from '../data/intake.ts';
export interface LeadProject {
  categories: string[];
  volume: string;
  timeframe: string;
  access: string;
  propertyType: string;
  description: string;
  photoCount: number;
}
/** Future SERVER use after validation. Never trust a client-provided score.
 * Operational follow-up suggestion only; no inferred income or ZIP-based wealth.
 * Staff can override it. Unconfirmed coverage/materials always require review.
 */
export function suggestPriority(project: LeadProject) {
  const reasons: string[] = [];
  const urgency =
    priorityRules.timeframe[
      project.timeframe as keyof typeof priorityRules.timeframe
    ] || 0;
  const scope =
    priorityRules.volume[project.volume as keyof typeof priorityRules.volume] ||
    0;
  let score = urgency + scope;
  if (urgency >= 30) reasons.push('Near-term timing requested');
  if (scope >= 15) reasons.push('Larger project scope');
  if (project.description.trim().length >= 25) {
    score += priorityRules.detailPoints;
    reasons.push('Project description provided');
  }
  if (project.photoCount > 0) {
    score += priorityRules.photoPoints;
    reasons.push('Photos available for estimate');
  }
  if (project.access && project.access !== 'unsure') {
    score += priorityRules.knownAccessPoints;
    reasons.push('Access identified');
  }
  return {
    score,
    band:
      score >= priorityRules.highThreshold
        ? 'high'
        : score >= priorityRules.mediumThreshold
          ? 'medium'
          : 'standard',
    reasons,
    rulesVersion: priorityRules.version,
    requiresHumanReview: true,
  };
}
