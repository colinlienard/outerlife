import { Component, ComponentConstructor } from './component';

type ComponentClass<T extends Component> = new (...args: any[]) => T;

export abstract class Entity {
  #components: Component[] = [];

  add(c: Component) {
    this.#components.push(c);
  }

  get<T extends Component>(c: ComponentClass<T>) {
    for (const component of this.#components) {
      if (component instanceof c) {
        return component as T;
      }
    }

    throw new Error('Component not found.');
  }

  has(c: ComponentConstructor) {
    for (const component of this.#components) {
      if (component instanceof c) {
        return true;
      }
    }

    return false;
  }

  hasMultiple(cs: ComponentConstructor[]) {
    for (const c of cs) {
      if (!this.has(c)) {
        return false;
      }
    }

    return true;
  }

  remove(c: ComponentConstructor) {
    this.#components = this.#components.filter(
      (component) => !(component instanceof c)
    );
  }
}
