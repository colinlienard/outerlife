import { Component, ComponentConstructor } from './component';

export abstract class Entity {
  private components: Map<ComponentConstructor, Component> = new Map();

  add(component: Component) {
    this.components.set(
      component.constructor as ComponentConstructor,
      component
    );
  }

  delete(constructor: ComponentConstructor) {
    this.components.delete(constructor);
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
}

export type EntityConstructor = new (...args: any[]) => Entity;
