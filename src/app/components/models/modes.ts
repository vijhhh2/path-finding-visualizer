export const MODES = {
  START: 'START',
  END: 'END',
  WALL: 'WALL',
  NONE: 'NONE'
} as const;

export type MODE = keyof typeof MODES;