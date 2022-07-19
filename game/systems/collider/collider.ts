import { Collision, Position, Sprite } from '~~/game/components';
import { Interaction } from '~~/game/entities';
import { TILE_SIZE } from '~~/game/globals';
import { Settings } from '~~/game/settings';
import { Entity, QuadTree, System } from '~~/game/utils';

interface Leaf extends Collision {
  entity: Entity;
}

export class Collider extends System {
  readonly requiredComponents = [Collision, Position];

  colliders: QuadTree<Leaf> | null = null;

  organisms: Entity[] = [];

  setEntities(entities: Entity[]) {
    super.setEntities(entities);

    this.colliders = new QuadTree(
      0,
      0,
      Settings.scene.columns * TILE_SIZE,
      Settings.scene.rows * TILE_SIZE
    );
    this.organisms = [];

    this.entities.forEach((entity) => {
      const { type, x, y, width, height } = entity.get(Collision);
      const { x: positionX, y: positionY } = entity.get(Position);

      switch (type) {
        case 'environment':
        case 'interaction': {
          const collider = {
            entity,
            type,
            x: x + positionX,
            y: y + positionY,
            width,
            height,
          };
          this.colliders?.add(collider);
          return;
        }
        case 'organism':
          this.organisms.push(entity);
          return;
        default:
          throw new Error(`Invalid collision type: '${type}'`);
      }
    });
  }

  update() {
    this.organisms.forEach((organism) => {
      const oPos = organism.get(Position);
      const oCol = organism.get(Collision);

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
            // If the collision needs to block the organism
            if (collider.type === 'environment') {
              const overlapX = widthX - Math.abs(distanceX);
              const overlapY = widthY - Math.abs(distanceY);

              // Remove overlap
              if (overlapX < overlapY) {
                oPos.x += distanceX > 0 ? overlapX : -overlapX;
                return;
              }
              oPos.y += distanceY > 0 ? overlapY : -overlapY;
              return;
            }

            // Else, execute an interaction
            const interaction = collider.entity as Interaction;
            if (!interaction.entered) {
              interaction.enter();
              interaction.entered = true;
            }
          }
        });

      // Scene limits on the x axis
      const width = organism.has(Sprite) ? organism.get(Sprite).width / 2 : 0;
      if (oPos.x < 0 - width) {
        oPos.x = -width;
      } else if (oPos.x > Settings.scene.columns * TILE_SIZE - width) {
        oPos.x = Settings.scene.columns * TILE_SIZE - width;
      }

      // Scene limits on the y axis
      const height = organism.has(Sprite) ? organism.get(Sprite).height / 2 : 0;
      if (oPos.y < 0 - height) {
        oPos.y = -height;
      } else if (oPos.y > Settings.scene.rows * TILE_SIZE - height) {
        oPos.y = Settings.scene.rows * TILE_SIZE - height;
      }
    });
  }
}
