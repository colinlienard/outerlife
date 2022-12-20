import {
  ParticlesComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity, ParticlesProps, Settings } from '~~/game/utils';

export class AmbiantParticlesEventManager extends Entity {
  constructor({ color, speed, duration, angle, timeBetween }: ParticlesProps) {
    super();
    this.add(
      new ParticlesComponent(
        color,
        speed,
        duration,
        angle,
        timeBetween,
        0,
        0,
        100,
        100
      )
    );
    this.add(new PositionComponent(0, 0));
    this.add(
      new SpriteComponent(
        '/sprites/palette.png',
        0,
        1,
        Settings.scene.width,
        Settings.scene.height
      )
    ); // Fake sprite so that particles can be rendered
  }
}
