import {
  AIComponent,
  CollisionComponent,
  LifeComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Interaction } from '~~/game/entities';
import { Emitter, Entity, QuadTree, Settings, System } from '~~/game/utils';

interface Leaf extends CollisionComponent {
  id: number;
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

    const { type, x, y, width, height } = entity.get(CollisionComponent);
    const { x: positionX, y: positionY } = entity.get(PositionComponent);

    switch (type) {
      case 'damage':
      case 'environment':
      case 'interaction': {
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
      case 'alive':
      case 'organism':
        this.collidings.set(entity.id, entity);
        return;
      default:
        throw new Error(`Invalid collision type: '${type}'`);
    }
  }

  delete(id: number) {
    if (super.delete(id)) {
      if (!this.colliders.delete(id)) {
        this.collidings.delete(id);
      }
    }
  }

  reset() {
    this.colliders = new QuadTree(
      0,
      0,
      Settings.scene.width,
      Settings.scene.height
    );
    this.collidings = new Map();
  }

  update() {
    this.collidings.forEach((colliding) => {
      const pos = colliding.get(PositionComponent);
      const col = colliding.get(CollisionComponent);

      this.colliders
        .get(pos.x + col.x, pos.y + col.y, col.width, col.height)
        .forEach((collider) => {
          // Distances between centers
          const distanceX =
            pos.x + col.x + col.width / 2 - (collider.x + collider.width / 2);
          const distanceY =
            pos.y + col.y + col.height / 2 - (collider.y + collider.height / 2);

          // Minimal distance between centers
          const widthX = col.width / 2 + collider.width / 2;
          const widthY = col.height / 2 + collider.height / 2;

          // Check if there is a collision
          if (Math.abs(distanceX) < widthX && Math.abs(distanceY) < widthY) {
            switch (collider.type) {
              case 'damage':
                if (colliding.get(LifeComponent)) {
                  Emitter.emit('despawn', colliding.id);
                }
                break;

              // The collision blocks the organism
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

              // Execute an interaction
              case 'interaction': {
                const interaction = collider.entity as Interaction;
                if (!interaction.entered) {
                  interaction.enter();
                  interaction.entered = true;
                }
                break;
              }
              default:
                break;
            }
          }
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
