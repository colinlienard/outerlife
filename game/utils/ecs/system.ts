import { ComponentConstructor } from './component';
import { Entity } from './entity';

export abstract class System {
  protected abstract readonly requiredComponents: ComponentConstructor[];

  private entities: Map<number, Entity> = new Map();

  abstract update(): void;

  check(entity: Entity): boolean | void {
    const hasEntity = this.entities.has(entity.id);
    const EntityHasComponents = entity.hasMultiple(this.requiredComponents);

    if (!hasEntity && EntityHasComponents) {
      this.add(entity);
      return;
    }

    if (hasEntity && !EntityHasComponents) {
      this.delete(entity.id);
    }
  }

  add(entity: Entity) {
    this.entities.set(entity.id, entity);
  }

  delete(id: number): boolean | void {
    return this.entities.delete(id);
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
