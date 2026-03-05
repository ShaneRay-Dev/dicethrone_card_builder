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
    const expectedKeys = ['Offensive ability', 'Passive Ability', 'Defensive ability'];

    expectedKeys.forEach((key) => {
      const entry = boardAbilities?.[key];
      expect(entry).toBeTruthy();
    });

    const offensive = boardAbilities?.['Offensive ability'];
    expect(offensive.cardBleed).toBe('');
    expect(offensive.border).toBe('Assets/Board/offensive Ability/Standard_ability_border.png');
    expect(offensive.backgroundLower).toBe('Assets/Board/offensive Ability/Standard_ability_background.png');
    expect(offensive.backgroundUpper).toBe('Assets/Board/offensive Ability/Standard_ability_corner.png');
    expect(offensive.topNameGradient).toBe('Assets/Board/offensive Ability/Standard_ability_graident.png');
    expect(offensive.cardId).toBe('');

    const passive = boardAbilities?.['Passive Ability'];
    expect(passive.cardBleed).toBe('Assets/Action Cards/card_bleed.png');
    expect(passive.border).toBe('Assets/Action Cards/Main Phase/Main Action Frame.png');

    const defensive = boardAbilities?.['Defensive ability'];
    expect(defensive.cardBleed).toBe('Assets/Action Cards/card_bleed.png');
    expect(defensive.border).toBe('Assets/Action Cards/Main Phase/Main Action Frame.png');
  });
});
