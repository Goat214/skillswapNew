import type { Profile, Match } from '../types';

/**
 * Smart Matching (MVP heuristic, no external AI):
 * Score = overlap between what I want to learn and what they can teach,
 * plus overlap between what they want to learn and what I can teach.
 * Both directions count equally — SkillSwap is about mutual exchange.
 */
export function computeMatches(me: Profile, others: Profile[]): Match[] {
  const matches = others
    .filter((o) => o.id !== me.id)
    .map((other) => {
      const theyTeachYouWant = other.teaching_skills.filter((s) => me.learning_skills.includes(s));
      const youTeachTheyWant = me.teaching_skills.filter((s) => other.learning_skills.includes(s));

      const totalWanted = me.learning_skills.length + other.learning_skills.length;
      const totalMatched = theyTeachYouWant.length + youTeachTheyWant.length;
      const score = totalWanted === 0 ? 0 : Math.round((totalMatched / totalWanted) * 100);

      return {
        matched_user: other,
        compatibility_score: Math.min(99, score),
        they_teach_you_want: theyTeachYouWant,
        you_teach_they_want: youTeachTheyWant,
      };
    })
    .filter((m) => m.compatibility_score > 0)
    .sort((a, b) => b.compatibility_score - a.compatibility_score);

  return matches;
}
