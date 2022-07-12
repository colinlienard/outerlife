import { ComponentInstance } from './component';
import { Entity } from './entity';

export abstract class System {
  abstract readonly requiredComponents: ComponentInstance[];

  entities: Entity[] = [];

  setEntities(entities: Entity[]) {
    this.entities = entities.reduce((previous: Entity[], current) => {
      if (current.hasMultiple(this.requiredComponents)) {
        return [...previous, current];
      }
      return previous;
    }, []);
  }

  abstract updateEntity(entity: Entity): void;

  update() {
    this.entities.forEach((entity) => {
      this.updateEntity(entity);
    });
  }
}
