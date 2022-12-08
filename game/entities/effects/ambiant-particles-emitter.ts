import {
  ParticlesComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity, Settings } from '~~/game/utils';

export class AmbiantParticlesEmitter extends Entity {
  constructor() {
    super();
    this.add(new ParticlesComponent(2, 0.5, 400, 20, 30, 0, 0, 100, 100));
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
