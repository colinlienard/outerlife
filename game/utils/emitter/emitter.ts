import { Entity } from '~~/game/utils/ecs/entity';

interface EventMap {
  'scene-loaded': () => void;
  'switch-map': (options: {
    map: string;

    playerX: number;

    playerY: number;
  }) => void;
  spawn: (entity: Entity) => void;
  despawn: (entity: Entity) => void;
  'get-player-position': () => { x: number; y: number };
}

type Events = keyof EventMap;

export abstract class Emitter {
  private static events = new Map<Events, ((...args: any[]) => any)[]>();

  static emit<E extends Events>(
    event: E,
    ...args: Parameters<EventMap[E]>
  ): ReturnType<EventMap[E]>[] {
    if (!this.events.has(event)) {
      throw new Error(`Emitter '${event}' has not been created.`);
    }

    return this.events.get(event)?.map((callback) => callback(...args)) || [];
  }

  static on<E extends Events>(event: E, callback: EventMap[E]) {
    this.events.set(event, [...(this.events.get(event) || []), callback]);
  }

  static unbind(event: Events) {
    this.events.delete(event);
  }
}
