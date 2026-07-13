/**
 * Identifier for a single finished attempt, used as the idempotency key for the
 * completion mutation. `crypto.randomUUID` is unavailable in insecure contexts
 * and some test environments, so fall back to a random-plus-timestamp string —
 * uniqueness per user is all the server needs.
 */
export function createAttemptId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  const random = Math.random().toString(36).slice(2, 12)
  return `attempt-${Date.now().toString(36)}-${random}`
}
