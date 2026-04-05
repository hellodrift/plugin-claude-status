/**
 * ClaudeStatusMenuBarContent — Popover showing Claude's status breakdown.
 *
 * Displays overall status, per-component health, and any active incidents.
 */

import type { MenuBarCanvasProps } from '@tryvienna/sdk';
import {
  useClaudeStatus,
  indicatorColor,
  componentStatusLabel,
  componentStatusColor,
} from './useClaudeStatus';

export function ClaudeStatusMenuBarContent({ onClose, hostApi }: MenuBarCanvasProps) {
  const { summary, loading, error, refetch, lastFetched } = useClaudeStatus(hostApi);

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center p-4 w-72">
        <span className="text-xs text-muted-foreground">Checking status…</span>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="flex flex-col gap-2 p-3 w-72">
        <span className="text-xs text-destructive">Failed to load status</span>
        <button
          type="button"
          className="text-xs text-primary cursor-pointer hover:underline text-left bg-transparent border-none"
          onClick={() => void refetch()}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!summary) return null;

  const dotColor = indicatorColor(summary.indicator);

  return (
    <div className="flex flex-col gap-3 p-3" style={{ minWidth: 300 }}>
      {/* ── Overall status ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: dotColor,
              flexShrink: 0,
            }}
          />
          <span className="text-sm font-semibold">{summary.description}</span>
        </div>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none"
          onClick={() => void refetch()}
          aria-label="Refresh status"
          title="Refresh"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </button>
      </div>

      <div className="border-t border-border" />

      {/* ── Component breakdown ── */}
      <div className="flex flex-col gap-0.5">
        {summary.components.map((component) => (
          <div key={component.id} className="flex items-center justify-between px-1 py-0.5">
            <span className="text-xs text-foreground">{component.name}</span>
            <span
              className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
              style={{
                color: componentStatusColor(component.status),
                backgroundColor: `${componentStatusColor(component.status)}20`,
              }}
            >
              {componentStatusLabel(component.status)}
            </span>
          </div>
        ))}
      </div>

      {/* ── Active incidents ── */}
      {summary.activeIncidents.length > 0 && (
        <>
          <div className="border-t border-border" />
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Active Incidents
            </span>
            {summary.activeIncidents.map((incident) => (
              <div key={incident.id} className="flex flex-col gap-0.5">
                <span className="text-xs text-foreground">{incident.name}</span>
                <span className="text-[10px] text-muted-foreground capitalize">{incident.status}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Last updated ── */}
      {lastFetched && (
        <span className="text-[10px] text-muted-foreground text-center">
          Updated {lastFetched.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
}
