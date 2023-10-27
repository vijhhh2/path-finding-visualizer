import { Inject, Injectable, InjectionToken, inject } from '@angular/core';
import { GridManagerService } from './grid-manager.service';
import { BehaviorSubject } from 'rxjs';
import {
  Algos,
  PathFinding,
} from '../models/path-finding.interface';
import { BFS } from '../path-finding-algos/bfs';
import { CellNode, Grid } from '../models/node.model';
import { AStar } from '../path-finding-algos/a*';

const PathFindingAlgo = new InjectionToken<(algo: Algos) => PathFinding>(
  'Path finding algorithm factory',
  {
    factory() {
      const gridManagerService = inject(GridManagerService);
      return (algo: Algos): PathFinding => {
        switch (algo) {
          case 'BFS':
            return new BFS(gridManagerService);
          case 'A*':
            return new AStar(gridManagerService);
          default:
            throw new Error('Unable to find algorithm');
        }
      };
    },
  }
);

@Injectable({
  providedIn: 'root',
})
export class PathFindingService {
  gridManagerService = inject(GridManagerService);

  isPathFindingInProgress$ = new BehaviorSubject(false);

  constructor(
    @Inject(PathFindingAlgo)
    private pathFindingAlgoManager: (algo: Algos) => PathFinding
  ) {}

  findPath(start: CellNode, end: CellNode, grid: Grid, algorithm: Algos) {
    const algo = this.pathFindingAlgoManager(algorithm);
    algo.findPath(start, end, grid);
  }
}
