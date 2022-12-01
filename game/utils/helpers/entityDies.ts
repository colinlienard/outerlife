import {
  AnimationComponent,
  PositionComponent,
  SpriteComponent,
} from '~~/game/components';
import { Entity } from '../ecs';
import { Emitter } from '../emitter';

export const entityDies = (entity: Entity) => {
  const { column, current } = entity.get(AnimationComponent);
  const position = entity.get(PositionComponent);
  const { source, width, height } = entity.get(SpriteComponent);

  const newEntity = new Entity();
  newEntity.add(position);
  newEntity.add(
    new SpriteComponent(
      source,
      (column + current.frameStart - 1) * width,
      1 * height,
      width,
      height
    )
  );

  Emitter.emit('despawn', entity.id);
  Emitter.emit('spawn', newEntity);
};
