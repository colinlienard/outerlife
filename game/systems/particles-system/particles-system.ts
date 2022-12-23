import { ParticlesComponent, PositionComponent } from '~~/game/components';
import { Particle } from '~~/game/components/particles-component/types';
import { AmbiantParticlesEventManager } from '~~/game/entities';
import { EventManager } from '~~/game/managers';
import { ParticlesProps, Settings, System } from '~~/game/utils';

export class ParticlesSystem extends System {
  protected readonly requiredComponents = [
    ParticlesComponent,
    PositionComponent,
  ];

  private ambiantParticles: AmbiantParticlesEventManager | null = null;

  setupAmbiantParticles(props: ParticlesProps) {
    this.ambiantParticles = new AmbiantParticlesEventManager(props);
    this.resize();
    EventManager.emit('spawn', this.ambiantParticles);
  }

  update() {
    // Handle ambient particles
    if (this.ambiantParticles) {
      const ambiantParticles = this.ambiantParticles.get(ParticlesComponent);
      ambiantParticles.areaX = Math.round(Math.abs(Settings.cameraOffset.x));
      ambiantParticles.areaY = Math.round(Math.abs(Settings.cameraOffset.y));
    }

    this.get().forEach((entity) => {
      const particles = entity.get(ParticlesComponent);
      const position = entity.get(PositionComponent);

      // Update particles
      particles.list = particles.list.reduce<Particle[]>(
        (previous, current) => {
          if (current.time >= particles.duration) {
            return previous;
          }

          const particle = current;
          particle.x +=
            Math.cos((Math.PI / 180) * particles.angle) * particles.speed;
          particle.y +=
            Math.sin((Math.PI / 180) * particles.angle) * particles.speed;
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
      particles.list.push({ x, y, time: 0 });
    });
  }

  resize() {
    if (!this.ambiantParticles) {
      return;
    }

    const ambiantParticles = this.ambiantParticles.get(ParticlesComponent);
    ambiantParticles.areaWidth = window.innerWidth / Settings.ratio;
    ambiantParticles.areaHeight = window.innerHeight / Settings.ratio;
  }
}
