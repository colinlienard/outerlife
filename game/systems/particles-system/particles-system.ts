import { ParticlesComponent, PositionComponent } from '~~/game/components';
import { Particle } from '~~/game/components/particles-component/types';
import { System } from '~~/game/utils';

export class ParticlesSystem extends System {
  protected readonly requiredComponents = [ParticlesComponent];

  update() {
    this.get().forEach((entity) => {
      const particles = entity.get(ParticlesComponent);
      const position = entity.get(PositionComponent);

      // Update particles
      particles.particles = particles.particles.reduce<Particle[]>(
        (previous, current) => {
          if (current.time >= particles.duration) {
            return previous;
          }

          const particle = current;
          particle.y -= particles.speed;
          particle.time += 1;
          return [...previous, particle];
        },
        []
      );

      if (particles.time < particles.timeBetween) {
        particles.time += 1;
        return;
      }

      particles.time = 0;

      // Add a particle
      const x =
        Math.round(Math.random() * particles.areaWidth) +
        particles.areaX +
        position.x;
      const y =
        Math.round(Math.random() * particles.areaHeight) +
        particles.areaY +
        position.y;
      particles.particles.push({ x, y, time: 0 });
    });
  }
}
