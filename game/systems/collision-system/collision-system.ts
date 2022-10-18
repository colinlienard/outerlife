import {
  AIComponent,
  ColliderType,
  CollisionComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Interaction, Player } from '~~/game/entities';
import { Box, Entity, QuadTree, Settings, System } from '~~/game/utils';

interface Leaf extends Box {
  id: number;
  type: ColliderType;
  entity: Entity;
}

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

    collisions.forEach(({ type, x, y, width, height }) => {
      switch (type) {
        case 'environment':
        case 'interaction':
        case 'damage-player':
        case 'damage-ai': {
          this.colliders.add({
            entity,
            id: entity.id,
            type,
            x: x + positionX,
            y: y + positionY,
            width,
            height,
          });
          return;
        }

        case 'hitbox':
        case 'player-hurtbox':
        case 'ai-hurtbox':
          if (this.collidings.has(entity.id)) {
            return;
          }

          this.collidings.set(entity.id, entity);
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
            switch (col.type) {
              // Handle regular collisions
              case 'hitbox':
                switch (collider.type) {
                  case 'environment': {
                    // If the entity is an AI, reset its wander target
                    if (colliding.has(AIComponent)) {
                      colliding.get(AIComponent).target = null;
                    }

                    const overlapX = widthX - Math.abs(distanceX);
                    const overlapY = widthY - Math.abs(distanceY);

                    // Remove overlap
                    if (overlapX < overlapY) {
                      pos.x += distanceX > 0 ? overlapX : -overlapX;
                      return;
                    }
                    pos.y += distanceY > 0 ? overlapY : -overlapY;
                    break;
                  }
                  case 'interaction': {
                    if (colliding instanceof Player) {
                      const interaction = collider.entity as Interaction;
                      if (!interaction.entered) {
                        interaction.enter();
                        interaction.entered = true;
                      }
                    }
                    break;
                  }
                  default:
                    break;
                }
                break;

              // Handle player gets hurt
              case 'player-hurtbox':
                break;

              // Handle ai gets hurt
              case 'ai-hurtbox':
                break;

              default:
                break;
            }
          });
      });

      // Scene limits on the x axis
      const width = colliding.has(SpriteComponent)
        ? colliding.get(SpriteComponent).width / 2
        : 0;
      if (pos.x < 0 - width) {
        pos.x = -width;
      } else if (pos.x > Settings.scene.width - width) {
        pos.x = Settings.scene.width - width;
      }

      // Scene limits on the y axis
      const height = colliding.has(SpriteComponent)
        ? colliding.get(SpriteComponent).height / 2
        : 0;
      if (pos.y < 0 - height) {
        pos.y = -height;
      } else if (pos.y > Settings.scene.height - height) {
        pos.y = Settings.scene.height - height;
      }
    });
  }
}
