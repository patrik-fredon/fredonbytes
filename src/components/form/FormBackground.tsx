import GridBackground from '@/components/dev-ui/GridBackground';

/**
 * Terminal-themed background component for the form
 * Uses GridBackground for cyberpunk aesthetic
 */
export default function FormBackground() {
  return (
    <>
      {/* Terminal dark background */}
      <div className="absolute inset-0 bg-terminal-dark" />

      {/* Grid background overlay */}
      <div className="absolute inset-0">
        <GridBackground />
      </div>
    </>
  );
}
