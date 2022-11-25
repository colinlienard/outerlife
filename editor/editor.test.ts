import { describe, expect, it } from 'vitest';
import { Editor } from './editor';

describe('editor', () => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const editor = new Editor(canvas, 20, 20, 1, false) as any;

  it('should place a terrain', () => {
    editor.placeTerrain(5, 8, 0);

    expect(editor.terrains[8 * 20 + 5]).toBe(0);
  });

  it('should place an entity', () => {
    editor.placeEntity(50, 50, 0, 'environment');

    expect(editor.entities.length).toBe(1);
  });

  it('should select an entity', () => {
    const entity = editor.selectEntity(50, 50, 'environment');

    expect(entity).not.toBeNull();
  });

  it('should update an entity', () => {
    editor.updateEntity(100, 150, 0);

    expect(editor.entities[0].data[0]).toBe(100);
    expect(editor.entities[0].data[1]).toBe(150);
  });

  it('should delete an entity', () => {
    editor.deleteEntity(0);

    expect(editor.entities.length).toBe(0);
  });

  it('should place an interaction', () => {
    editor.placeInteraction(50, 50);

    expect(editor.interactions.length).toBe(1);
  });

  it('should select an interaction', () => {
    const interaction = editor.selectInteraction(50, 50);

    expect(interaction).not.toBeNull();
  });

  it('should update an interaction', () => {
    const interaction = editor.selectInteraction(50, 50);
    editor.updateInteraction(
      { ...interaction, x: 100, height: 20 },
      interaction.index
    );

    expect(editor.interactions[0].x).toBe(100);
    expect(editor.interactions[0].height).toBe(20);
  });

  it('should delete an interaction', () => {
    editor.deleteInteraction(0);

    expect(editor.interactions.length).toBe(0);
  });

  it('should add and remove rows', () => {
    editor.updateSettings(30, 20, 1, { x: 0, y: 0 }, true, true);
    editor.updateSettings(40, 20, 1, { x: 0, y: 0 }, true, false);

    expect(editor.terrains.length).toBe(40 * 20);

    editor.updateSettings(30, 20, 1, { x: 0, y: 0 }, true, true);
    editor.updateSettings(20, 20, 1, { x: 0, y: 0 }, true, false);

    expect(editor.terrains.length).toBe(20 * 20);
  });

  it('should add and remove columns', () => {
    editor.updateSettings(20, 30, 1, { x: 0, y: 0 }, true, true);
    editor.updateSettings(20, 40, 1, { x: 0, y: 0 }, true, false);

    expect(editor.terrains.length).toBe(40 * 20);

    editor.updateSettings(20, 30, 1, { x: 0, y: 0 }, true, true);
    editor.updateSettings(20, 20, 1, { x: 0, y: 0 }, true, false);

    expect(editor.terrains.length).toBe(20 * 20);
  });
});
