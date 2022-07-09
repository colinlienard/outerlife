import Entity from '../Entities/Entity';

const spawn = (entity: Entity) => {
  window.dispatchEvent(new CustomEvent('spawn', { detail: entity }));
};

export default spawn;
