import { Entity } from './entity';
import { System, SystemContructor } from './system';

export abstract class ECS {
  private systems: Map<SystemContructor, System> = new Map();

  protected abstract entities: Entity[];

  protected add(system: System) {
    this.systems.set(system.constructor as SystemContructor, system);
  }

  protected delete(system: SystemContructor) {
    this.systems.delete(system);
  }

  protected get<T extends System>(system: new (...args: any[]) => T) {
    return this.systems.get(system) as T;
  }

  protected updateSystems() {
    this.systems.forEach((system) => system.update());
  }

  protected setSystemsEntities() {
    this.systems.forEach((system) => {
      system.setEntities(this.entities);
    });
  }
}
