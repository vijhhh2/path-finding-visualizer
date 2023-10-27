export const DIRECTIONS = [
  [-1, 0], // TOP
  [0, 1], // RIGHT
  [1, 0], // DOWN
  [0, -1], // LEFT
] as const;

export const DIAGONAL_DIRECTIONS = [
  [-1,1], // TOP_RIGHT
  [1,1],   // DOWN_RIGHT
  [-1, -1],// TOP_LEFT
  [1, -1] // DOWN_LEFT
] as const;

export const ALL_DIRECTIONS = [
  ...DIRECTIONS,
  ...DIAGONAL_DIRECTIONS
] as const;
