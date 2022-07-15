import { Entity } from './entity';
import { System } from './system';

type SystemClass<T extends System> = new (...args: any[]) => T;

export abstract class ECS {
  entities: Entity[] = [];

  systems: System[] = [];

  add(system: System) {
    this.systems.push(system);
  }

  get<T extends System>(s: SystemClass<T>) {
    for (const system of this.systems) {
      if (system instanceof s) {
        return system as T;
      }
    }

    throw new Error('System not found.');
  }

  remove(s: new () => System) {
    this.systems = this.systems.filter((system) => !(system instanceof s));
  }

  updateSystems() {
    this.systems.forEach((system) => system.update());
  }
}
