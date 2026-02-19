import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  random,
} from "remotion";

type Particle = {
  angle: number;
  speed: number;
  color: string;
  size: number;
};

type Rocket = {
  x: number;
  y: number;
  delay: number;
  particles: Particle[];
  trailColor: string;
};

const COLORS = [
  "#FF1744",
  "#FF9100",
  "#FFEA00",
  "#00E676",
  "#00B0FF",
  "#D500F9",
  "#F50057",
  "#FF6D00",
  "#76FF03",
  "#18FFFF",
  "#E040FB",
  "#FFD740",
];

const createRocket = (index: number): Rocket => {
  const particleCount = 20 + Math.floor(random(`count-${index}`) * 20);
  const baseColor = COLORS[Math.floor(random(`color-${index}`) * COLORS.length)];
  const particles: Particle[] = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      angle: random(`angle-${index}-${i}`) * Math.PI * 2,
      speed: 40 + random(`speed-${index}-${i}`) * 120,
      color: COLORS[Math.floor(random(`pcolor-${index}-${i}`) * COLORS.length)],
      size: 2 + random(`size-${index}-${i}`) * 4,
    });
  }

  return {
    x: 200 + random(`x-${index}`) * 1520,
    y: 200 + random(`y-${index}`) * 400,
    delay: random(`delay-${index}`) * 60,
    particles,
    trailColor: baseColor,
  };
};

const ROCKETS: Rocket[] = Array.from({ length: 12 }, (_, i) => createRocket(i));

const FireworkExplosion: React.FC<{ rocket: Rocket; frame: number; fps: number }> = ({
  rocket,
  frame,
  fps,
}) => {
  const localFrame = frame - rocket.delay;
  if (localFrame < 0) return null;

  // Rise phase: 0 to 0.5s
  const riseDuration = 0.5 * fps;
  // Explosion phase: after rise
  const explosionFrame = localFrame - riseDuration;

  // Trail rising up
  if (localFrame < riseDuration) {
    const riseProgress = interpolate(localFrame, [0, riseDuration], [0, 1], {
      extrapolateRight: "clamp",
    });
    const trailY = interpolate(riseProgress, [0, 1], [1080, rocket.y]);
    const trailOpacity = interpolate(riseProgress, [0, 0.8, 1], [0, 1, 0.5], {
      extrapolateRight: "clamp",
    });

    return (
      <div
        style={{
          position: "absolute",
          left: rocket.x,
          top: trailY,
          width: 4,
          height: 16,
          borderRadius: "50%",
          backgroundColor: rocket.trailColor,
          opacity: trailOpacity,
          boxShadow: `0 0 8px ${rocket.trailColor}, 0 0 16px ${rocket.trailColor}`,
        }}
      />
    );
  }

  if (explosionFrame < 0) return null;

  // Explosion particles
  const explosionDuration = 2 * fps;
  const progress = interpolate(explosionFrame, [0, explosionDuration], [0, 1], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(progress, [0, 0.3, 1], [1, 1, 0], {
    extrapolateRight: "clamp",
  });

  if (opacity <= 0) return null;

  return (
    <>
      {rocket.particles.map((particle, i) => {
        const distance = particle.speed * progress;
        const gravity = 50 * progress * progress;
        const px = rocket.x + Math.cos(particle.angle) * distance;
        const py = rocket.y + Math.sin(particle.angle) * distance + gravity;
        const particleOpacity = interpolate(progress, [0, 0.5, 1], [1, 0.8, 0], {
          extrapolateRight: "clamp",
        });
        const scale = interpolate(progress, [0, 1], [1, 0.2], {
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: particle.size * scale,
              height: particle.size * scale,
              borderRadius: "50%",
              backgroundColor: particle.color,
              opacity: particleOpacity * opacity,
              boxShadow: `0 0 ${4 * scale}px ${particle.color}, 0 0 ${8 * scale}px ${particle.color}`,
            }}
          />
        );
      })}
    </>
  );
};

export const Fireworks: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {ROCKETS.map((rocket, i) => (
        <FireworkExplosion key={i} rocket={rocket} frame={frame} fps={fps} />
      ))}
    </AbsoluteFill>
  );
};
