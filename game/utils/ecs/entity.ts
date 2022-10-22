/* eslint-disable max-classes-per-file */
import { Component, ComponentConstructor } from './component';

class EntityId {
  private static id = 0;

  static get() {
    this.id += 1;
    return this.id;
  }
}

export class Entity {
  readonly id: number;

  // eslint-disable-next-line class-methods-use-this
  private check: () => void = () => null;

  private components: Map<ComponentConstructor, Component> = new Map();

  constructor() {
    this.id = EntityId.get();
  }

  add(component: Component) {
    this.components.set(
      component.constructor as ComponentConstructor,
      component
    );
    this.check();
  }

  delete(constructor: ComponentConstructor) {
    this.components.delete(constructor);
    this.check();
  }

  get<T extends Component>(component: new (...args: any[]) => T) {
    return this.components.get(component) as T;
  }

  has(constructor: ComponentConstructor) {
    return this.components.has(constructor);
  }

  hasMultiple(constructors: ComponentConstructor[]) {
    for (const constructor of constructors) {
      if (!this.has(constructor)) {
        return false;
      }
    }

    return true;
  }

  setCheck(check: (id: number) => void) {
    this.check = () => check(this.id);
  }
}

export type EntityConstructor = new (...args: any[]) => Entity;
