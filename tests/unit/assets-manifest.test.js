import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('assets manifest', () => {
  it('maps Hero Upgrade Defense Upgrade to the dedicated defense assets', async () => {
    const manifestPath = path.resolve(process.cwd(), 'Assets/manifest.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    const defense = manifest?.['Hero Upgrade']?.['Defense Upgrade'];

    expect(defense).toBeTruthy();
    expect(defense.border).toBe('Assets/Hero Upgrade/Defense Upgrade/Hero_Upgrade_Defensive_Frame.png');
    expect(defense.backgroundLower).toBe('Assets/Hero Upgrade/Defense Upgrade/Hero_Upgrade_Defensive_Background.png');
    expect(defense.backgroundUpper).toBe('');
    expect(defense.frameShading).toBe('Assets/Hero Upgrade/Defense Upgrade/Hero_Upgrade_Defensive_Frame_Shadow.png');
    expect(defense.panelBleed).toBe('Assets/Hero Upgrade/Defense Upgrade/Hero_Upgrade_Defensive_Panel_bleed.png');
    expect(defense.panelLower).toBe('Assets/Hero Upgrade/Defense Upgrade/Hero_Upgrade_Defensive_Panel_lower.png');
    expect(defense.panelUpper).toBe('Assets/Hero Upgrade/Defense Upgrade/Hero_Upgrade_Defensive_Panel_Upper.png');
  });

  it('includes asset sets for all Board Abilities subtypes', async () => {
    const manifestPath = path.resolve(process.cwd(), 'Assets/manifest.json');
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    const boardAbilities = manifest?.['Board Abilities'];
    const expectedKeys = ['Offensive ability', 'Passive Ability', 'Defensive ability', 'Ultimate Ability'];

    expectedKeys.forEach((key) => {
      const entry = boardAbilities?.[key];
      expect(entry).toBeTruthy();
    });

    const offensive = boardAbilities?.['Offensive ability'];
    expect(offensive.templateSize).toEqual({ width: 687, height: 1041 });
    expect(offensive.workingZone).toBe('Assets/Board Abilities/working_zone.png');
    expect(offensive.bleedRatio).toBe(0);
    expect(offensive.cardBleed).toBe('');
    expect(offensive.border).toBe('Assets/Board Abilities/ability_boarder.png');
    expect(offensive.backgroundLower).toBe('Assets/Board Abilities/basic_backgound.png');
    expect(offensive.backgroundUpper).toBe('');
    expect(offensive.topNameGradient).toBe('Assets/Board Abilities/color_boarder.png');
    expect(offensive.cardId).toBe('');

    const passive = boardAbilities?.['Passive Ability'];
    expect(passive.templateSize).toEqual({ width: 687, height: 1041 });
    expect(passive.workingZone).toBe('Assets/Board Abilities/working_zone.png');
    expect(passive.cardBleed).toBe('');
    expect(passive.border).toBe('Assets/Board Abilities/ability_boarder.png');
    expect(passive.backgroundLower).toBe('Assets/Board Abilities/basic_backgound.png');
    expect(passive.backgroundUpper).toBe('Assets/Board Abilities/Passive Abilities/passive_icon.png');
    expect(passive.topNameGradient).toBe('Assets/Board Abilities/color_boarder.png');

    const defensive = boardAbilities?.['Defensive ability'];
    expect(defensive.templateSize).toEqual({ width: 687, height: 1041 });
    expect(defensive.workingZone).toBe('Assets/Board Abilities/working_zone.png');
    expect(defensive.cardBleed).toBe('');
    expect(defensive.border).toBe('Assets/Board Abilities/ability_boarder.png');
    expect(defensive.backgroundLower).toBe('Assets/Board Abilities/Defensive Abilities/Defensive_background.png');
    expect(defensive.backgroundUpper).toBe('');
    expect(defensive.topNameGradient).toBe('Assets/Board Abilities/color_boarder.png');

    const ultimate = boardAbilities?.['Ultimate Ability'];
    expect(ultimate.templateSize).toEqual({ width: 1410, height: 2116 });
    expect(ultimate.workingZone).toBe('Assets/Board Abilities/Ultimate Ability/Ult_frame.png');
    expect(ultimate.border).toBe('Assets/Board Abilities/Ultimate Ability/Ult_frame.png');
    expect(ultimate.backgroundLower).toBe('Assets/Board Abilities/Ultimate Ability/Ult_background.png');
    expect(ultimate.topNameGradient).toBe('Assets/Board Abilities/Ultimate Ability/Ult_color_boarder.png');
  });
});

describe('render worker asset', () => {
  it('defines worker composition handlers', async () => {
    const workerPath = path.resolve(process.cwd(), 'js/renderWorker.js');
    const source = await readFile(workerPath, 'utf8');

    expect(source).toContain('compose-deck');
    expect(source).toContain('compose-print-pages');
    expect(source).toContain('OffscreenCanvas');
  });
});

describe('status effect commands', () => {
  it('supports leaflet status commands at 5.1 times normal status scale', async () => {
    const rendererPath = path.resolve(process.cwd(), 'js/cardRenderer.js');
    const uiPath = path.resolve(process.cwd(), 'js/ui.js');
    const rendererSource = await readFile(rendererPath, 'utf8');
    const uiSource = await readFile(uiPath, 'utf8');

    expect(rendererSource).toContain("if (modifier === 'leaflet') return this.statusEffectIconScale * 5.1;");
    expect(uiSource).toContain("leafletCommand: `{{${key},leaflet}}`");
  });
});
