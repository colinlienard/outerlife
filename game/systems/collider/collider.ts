import { Collision, Position } from '~~/game/components';
import { Entity, System } from '~~/game/utils';

type EntityCollision = { collision: Collision; position: Position };

export class Collider extends System {
  readonly requiredComponents = [Collision, Position];

  environments: EntityCollision[] = [];

  organisms: EntityCollision[] = [];

  setEntities(entities: Entity[]) {
    super.setEntities(entities);

    this.entities.forEach((entity) => {
      const collision = entity.get(Collision);
      const position = entity.get(Position);

      switch (collision.type) {
        case 'environment':
          this.environments.push({ collision, position });
          return;
        case 'organism':
          this.organisms.push({ collision, position });
          return;
        default:
          throw new Error(`Invalid collision type: '${collision.type}'`);
      }
    });
  }

  update() {
    this.organisms.forEach((organism) => {
      this.environments.forEach((environment) => {
        // Distances between centers
        const distanceX =
          organism.position.x +
          organism.collision.x +
          organism.collision.width / 2 -
          (environment.position.x +
            environment.collision.x +
            environment.collision.width / 2);
        const distanceY =
          organism.position.y +
          organism.collision.y +
          organism.collision.height / 2 -
          (environment.position.y +
            environment.collision.y +
            environment.collision.height / 2);

        // Minimal distance between centers
        const widthX =
          organism.collision.width / 2 + environment.collision.width / 2;
        const widthY =
          organism.collision.height / 2 + environment.collision.height / 2;

        // Check if there is a collision
        if (Math.abs(distanceX) < widthX && Math.abs(distanceY) < widthY) {
          const overlapX = widthX - Math.abs(distanceX);
          const overlapY = widthY - Math.abs(distanceY);

          // Remove overlap
          if (overlapX < overlapY) {
            organism.position.x += distanceX > 0 ? overlapX : -overlapX;
            return;
          }
          organism.position.y += distanceY > 0 ? overlapY : -overlapY;
        }
      });

      // // Scene limits on the x axis
      // if (organism.position.x < 0) {
      //   organism.position.x = 0;
      // } else if (
      //   organism.position.x >
      //   this.tilemap.columns * TILE_SIZE - organism.sprite.width
      // ) {
      //   organism.position.x =
      //     this.tilemap.columns * TILE_SIZE - organism.sprite.width;
      // }

      // // Scene limits on the y axis
      // if (organism.position.y < 0) {
      //   organism.position.y = 0;
      // } else if (
      //   organism.position.y >
      //   this.tilemap.rows * TILE_SIZE - organism.sprite.height
      // ) {
      //   organism.position.y =
      //     this.tilemap.rows * TILE_SIZE - organism.sprite.height;
      // }
    });
  }
}
