// ─── Goals Module — Public API ────────────────────────────────────────────────
// Other modules import ONLY from this index. Never reach into subdirectories.

export { goalsService } from './domain/goalsService';
export type { CreateGoalInput } from './domain/goalsService';
