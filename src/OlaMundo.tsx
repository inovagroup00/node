import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Bungee";
import { Fireworks } from "./Fireworks";

const { fontFamily } = loadFont();

export const OlaMundo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Background gradient pulse
  const bgPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.85, 1],
  );

  // "Olá" entrance - bouncy spring
  const olaScale = spring({
    frame,
    fps,
    delay: 15,
    config: { damping: 8, stiffness: 150 },
  });

  const olaRotate = interpolate(olaScale, [0, 1], [-15, 0]);

  // "Mundo" entrance - bouncy spring, slightly delayed
  const mundoScale = spring({
    frame,
    fps,
    delay: 30,
    config: { damping: 8, stiffness: 150 },
  });

  const mundoRotate = interpolate(mundoScale, [0, 1], [15, 0]);

  // Shimmer effect on text
  const shimmerX = interpolate(frame, [0, durationInFrames], [-200, 200]);

  // Glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.12),
    [-1, 1],
    [10, 30],
  );

  // Exit animation
  const exitStart = durationInFrames - 20;
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center,
          hsl(270, 80%, ${12 * bgPulse}%) 0%,
          hsl(250, 90%, ${6 * bgPulse}%) 50%,
          hsl(240, 95%, ${3 * bgPulse}%) 100%)`,
        opacity: exitOpacity,
      }}
    >
      {/* Stars background */}
      <Stars frame={frame} />

      {/* Fireworks layer */}
      <Sequence from={0} premountFor={15}>
        <Fireworks />
      </Sequence>

      {/* Main text */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {/* Olá */}
        <div
          style={{
            fontFamily,
            fontSize: 160,
            fontWeight: "bold",
            color: "#FFD700",
            transform: `scale(${olaScale}) rotate(${olaRotate}deg)`,
            textShadow: `
              0 0 ${glowIntensity}px #FFD700,
              0 0 ${glowIntensity * 2}px #FF6B00,
              0 0 ${glowIntensity * 3}px #FF0080,
              4px 4px 0px #8B0000
            `,
            WebkitTextStroke: "2px #FF8C00",
            lineHeight: 1.1,
            position: "relative",
          }}
        >
          <span style={{ position: "relative" }}>
            Olá
            {/* Shimmer overlay */}
            <span
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                backgroundSize: "200px 100%",
                backgroundPosition: `${shimmerX}px 0`,
                backgroundRepeat: "no-repeat",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mixBlendMode: "overlay",
              }}
            >
              Olá
            </span>
          </span>
        </div>

        {/* Mundo */}
        <div
          style={{
            fontFamily,
            fontSize: 200,
            fontWeight: "bold",
            color: "#FF1493",
            transform: `scale(${mundoScale}) rotate(${mundoRotate}deg)`,
            textShadow: `
              0 0 ${glowIntensity}px #FF1493,
              0 0 ${glowIntensity * 2}px #9400D3,
              0 0 ${glowIntensity * 3}px #4B0082,
              4px 4px 0px #2E0854
            `,
            WebkitTextStroke: "2px #FF69B4",
            lineHeight: 1.1,
            marginTop: -10,
          }}
        >
          Mundo!
        </div>

        {/* Decorative confetti emoji line */}
        <ConfettiRow frame={frame} fps={fps} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Animated stars in background
const Stars: React.FC<{ frame: number }> = ({ frame }) => {
  const stars = Array.from({ length: 50 }, (_, i) => {
    const x = ((i * 137.5) % 1920);
    const y = ((i * 97.3) % 1080);
    const twinkle = interpolate(
      Math.sin(frame * 0.1 + i * 2.5),
      [-1, 1],
      [0.1, 0.9],
    );
    const size = 1 + (i % 3);

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: "#fff",
          opacity: twinkle,
          boxShadow: `0 0 ${size * 2}px rgba(255,255,255,${twinkle})`,
        }}
      />
    );
  });

  return <AbsoluteFill>{stars}</AbsoluteFill>;
};

// Animated confetti dots below text
const ConfettiRow: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const showConfetti = spring({
    frame,
    fps,
    delay: 45,
    config: { damping: 12 },
  });

  const colors = ["#FF1744", "#FF9100", "#FFEA00", "#00E676", "#00B0FF", "#D500F9", "#F50057"];

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        marginTop: 30,
        opacity: showConfetti,
        transform: `scale(${showConfetti})`,
      }}
    >
      {colors.map((color, i) => {
        const bounce = interpolate(
          Math.sin(frame * 0.15 + i * 1.2),
          [-1, 1],
          [-8, 8],
        );

        return (
          <div
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: color,
              transform: `translateY(${bounce}px)`,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};
