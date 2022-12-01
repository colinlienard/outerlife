export type CollidingType = 'hitbox' | 'player-hurtbox' | 'ai-hurtbox';

export type ColliderType =
  | 'environment'
  | 'interaction'
  | 'damage-player'
  | 'damage-ai';

type CollisionType = CollidingType | ColliderType;

export type Collision =
  | {
      type: Exclude<CollisionType, 'damage-ai' | 'damage-player'>;
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: Extract<CollisionType, 'damage-player' | 'damage-ai'>;
      x: number;
      y: number;
      width: number;
      height: number;
      damages: number;
    };
