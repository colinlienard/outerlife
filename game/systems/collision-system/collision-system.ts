import {
  AIComponent,
  ColliderType,
  CollisionComponent,
  HealthComponent,
  MovementComponent,
  PositionComponent,
  SpriteComponent,
  StateMachineComponent,
} from '~~/game/components';
import { Interaction, Player } from '~~/game/entities';
import {
  Emitter,
  Entity,
  getAngleFromPoints,
  QuadTree,
  Settings,
  System,
} from '~~/game/utils';

type Leaf =
  | {
      id: number;
      type: Exclude<
        ColliderType,
        'damage-ai' | 'damage-player' | 'interaction'
      >;
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      id: number;
      type: Extract<ColliderType, 'damage-player' | 'damage-ai'>;
      x: number;
      y: number;
      width: number;
      height: number;
      damages: number;
    }
  | {
      id: number;
      type: 'interaction';
      x: number;
      y: number;
      width: number;
      height: number;
      interaction: Interaction;
    };

export class CollisionSystem extends System {
  protected readonly requiredComponents = [
    CollisionComponent,
    PositionComponent,
  ];

  private colliders: QuadTree<Leaf> = new QuadTree(
    0,
    0,
    Settings.scene.width,
    Settings.scene.height
  );

  private collidings: Map<number, Entity> = new Map();

  add(entity: Entity) {
    super.add(entity);

    const { x: positionX, y: positionY } = entity.get(PositionComponent);
    const { collisions } = entity.get(CollisionComponent);

    collisions.forEach((collision, index) => {
      const { type, x, y } = collision;
      const { id: entityId } = entity;
      const id = entityId + index * 1000;

      switch (type) {
        case 'environment':
          this.colliders.add({
            ...collision,
            id,
            type,
            x: x + positionX,
            y: y + positionY,
          });
          return;

        case 'interaction':
          this.colliders.add({
            ...collision,
            id,
            type,
            x: x + positionX,
            y: y + positionY,
            interaction: entity as Interaction,
          });
          return;

        case 'damage-player':
        case 'damage-ai':
          this.colliders.add({
            ...collision,
            id,
            type,
            x: x + positionX,
            y: y + positionY,
            damages: collision.damages,
          });
          return;

        case 'hitbox':
        case 'player-hurtbox':
        case 'ai-hurtbox':
          if (this.collidings.has(id)) {
            return;
          }

          this.collidings.set(id, entity);
          return;

        default:
          throw new Error(`Invalid collision type: '${type}'`);
      }
    });
  }

  delete(id: number) {
    if (super.delete(id)) {
      if (!this.colliders.delete(id)) {
        this.collidings.delete(id);
      }
    }
  }

  reset() {
    this.colliders.reset(0, 0, Settings.scene.width, Settings.scene.height);
    this.collidings = new Map();
  }

  update() {
    this.collidings.forEach((colliding) => {
      const pos = colliding.get(PositionComponent);
      const { collisions } = colliding.get(CollisionComponent);

      collisions.forEach((col) => {
        this.colliders
          .get(pos.x + col.x, pos.y + col.y, col.width, col.height)
          .forEach((collider) => {
            // Distances between centers
            const distanceX =
              pos.x + col.x + col.width / 2 - (collider.x + collider.width / 2);
            const distanceY =
              pos.y +
              col.y +
              col.height / 2 -
              (collider.y + collider.height / 2);

            // Minimal distance between centers
            const widthX = col.width / 2 + collider.width / 2;
            const widthY = col.height / 2 + collider.height / 2;

            if (
              Math.abs(distanceX) >= widthX ||
              Math.abs(distanceY) >= widthY
            ) {
              return;
            }

            // If there is a collision

            // Handle regular collisions
            if (col.type === 'hitbox') {
              switch (collider.type) {
                case 'environment': {
                  // If the entity is an AI, reset its wander target
                  if (
                    colliding.has(AIComponent) &&
                    colliding.get(StateMachineComponent).get() !== 'hit'
                  ) {
                    colliding.get(AIComponent).setWanderTarget();
                  }

                  const overlapX = widthX - Math.abs(distanceX);
                  const overlapY = widthY - Math.abs(distanceY);

                  // Remove overlap
                  if (overlapX < overlapY) {
                    pos.x += distanceX > 0 ? overlapX : -overlapX;
                    return;
                  }
                  pos.y += distanceY > 0 ? overlapY : -overlapY;
                  return;
                }
                case 'interaction': {
                  if (colliding instanceof Player) {
                    const { interaction } = collider;
                    if (!interaction.entered) {
                      interaction.enter();
                      interaction.entered = true;
                    }
                  }
                  return;
                }
                default:
                  return;
              }
            }

            // Handle player or ai gets hurt
            if (
              (col.type === 'player-hurtbox' &&
                collider.type === 'damage-player') ||
              (col.type === 'ai-hurtbox' && collider.type === 'damage-ai')
            ) {
              const stateMachine = colliding.get(StateMachineComponent);

              if (stateMachine.is(['hit', 'dead'])) {
                return;
              }

              // Make the sprite flash white
              colliding.get(SpriteComponent).setHit();

              Emitter.emit('hit');

              // Set angle for repulsing the hit entity
              colliding.get(MovementComponent).angle = getAngleFromPoints(
                pos.x + col.x + col.width / 2,
                pos.y + col.y + col.height / 2,
                collider.x + collider.width / 2,
                collider.y + collider.height / 2
              );

              // Decrease entity's health and set dead state if health = 0
              if (colliding.get(HealthComponent).damage(collider.damages)) {
                stateMachine.set('dead');
                return;
              }

              stateMachine.set('hit');
            }
          });
      });

      // Scene limits on the x axis
      const width = colliding.has(SpriteComponent)
        ? colliding.get(SpriteComponent).width
        : 0;
      if (pos.x < 0) {
        pos.x = 0;
      } else if (pos.x > Settings.scene.width - width) {
        pos.x = Settings.scene.width - width;
      }

      // Scene limits on the y axis
      const height = colliding.has(SpriteComponent)
        ? colliding.get(SpriteComponent).height
        : 0;
      if (pos.y < 0 - height / 2) {
        pos.y = -height / 2;
      } else if (pos.y > Settings.scene.height - height) {
        pos.y = Settings.scene.height - height;
      }
    });
  }
}
