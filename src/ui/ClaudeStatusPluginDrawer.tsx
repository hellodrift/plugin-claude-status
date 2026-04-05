/**
 * ClaudeStatusPluginDrawer — Full status breakdown in the drawer.
 *
 * Routes:
 * - default / 'status' → full status breakdown
 */

import { DrawerBody } from '@tryvienna/ui';
import type { PluginDrawerCanvasProps } from '@tryvienna/sdk';
import {
  useClaudeStatus,
  indicatorColor,
  componentStatusLabel,
  componentStatusColor,
} from './useClaudeStatus';

export function ClaudeStatusPluginDrawer({ hostApi }: PluginDrawerCanvasProps) {
  const { summary, loading, error, refetch, lastFetched } = useClaudeStatus(hostApi);

  return (
    <DrawerBody>
      <div className="flex flex-col gap-4 p-4">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Claude Status
          </span>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none"
            onClick={() => void refetch()}
            aria-label="Refresh"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
          </button>
        </div>

        {loading && !summary && (
          <div className="flex items-center justify-center py-8">
            <span className="text-xs text-muted-foreground">Checking status…</span>
          </div>
        )}

        {error && !summary && (
          <div className="flex flex-col gap-2">
            <span className="text-xs text-destructive">{error}</span>
            <button
              type="button"
              className="text-xs text-primary cursor-pointer hover:underline text-left bg-transparent border-none"
              onClick={() => void refetch()}
            >
              Try again
            </button>
          </div>
        )}

        {summary && (
          <>
            {/* ── Overall status pill ── */}
            <div
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{ backgroundColor: `${indicatorColor(summary.indicator)}15` }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: indicatorColor(summary.indicator),
                  flexShrink: 0,
                }}
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">{summary.description}</span>
                {lastFetched && (
                  <span className="text-[10px] text-muted-foreground">
                    Updated {lastFetched.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            </div>

            {/* ── Components ── */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Components
              </span>
              {summary.components.map((component) => (
                <div
                  key={component.id}
                  className="flex items-center justify-between px-2 py-1.5 rounded-md"
                  style={{ backgroundColor: 'var(--background-secondary, rgba(0,0,0,0.03))' }}
                >
                  <span className="text-xs text-foreground">{component.name}</span>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
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
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Active Incidents
                </span>
                {summary.activeIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="flex flex-col gap-1 p-3 rounded-lg border border-border"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium text-foreground">{incident.name}</span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
                        style={{
                          color: indicatorColor(incident.impact),
                          backgroundColor: `${indicatorColor(incident.impact)}20`,
                        }}
                      >
                        {incident.impact}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground capitalize">{incident.status}</span>
                  </div>
                ))}
              </div>
            )}

          </>
        )}
      </div>
    </DrawerBody>
  );
}
