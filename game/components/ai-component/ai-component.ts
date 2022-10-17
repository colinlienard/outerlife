import { Component, Settings } from '~~/game/utils';

export class AIComponent implements Component {
  readonly spawnPoint: {
    x: number;
    y: number;
  };

  readonly detectionRange: number;

  readonly abortAggroRange: number;

  readonly attackRange: number;

  readonly attackAnticipationTime: number;

  readonly wanderDistance: number;

  target: {
    x: number;
    y: number;
  } | null = null;

  constructor(
    spawnX: number,
    spawnY: number,
    wanderDistance: number,
    detectionRange: number,
    abortAggroRange: number,
    attackRange: number,
    attackAnticipationTime: number
  ) {
    this.spawnPoint = {
      x: spawnX,
      y: spawnY,
    };
    this.wanderDistance = wanderDistance;
    this.detectionRange = detectionRange;
    this.abortAggroRange = abortAggroRange;
    this.attackRange = attackRange;
    this.attackAnticipationTime = attackAnticipationTime;
  }

  setWanderTarget() {
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
      this.setWanderTarget();
      return;
    }

    this.target = { x, y };
  }
}
