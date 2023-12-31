export const MODES = {
  START: 'START',
  END: 'END',
  WALL: 'WALL',
  RESET: 'RESET',
  NONE: 'NONE'
} as const;

export type MODE = keyof typeof MODES;