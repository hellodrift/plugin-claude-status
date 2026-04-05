/**
 * Claude Status API — Anthropic status page (statuspage.io) client.
 *
 * Fetches from https://status.anthropic.com/api/v2/summary.json via
 * hostApi.fetch() so the request runs in the main process, bypassing
 * the renderer's CSP connect-src restriction.
 */

import type { PluginHostApi } from '@tryvienna/sdk';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type StatusIndicator = 'none' | 'minor' | 'major' | 'critical';

export type ComponentStatus =
  | 'operational'
  | 'degraded_performance'
  | 'partial_outage'
  | 'major_outage'
  | 'under_maintenance';

export type IncidentStatus =
  | 'investigating'
  | 'identified'
  | 'monitoring'
  | 'resolved'
  | 'postmortem';

export interface StatusComponent {
  id: string;
  name: string;
  status: ComponentStatus;
  updatedAt: string;
  group: boolean;
  onlyShowIfDegraded: boolean;
}

export interface Incident {
  id: string;
  name: string;
  status: IncidentStatus;
  impact: StatusIndicator;
  shortlink: string;
  updatedAt: string;
}

export interface ClaudeStatusSummary {
  indicator: StatusIndicator;
  description: string;
  updatedAt: string;
  components: StatusComponent[];
  activeIncidents: Incident[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Raw API response shape
// ─────────────────────────────────────────────────────────────────────────────

interface RawSummary {
  page: { updated_at: string };
  status: { indicator: StatusIndicator; description: string };
  components: Array<{
    id: string;
    name: string;
    status: ComponentStatus;
    updated_at: string;
    group: boolean;
    only_show_if_degraded: boolean;
    showcase: boolean;
  }>;
  incidents: Array<{
    id: string;
    name: string;
    status: IncidentStatus;
    impact: StatusIndicator;
    shortlink: string;
    updated_at: string;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchClaudeStatus(hostApi: PluginHostApi): Promise<ClaudeStatusSummary> {
  const res = await hostApi.fetch('https://status.anthropic.com/api/v2/summary.json', {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Status page error: ${res.status}`);

  const raw: RawSummary = JSON.parse(res.body) as RawSummary;

  return {
    indicator: raw.status.indicator,
    description: raw.status.description,
    updatedAt: raw.page.updated_at,
    components: raw.components
      .filter((c) => !c.group)
      .map((c) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        updatedAt: c.updated_at,
        group: c.group,
        onlyShowIfDegraded: c.only_show_if_degraded,
      })),
    activeIncidents: raw.incidents
      .filter((i) => i.status !== 'resolved' && i.status !== 'postmortem')
      .map((i) => ({
        id: i.id,
        name: i.name,
        status: i.status,
        impact: i.impact,
        shortlink: i.shortlink,
        updatedAt: i.updated_at,
      })),
  };
}
