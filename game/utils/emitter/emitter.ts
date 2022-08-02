import { Entity } from '~~/game/utils/ecs/entity';

interface EventMap {
  'scene-loaded': () => void;

  'switch-map': (options: {
    map: string;

    playerX: number;

    playerY: number;
  }) => void;

  spawn: (entity: Entity) => void;

  despawn: () => void;
}

type Events = keyof EventMap;

export abstract class Emitter {
  private static events = new Map<Events, EventMap[Events][]>();

  static emit<E extends Events>(event: E, ...args: Parameters<EventMap[E]>) {
    if (!this.events.has(event)) {
      throw new Error(`Emitter '${event}' has not been created.`);
    }

    this.events.get(event)?.forEach((callback) => callback(...args));
  }

  static on<E extends Events>(event: E, callback: EventMap[E]) {
    this.events.set(event, [...(this.events.get(event) || []), callback]);
  }

  static unbind(event: Events) {
    this.events.delete(event);
  }
}
