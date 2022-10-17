import { Entity } from './entity';
import { System, SystemContructor } from './system';

export abstract class ECS {
  private systems: Map<SystemContructor, System> = new Map();

  private entities: Map<number, Entity> = new Map();

  protected add(system: System) {
    this.systems.set(system.constructor as SystemContructor, system);
  }

  protected delete(system: SystemContructor) {
    this.systems.delete(system);
  }

  protected get<T extends System>(system: new (...args: any[]) => T) {
    return this.systems.get(system) as T;
  }

  protected update() {
    this.systems.forEach((system) => system.update());
  }

  protected addEntity(entity: Entity) {
    entity.setCheck((id: number) => this.checkEntity(id));
    this.entities.set(entity.id, entity);
    this.systems.forEach((system) => system.check(entity));
  }

  protected deleteEntity(id: number) {
    this.entities.delete(id);
    this.systems.forEach((system) => system.delete(id));
  }

  protected getEntities() {
    return Array.from(this.entities.values());
  }

  protected clearEntities() {
    this.systems.forEach((system) => system.clear());
  }

  checkEntity(id: number) {
    const entity = this.entities.get(id);
    if (entity) {
      this.systems.forEach((system) => system.check(entity));
    }
  }
}
