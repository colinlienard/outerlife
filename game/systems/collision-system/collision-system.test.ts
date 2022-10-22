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
    this.add(
      new CollisionComponent([
        {
          type: 'environment',
          x: 0,
          y: 0,
          width: 10,
          height: 10,
        },
      ])
    );
    this.add(new PositionComponent(20, 0));
  }
}

class CollidingOrganism extends Entity {
  constructor() {
    super();
    this.add(
      new CollisionComponent([
        {
          type: 'hitbox',
          x: 0,
          y: 0,
          width: 10,
          height: 10,
        },
      ])
    );
    this.add(new PositionComponent(0, 0));
    this.add(new SpriteComponent('', 0, 0, 32, 32));
  }
}

describe('collision system', () => {
  Settings.scene.width = 600;
  Settings.scene.height = 400;

  const environment = new CollidingEnvironment();
  const organism = new CollidingOrganism();
  const organismPosition = organism.get(PositionComponent);

  const collisionSystem = new CollisionSystem() as any;

  it('should separate organisms and environments', () => {
    collisionSystem.check(environment);
    collisionSystem.check(organism);

    expect(collisionSystem.colliders.items.size).toBe(1); // is a quadtree
    expect(collisionSystem.collidings.size).toBe(1); // is just a map
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
