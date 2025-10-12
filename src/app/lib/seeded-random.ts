/**
 * Seeded random number generator for consistent server/client rendering
 * Prevents hydration mismatches by producing deterministic "random" values
 */

class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  /**
   * Generate a pseudo-random number between 0 and 1
   * Uses a simple linear congruential generator (LCG) algorithm
   */
  random(): number {
    // LCG parameters (these are commonly used values)
    const a = 1664525
    const c = 1013904223
    const m = Math.pow(2, 32)

    this.seed = (a * this.seed + c) % m
    return this.seed / m
  }

  /**
   * Generate a random number between min and max (inclusive)
   */
  range(min: number, max: number): number {
    return min + this.random() * (max - min)
  }

  /**
   * Generate a random integer between min and max (inclusive)
   */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1))
  }
}

/**
 * Create a seeded random generator with a consistent seed
 * Uses a hash of the input string to create the seed
 */
export function createSeededRandom(input: string): SeededRandom {
  // Simple string hash function to create a seed
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Ensure positive seed
  return new SeededRandom(Math.abs(hash))
}

/**
 * Generate deterministic positions for particles
 * Returns consistent positions between server and client renders
 */
export function generateParticlePositions(count: number, seed: string = 'animated-background'): Array<{ left: number, top: number }> {
  const rng = createSeededRandom(seed)
  const positions: Array<{ left: number, top: number }> = []

  for (let i = 0; i < count; i++) {
    positions.push({
      left: rng.range(0, 100),
      top: rng.range(0, 100)
    })
  }

  return positions
}
