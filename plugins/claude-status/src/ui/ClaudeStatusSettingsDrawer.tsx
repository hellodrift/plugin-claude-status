/**
 * ClaudeStatusSettingsDrawer — Settings panel for the Claude Status plugin.
 *
 * Rendered inside ClaudeStatusPluginDrawer when payload.view === 'settings'.
 */


import {
  ContentSection,
  Button,
  Input,
  Label,
} from '@tryvienna/ui';
import type { PluginHostApi, CanvasLogger } from '@tryvienna/sdk';
import { useClaudeStatusSettings } from './useClaudeStatusSettings';

interface Props {
  hostApi: PluginHostApi;
  logger: CanvasLogger;
}

export function ClaudeStatusSettingsDrawer({ hostApi, logger }: Props) {
  const { settings, updateSettings, resetSettings } = useClaudeStatusSettings();

  return (
    <div className="flex flex-col gap-4 p-4">
      <h3 className="text-sm font-medium">Claude Status Settings</h3>

      <ContentSection title="Preferences">
        <div className="flex flex-col gap-2">
          <Label htmlFor="limit">Max items</Label>
          <Input
            id="limit"
            type="number"
            value={settings.limit}
            onChange={(e) => updateSettings({ limit: Number(e.target.value) || 20 })}
            className="w-20"
          />
        </div>
      </ContentSection>

      <Button variant="outline" size="sm" onClick={resetSettings}>
        Reset to defaults
      </Button>
    </div>
  );
}
