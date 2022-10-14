import { ComponentConstructor } from './component';
import { Entity } from './entity';

export abstract class System {
  protected abstract readonly requiredComponents: ComponentConstructor[];

  private entities: Map<number, Entity> = new Map();

  abstract update(): void;

  check(entity: Entity) {
    const hasEntity = this.entities.has(entity.id);
    const EntityHasComponents = entity.hasMultiple(this.requiredComponents);

    if (hasEntity && !EntityHasComponents) {
      this.delete(entity.id);
      return;
    }

    if (!hasEntity && EntityHasComponents) {
      this.entities.set(entity.id, entity);
    }
  }

  delete(id: number) {
    this.entities.delete(id);
  }

  get() {
    return this.entities;
  }

  getAsArray() {
    return Array.from(this.entities.values());
  }

  clear() {
    this.entities.clear();
  }
}

export type SystemContructor = new (...args: any[]) => System;
