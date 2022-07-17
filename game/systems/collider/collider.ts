import { Collision, Position, Sprite } from '~~/game/components';
import { Interaction } from '~~/game/entities';
import { TILE_SIZE } from '~~/game/globals';
import { Settings } from '~~/game/settings';
import { Entity, System } from '~~/game/utils';

export class Collider extends System {
  readonly requiredComponents = [Collision, Position];

  environments: Entity[] = [];

  interactions: Interaction[] = [];

  organisms: Entity[] = [];

  setEntities(entities: Entity[]) {
    super.setEntities(entities);

    this.entities.forEach((entity) => {
      const { type } = entity.get(Collision);

      switch (type) {
        case 'environment':
          this.environments.push(entity);
          return;
        case 'interaction':
          this.interactions.push(entity as Interaction);
          return;
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

      // Handle collisions with environments
      this.environments.forEach((environment) => {
        const ePos = environment.get(Position);
        const eCol = environment.get(Collision);

        // Distances between centers
        const distanceX =
          oPos.x + oCol.x + oCol.width / 2 - (ePos.x + eCol.x + eCol.width / 2);
        const distanceY =
          oPos.y +
          oCol.y +
          oCol.height / 2 -
          (ePos.y + eCol.y + eCol.height / 2);

        // Minimal distance between centers
        const widthX = oCol.width / 2 + eCol.width / 2;
        const widthY = oCol.height / 2 + eCol.height / 2;

        // Check if there is a collision
        if (Math.abs(distanceX) < widthX && Math.abs(distanceY) < widthY) {
          const overlapX = widthX - Math.abs(distanceX);
          const overlapY = widthY - Math.abs(distanceY);

          // Remove overlap
          if (overlapX < overlapY) {
            oPos.x += distanceX > 0 ? overlapX : -overlapX;
            return;
          }
          oPos.y += distanceY > 0 ? overlapY : -overlapY;
        }
      });

      // Handle collisions with interactions
      this.interactions.forEach((interaction) => {
        const iPos = interaction.get(Position);
        const iCol = interaction.get(Collision);

        if (
          oPos.x + oCol.x + oCol.width > iPos.x &&
          oPos.x + oCol.x < iPos.x + iCol.width &&
          oPos.y + oCol.y + oCol.height > iPos.y &&
          oPos.y + oCol.y < iPos.y + iCol.height
        ) {
          if (!interaction.entered) {
            interaction.entered = true;
            console.log('enter');

            // this.interact(interaction.enter);
          }
        } else if (interaction.entered) {
          interaction.entered = false;
          console.log('leave');

          // if (interaction.leave) {
          // this.interact(interaction.leave);
          // }
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
