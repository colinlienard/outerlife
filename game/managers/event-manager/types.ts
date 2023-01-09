import { Entity } from '~~/game/utils/ecs/entity';
import { Direction, GamePrompt } from '../../utils/types';

export interface EventMap {
  'scene-loaded': () => void;
  'switch-map': (options: {
    map: string;
    playerX: number;
    playerY: number;
    playerDirection: Direction;
  }) => void;
  spawn: (entity: Entity) => void;
  despawn: (id: number) => void;
  'get-player-position': () => { x: number; y: number };
  hit: () => void;
  'show-prompt': (prompt: GamePrompt, accept: () => void) => void;
  'hide-prompt': () => void;
  'start-dialogue': (id: number) => void;
  pause: () => void;
}

export type Events = keyof EventMap;
