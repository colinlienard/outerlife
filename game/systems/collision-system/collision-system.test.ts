/* eslint-disable max-classes-per-file */
import { describe, expect, it } from 'vitest';
import {
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity, Settings } from '~~/game/utils';
import { CollisionSystem } from './collision-system';

class CollidingEnvironment extends Entity {
  constructor() {
    super();
    this.add(new CollisionComponent('environment', 0, 0, 10, 10));
    this.add(new PositionComponent(20, 0));
  }
}

class CollidingOrganism extends Entity {
  constructor() {
    super();
    this.add(new CollisionComponent('organism', 0, 0, 10, 10));
    this.add(new PositionComponent(0, 0));
    this.add(new SpriteComponent('', 0, 0, 32, 32));
  }
}

describe('collisionSystem system', () => {
  Settings.scene.width = 600;
  Settings.scene.height = 400;

  const environment = new CollidingEnvironment();
  const organism = new CollidingOrganism();
  const organismPosition = organism.get(PositionComponent);

  const collisionSystem = new CollisionSystem() as any;

  it('should separate organisms and environments', () => {
    collisionSystem.setEntities([environment, organism]);

    expect(collisionSystem.collisionSystems.items.length).toBe(1); // is a quadtree
    expect(collisionSystem.collidings.length).toBe(1); // is just an array
  });

  it('should not collide', () => {
    collisionSystem.update();

    expect(organismPosition.x).toBe(0);
    expect(organismPosition.y).toBe(0);
  });

  it('should collide and block the organism', () => {
    organismPosition.x = 15;
    collisionSystem.update();

    expect(organismPosition.x).toBe(10);
    expect(organismPosition.y).toBe(0);
  });

  it('should not go outside of the scene boundaries', () => {
    // top left
    organismPosition.x = -10;
    organismPosition.y = -10;
    collisionSystem.update();

    expect(organismPosition.x).not.toBeGreaterThan(0);
    expect(organismPosition.y).not.toBeGreaterThan(0);

    // bottom right
    organismPosition.x = 700;
    organismPosition.y = 500;
    collisionSystem.update();

    expect(organismPosition.x).toBe(600 - 32 / 2);
    expect(organismPosition.y).toBe(400 - 32 / 2);
  });
});