import { Injectable, OnDestroy } from '@angular/core';
import { CellNode, Grid } from '../models/node.model';
import {
  BehaviorSubject,
} from 'rxjs';
import { cloneDeep } from 'lodash';

type GridProgress = { isEnd: boolean; grid: Grid };

@Injectable({
  providedIn: 'root',
})
export class GridManagerService implements OnDestroy {
  #grid: Grid = [];
  grid$ = new BehaviorSubject<Grid>(this.#grid);
  get grid() {
    return this.#grid;
  }

  gridUpdatesProgress$ = new BehaviorSubject<GridProgress>({
    isEnd: false,
    grid: new Array<CellNode[]>(),
  });

  rows = 20;
  cols = 30;

  constructor() {}

  createGrid() {
    this.#grid = new Array(this.rows).fill(0).map((_, row) => {
      return new Array(this.cols).fill(0).map((_, col) => {
        return {
          row,
          col,
          isStart: false,
          isEnd: false,
          isWall: false,
          isVisited: false,
          isClosed: false,
          isPath: false,
          gCost: 0,
          hCost: 0,
          fCost: 0,
        } as CellNode;
      });
    });
    this.grid$.next(this.#grid);
  }

  updateGrid(grid: Grid) {
    this.#grid = cloneDeep(grid);
    this.grid$.next(this.#grid);
  }

  updateGridWithDelayUpdated(grid: Grid, isEnd: boolean) {
    this.gridUpdatesProgress$.next(cloneDeep({ isEnd, grid }));
  }

  ngOnDestroy(): void {
    this.gridUpdatesProgress$.complete();
  }

  // Old method of updating
  // updateGridWithDelay(grid: Grid, ms: number, isEnd: boolean) {
  //   if (!isEnd) {
  //     this.gridUpdates.push(cloneDeep(grid));
  //   } else {
  //     this.gridUpdates.push(cloneDeep(grid));
  //     const firstGrid = this.gridUpdates[0];
  //     const remainingUpdates = this.gridUpdates.slice(1);
  //     this.pathFindingSubscription = from(remainingUpdates)
  //       .pipe(
  //         take(remainingUpdates.length),
  //         // bufferCount(2),
  //         // map((v) => v[v.length - 1]),
  //         concatMap((v) => of(v).pipe(delay(ms, asyncScheduler))),
  //         startWith(firstGrid),
  //         finalize(() => {
  //           this.clearGridUpdates();
  //           this.isPathFindingInProgress$.next(false);
  //         })
  //       )
  //       .subscribe((grid) => {
  //         this.updateGrid(grid);
  //       });
  //   }
  // }
}
