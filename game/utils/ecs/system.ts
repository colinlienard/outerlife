import { ComponentConstructor } from './component';
import { Entity } from './entity';

export abstract class System {
  protected abstract readonly requiredComponents: ComponentConstructor[] | null;

  protected entities: Entity[] = [];

  abstract update(): void;

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

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
}

export type SystemContructor = new (...args: any[]) => System;
