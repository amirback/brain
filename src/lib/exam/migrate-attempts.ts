import type { Attempt } from "./types";
import { permutationFor, movedCorrect } from "../shuffle-answers";
import { SAT_RW_POOL, SAT_MATH_POOL } from "./sets";
import { IELTS_READING_POOL, IELTS_LISTENING_POOL } from "./ielts-sets";

/**
 * One-time repair of attempts saved before answer shuffling existed.
 *
 * `ItemResult.given` is a position, not an option, so an attempt recorded when
 * the correct answer was always first points at whatever now sits in that slot.
 * The verdict, the score and the skill breakdown are all stored separately and
 * stay right — the only casualty is the review screen's "you chose C", which is
 * exactly the screen a student opens to understand a mistake.
 *
 * The permutation is a pure function of the item id, so replaying it recovers the
 * option the student actually clicked. Attempts saved from now on carry
 * `shuffled: true` and are left alone; the flag's absence is what marks an old one.
 *
 * Lives in its own module so the store can import it dynamically — the pools are
 * a few hundred kilobytes of passages, and the store is in the root layout.
 */

function optionCount(id: string): number | null {
  for (const pool of [SAT_RW_POOL, SAT_MATH_POOL, IELTS_READING_POOL, IELTS_LISTENING_POOL]) {
    const item = pool.find((i) => i.id === id);
    if (item) return item.options?.length ?? null;
  }
  return null;
}

/** Returns the repaired attempt, or the same object when there was nothing to do. */
export function migrateAttempt(attempt: Attempt): Attempt {
  if (attempt.shuffled) return attempt;

  const results = attempt.results.map((r) => {
    if (typeof r.given !== "number") return r;
    const count = optionCount(r.id);
    if (count === null) return r;
    const order = permutationFor(r.id, count);
    // Null means the item was never shuffled — True/False/Not Given, or a
    // single-option item. Its positions never moved.
    if (!order) return r;
    return { ...r, given: movedCorrect(r.given, order) };
  });

  return { ...attempt, results, shuffled: true };
}

/** True when anything actually changed, so the caller knows whether to persist. */
export function migrateAttempts(attempts: Attempt[]): { attempts: Attempt[]; changed: boolean } {
  let changed = false;
  const next = attempts.map((a) => {
    const migrated = migrateAttempt(a);
    if (migrated !== a) changed = true;
    return migrated;
  });
  return { attempts: next, changed };
}
