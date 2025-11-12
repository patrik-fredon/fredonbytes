interface GridBackgroundProps {
  density?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

export default function GridBackground({
  density = 30,
  color = "rgba(0, 217, 255, 0.1)",
  opacity = 0.32,
  className = "",
}: GridBackgroundProps) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(90deg, ${color} 1px, transparent 1px),
          linear-gradient(${color} 1px, transparent 1px)
        `,
        backgroundSize: `${density}px ${density}px`,
        WebkitMaskImage:
          "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
        maskImage:
          "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
        opacity,
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
