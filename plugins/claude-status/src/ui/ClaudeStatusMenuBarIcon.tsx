/**
 * ClaudeStatusMenuBarIcon — Menu bar indicator for Claude's status.
 *
 * Shows a colored dot + "Claude" label. Dot color reflects the current
 * status indicator: green (all good), amber (minor), orange (major), red (critical).
 */

import type { MenuBarIconProps } from '@tryvienna/sdk';
import { useClaudeStatus, indicatorColor } from './useClaudeStatus';

export function ClaudeStatusMenuBarIcon({ hostApi }: MenuBarIconProps) {
  const { summary, loading } = useClaudeStatus(hostApi);

  const color = loading || !summary
    ? '#9ca3af' // gray while loading
    : indicatorColor(summary.indicator);

  return (
    <span className="flex items-center gap-1 text-[11px] font-medium">
      <span
        style={{
          display: 'inline-block',
          width: 7,
          height: 7,
          borderRadius: '50%',
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
      <span>Claude</span>
    </span>
  );
}
