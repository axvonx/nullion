/** How a critter moves. A leaf module so layer modules can list their species' motions without importing the critter engine. */

export const MotionType = {
  /** Free continuous flight through open space (gliding curves, flapping wings). */
  Fly: 'fly',
  /** Rest on a prop top or ledge (wings folded / squished gently) before the next action. */
  Perch: 'perch',
  /** Arced jump from one prop top to a nearby prop top — always starts where it landed. */
  Hop: 'hop',
  /** Brisk horizontal walking/patrolling along a lane. */
  Patrol: 'patrol',
  /** Burst-and-pause horizontal dashing (scheduling quanta). */
  Zip: 'zip',
  /** Rapid continuous horizontal scuttling along PCB traces. */
  Scuttle: 'scuttle',
  /** Slow, rigid metronomic floating/sweeping (no jumping or landing). */
  Float: 'float',
  /** Horizontally mirrored smooth gliding across the viewport centerline. */
  Mirror: 'mirror',
  /** Discrete orthogonal steps snapped to a 4px silicon grid. */
  Grid: 'grid',
  /** Motionless frozen silhouette. */
  Frozen: 'frozen',
} as const;

export type MotionType = (typeof MotionType)[keyof typeof MotionType];
