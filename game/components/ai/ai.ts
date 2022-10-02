import { Component, getRandomBetweenTwo, Settings } from '~~/game/utils';
import { AIState } from './types';

export class AI implements Component {
  readonly abortAggroRange: number;

  readonly detectionRange: number;

  readonly spawnPoint: {
    x: number;
    y: number;
  };

  readonly wanderDistance = 100;

  target: {
    x: number;
    y: number;
  } | null = null;

  state: AIState = 'wander';

  framesToWait = 120;

  frameWaiter = 0;

  constructor(
    spawnX: number,
    spawnY: number,
    detectionRange: number,
    abortAggroRange: number
  ) {
    this.abortAggroRange = abortAggroRange;
    this.detectionRange = detectionRange;
    this.spawnPoint = {
      x: spawnX,
      y: spawnY,
    };
  }

  getWanderTarget(): { x: number; y: number } {
    // Random point near the spawn point
    const x =
      Math.round(Math.random() * this.wanderDistance * 2) +
      this.spawnPoint.x -
      this.wanderDistance;
    const y =
      Math.round(Math.random() * this.wanderDistance * 2) +
      this.spawnPoint.y -
      this.wanderDistance;

    // Avoid target being outside of the scene
    if (
      x < 0 ||
      x > Settings.scene.width ||
      y < 0 ||
      y > Settings.scene.height
    ) {
      return this.getWanderTarget();
    }

    return { x, y };
  }

  resetWait(number?: number) {
    this.frameWaiter = 0;
    this.framesToWait = number || getRandomBetweenTwo(240, 480);
  }
}
