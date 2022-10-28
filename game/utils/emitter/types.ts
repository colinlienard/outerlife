import { Entity } from '~~/game/utils/ecs/entity';

export interface EventMap {
  'scene-loaded': () => void;
  'switch-map': (options: {
    map: string;

    playerX: number;

    playerY: number;
  }) => void;
  spawn: (entity: Entity) => void;
  despawn: (id: number) => void;
  'get-player-position': () => { x: number; y: number };
  hit: () => void;
}

export type Events = keyof EventMap;
