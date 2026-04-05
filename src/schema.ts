/**
 * Claude Status integration GraphQL schema registration.
 *
 * No server-side queries needed — the UI fetches directly from
 * the public status.anthropic.com API (CORS-open, no auth).
 */

import type { SchemaBuilder } from '@tryvienna/sdk';

export function registerClaudeStatusSchema(_builder: SchemaBuilder) {
  // No GraphQL queries registered — status data is fetched
  // directly from the renderer via useClaudeStatus hook.
}
