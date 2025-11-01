interface GridBackgroundProps {
  density?: number;
  color?: string;
  opacity?: number;
  className?: string;
}

export default function GridBackground({
  density = 40,
  color = "rgba(0, 217, 255, 0.1)",
  opacity = 1,
  className = "",
}: GridBackgroundProps) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(90deg, ${color} 1px, transparent 1px),
          linear-gradient(${color} 1px, transparent 1px)
        `,
        backgroundSize: `${density}px ${density}px`,
        opacity,
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
