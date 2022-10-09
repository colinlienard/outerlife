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
  entity: Entity;
}

export class CollisionSystem extends System {
  protected readonly requiredComponents = [
    CollisionComponent,
    PositionComponent,
  ];

  private colliders: QuadTree<Leaf> | null = null;

  private collidings: Entity[] = [];

  setEntities(entities: Entity[]) {
    const oldEntities = this.entities;

    super.setEntities(entities);

    // If the entities have not changed, return
    if (
      oldEntities.length === this.entities.length &&
      oldEntities.every((e, i) => e === this.entities[i])
    ) {
      return;
    }

    // Reset
    this.colliders = new QuadTree(
      0,
      0,
      Settings.scene.width,
      Settings.scene.height
    );
    this.collidings = [];

    // Separate colliders and collidings
    this.entities.forEach((entity) => {
      const { type, x, y, width, height } = entity.get(CollisionComponent);
      const { x: positionX, y: positionY } = entity.get(PositionComponent);

      switch (type) {
        case 'damage':
        case 'environment':
        case 'interaction': {
          this.colliders?.add({
            entity,
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
          this.collidings.push(entity);
          return;
        default:
          throw new Error(`Invalid collision type: '${type}'`);
      }
    });
  }

  update() {
    this.collidings.forEach((colliding) => {
      const oPos = colliding.get(PositionComponent);
      const oCol = colliding.get(CollisionComponent);

      this.colliders
        ?.get(oPos.x + oCol.x, oPos.y + oCol.y, oCol.width, oCol.height)
        .forEach((collider) => {
          // Distances between centers
          const distanceX =
            oPos.x +
            oCol.x +
            oCol.width / 2 -
            (collider.x + collider.width / 2);
          const distanceY =
            oPos.y +
            oCol.y +
            oCol.height / 2 -
            (collider.y + collider.height / 2);

          // Minimal distance between centers
          const widthX = oCol.width / 2 + collider.width / 2;
          const widthY = oCol.height / 2 + collider.height / 2;

          // Check if there is a collision
          if (Math.abs(distanceX) < widthX && Math.abs(distanceY) < widthY) {
            switch (collider.type) {
              case 'damage':
                if (colliding.get(LifeComponent)) {
                  Emitter.emit('despawn', colliding);
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
                  oPos.x += distanceX > 0 ? overlapX : -overlapX;
                  return;
                }
                oPos.y += distanceY > 0 ? overlapY : -overlapY;
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
      if (oPos.x < 0 - width) {
        oPos.x = -width;
      } else if (oPos.x > Settings.scene.width - width) {
        oPos.x = Settings.scene.width - width;
      }

      // Scene limits on the y axis
      const height = colliding.has(SpriteComponent)
        ? colliding.get(SpriteComponent).height / 2
        : 0;
      if (oPos.y < 0 - height) {
        oPos.y = -height;
      } else if (oPos.y > Settings.scene.height - height) {
        oPos.y = Settings.scene.height - height;
      }
    });
  }
}
