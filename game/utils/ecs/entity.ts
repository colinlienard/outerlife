// eslint-disable-next-line import/no-cycle
import { Component, Lifecycle } from './index';

type ComponentClass<T extends Component> = new (...args: any[]) => T;

export class Entity implements Lifecycle {
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

  has<T extends Component>(c: ComponentClass<T>) {
    for (const component of this.#components) {
      if (component instanceof c) {
        return true;
      }
    }

    return false;
  }

  remove<T extends Component>(c: ComponentClass<T>) {
    this.#components = this.#components.filter(
      (component) => !(component instanceof c)
    );
  }

  update() {
    this.#components.forEach((component) => {
      component.update();
    });
  }
}
