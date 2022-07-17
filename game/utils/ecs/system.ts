import { ComponentConstructor } from './component';
import { Entity } from './entity';

export abstract class System {
  abstract readonly requiredComponents: ComponentConstructor[] | null;

  entities: Entity[] = [];

  setEntities(entities: Entity[]) {
    this.entities = entities.reduce((previous: Entity[], current) => {
      if (
        this.requiredComponents &&
        current.hasMultiple(this.requiredComponents)
      ) {
        return [...previous, current];
      }
      return previous;
    }, []);
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  abstract update(): void;
}
