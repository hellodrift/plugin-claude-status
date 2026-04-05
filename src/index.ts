/**
 * @vienna/plugin-claude-status — Claude API status in your menu bar
 *
 * Self-contained plugin package containing:
 * - Integration definition
 * - Entity definitions (none)
 * - GraphQL schema extension
 */

import { definePlugin } from '@tryvienna/sdk';
import { claudeStatusIntegration } from './integration';
import { ClaudeStatusPluginDrawer } from './ui/ClaudeStatusPluginDrawer';
import { ClaudeStatusMenuBarIcon } from './ui/ClaudeStatusMenuBarIcon';
import { ClaudeStatusMenuBarContent } from './ui/ClaudeStatusMenuBarContent';

// TODO: Replace with your plugin's SVG icon
const PLUGIN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>';

// ── Plugin Definition ────────────────────────────────────────────────────────

export const claudeStatusPlugin = definePlugin({
  id: 'claude_status',
  name: 'Claude Status',
  description: 'Claude API status in your menu bar',
  icon: { svg: PLUGIN_SVG },

  allowedDomains: ['status.anthropic.com'],

  integrations: [claudeStatusIntegration],
  entities: [],

  canvases: {
    drawer: {
      component: ClaudeStatusPluginDrawer,
      label: 'Claude Status',
    },
    'menu-bar': {
      icon: ClaudeStatusMenuBarIcon,
      component: ClaudeStatusMenuBarContent,
      label: 'Claude Status',
      priority: 30,
    },
  },
});

// ── Re-exports for direct access ─────────────────────────────────────────────

export { claudeStatusIntegration } from './integration';
export { registerClaudeStatusSchema } from './schema';
