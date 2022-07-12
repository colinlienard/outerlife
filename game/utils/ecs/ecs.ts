import { Entity } from './entity';
import { System } from './system';

export abstract class ECS {
  entities: Entity[] = [];

  systems: System[] = [];

  add(system: System) {
    this.systems.push(system);
  }

  // get<T extends System>(c: ComponentClass<T>) {
  //   for (const component of this.#components) {
  //     if (component instanceof c) {
  //       return component as T;
  //     }
  //   }

  //   throw new Error('Component not found.');
  // }

  // loop() {
  //   requestAnimationFrame(() => this.loop())
  // }
}
