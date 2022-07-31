/* eslint-disable max-classes-per-file */
import { describe, expect, it } from 'vitest';
import { Collision, Position, Sprite } from '~~/game/components';
import { Entity, Settings } from '~~/game/utils';
import { Collider } from './collider';

class CollidingEnvironment extends Entity {
  constructor() {
    super();
    this.add(new Collision('environment', 0, 0, 10, 10));
    this.add(new Position(20, 0));
  }
}

class CollidingOrganism extends Entity {
  constructor() {
    super();
    this.add(new Collision('organism', 0, 0, 10, 10));
    this.add(new Position(0, 0));
    this.add(new Sprite('', 0, 0, 32, 32));
  }
}

describe('collider system', () => {
  Settings.scene.width = 600;
  Settings.scene.height = 400;

  const environment = new CollidingEnvironment();
  const organism = new CollidingOrganism();
  const organismPosition = organism.get(Position);

  const collider = new Collider() as any;

  it('should separate organisms and environments', () => {
    collider.setEntities([environment, organism]);

    expect(collider.colliders.items.length).toBe(1); // is a quadtree
    expect(collider.organisms.length).toBe(1); // is just an array
  });

  it('should not collide', () => {
    collider.update();

    expect(organismPosition.x).toBe(0);
    expect(organismPosition.y).toBe(0);
  });

  it('should collide and block the organism', () => {
    organismPosition.x = 15;
    collider.update();

    expect(organismPosition.x).toBe(10);
    expect(organismPosition.y).toBe(0);
  });

  it('should not go outside of the scene boundaries', () => {
    // top left
    organismPosition.x = -10;
    organismPosition.y = -10;
    collider.update();

    expect(organismPosition.x).not.toBeGreaterThan(0);
    expect(organismPosition.y).not.toBeGreaterThan(0);

    // bottom right
    organismPosition.x = 700;
    organismPosition.y = 500;
    collider.update();

    expect(organismPosition.x).toBe(600 - 32 / 2);
    expect(organismPosition.y).toBe(400 - 32 / 2);
  });
});
