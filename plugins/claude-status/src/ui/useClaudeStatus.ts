/**
 * useClaudeStatus — fetches and auto-refreshes Claude's status page data.
 *
 * Polls https://status.anthropic.com/api/v2/summary.json every 60 seconds.
 * The endpoint is CORS-open so we can call it directly from the renderer.
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchClaudeStatus } from '../api';
import type { ClaudeStatusSummary, StatusIndicator, ComponentStatus } from '../api';
import type { PluginHostApi } from '@tryvienna/sdk';

export type { ClaudeStatusSummary, StatusIndicator, ComponentStatus };

export interface UseClaudeStatusResult {
  summary: ClaudeStatusSummary | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  lastFetched: Date | null;
}

const POLL_INTERVAL_MS = 60_000;

export function useClaudeStatus(hostApi: PluginHostApi): UseClaudeStatusResult {
  const [summary, setSummary] = useState<ClaudeStatusSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClaudeStatus(hostApi);
      setSummary(data);
      setLastFetched(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status');
    } finally {
      setLoading(false);
    }
  }, [hostApi]);

  useEffect(() => {
    void load();
    const timer = setInterval(() => void load(), POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [load]);

  return { summary, loading, error, refetch: load, lastFetched };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers exported for UI use
// ─────────────────────────────────────────────────────────────────────────────

export function indicatorColor(indicator: StatusIndicator): string {
  switch (indicator) {
    case 'none': return '#22c55e';    // green-500
    case 'minor': return '#f59e0b';   // amber-500
    case 'major': return '#f97316';   // orange-500
    case 'critical': return '#ef4444'; // red-500
    default: return '#6b7280';        // gray-500
  }
}

export function componentStatusLabel(status: ComponentStatus): string {
  switch (status) {
    case 'operational': return 'Operational';
    case 'degraded_performance': return 'Degraded';
    case 'partial_outage': return 'Partial Outage';
    case 'major_outage': return 'Major Outage';
    case 'under_maintenance': return 'Maintenance';
    default: return status;
  }
}

export function componentStatusColor(status: ComponentStatus): string {
  switch (status) {
    case 'operational': return '#22c55e';
    case 'degraded_performance': return '#f59e0b';
    case 'partial_outage': return '#f97316';
    case 'major_outage': return '#ef4444';
    case 'under_maintenance': return '#3b82f6';
    default: return '#6b7280';
  }
}

