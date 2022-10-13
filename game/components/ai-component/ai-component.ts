import { Component, Settings } from '~~/game/utils';

export class AIComponent implements Component {
  readonly abortAggroRange: number;

  readonly attackAnticipationTime: number;

  readonly attackRange: number;

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

  constructor(
    spawnX: number,
    spawnY: number,
    detectionRange: number,
    abortAggroRange: number,
    attackRange: number,
    attackAnticipationTime: number
  ) {
    this.abortAggroRange = abortAggroRange;
    this.attackAnticipationTime = attackAnticipationTime;
    this.attackRange = attackRange;
    this.detectionRange = detectionRange;
    this.spawnPoint = {
      x: spawnX,
      y: spawnY,
    };
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
