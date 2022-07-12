import { ComponentConstructor } from './component';
import { Entity } from './entity';

export abstract class System {
  abstract readonly requiredComponents: ComponentConstructor[];

  entities: Entity[] = [];

  setEntities(entities: Entity[]) {
    this.entities = entities.reduce((previous: Entity[], current) => {
      if (current.hasMultiple(this.requiredComponents)) {
        return [...previous, current];
      }
      return previous;
    }, []);
  }

  abstract update(): void;
}
