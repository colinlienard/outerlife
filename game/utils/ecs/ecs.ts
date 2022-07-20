import { Entity } from './entity';
import { System, SystemContructor } from './system';

export abstract class ECS {
  private systems: Map<SystemContructor, System> = new Map();

  abstract entities: Entity[];

  add(system: System) {
    this.systems.set(system.constructor as SystemContructor, system);
  }

  delete(system: SystemContructor) {
    this.systems.delete(system);
  }

  get<T extends System>(system: new (...args: any[]) => T) {
    return this.systems.get(system) as T;
  }

  updateSystems() {
    this.systems.forEach((system) => system.update());
  }

  setSystemsEntities() {
    this.systems.forEach((system) => {
      system.setEntities(this.entities);
    });
  }
}
