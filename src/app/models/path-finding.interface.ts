import { CellNode, Grid } from "./node.model";

export type Algos = 'BFS' | 'A*' | 'Dijkstra';

export interface PathFinding {
  name: Algos;
  findPath(start: CellNode, end: CellNode, grid: Grid): void;
}
