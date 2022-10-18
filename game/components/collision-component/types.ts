export type CollidingType = 'hitbox' | 'player-hurtbox' | 'ai-hurtbox';

export type ColliderType =
  | 'environment'
  | 'interaction'
  | 'damage-player'
  | 'damage-ai';

export type Collision = {
  type: CollidingType | ColliderType;
  x: number;
  y: number;
  width: number;
  height: number;
};
