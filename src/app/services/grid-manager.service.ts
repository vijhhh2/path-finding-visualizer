import { Injectable, OnDestroy } from '@angular/core';
import { CellNode } from '../components/models/node.model';
import {
  BehaviorSubject,
  asyncScheduler,
  bufferCount,
  concatMap,
  delay,
  finalize,
  from,
  of,
  startWith,
  take,
  map,
  Subscription,
} from 'rxjs';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class GridManagerService implements OnDestroy {
  #grid: CellNode[][] = [];
  grid$ = new BehaviorSubject<CellNode[][]>(this.#grid);
  get grid() {
    return this.#grid;
  }

  gridUpdates: CellNode[][][] = [];

  rows = 30;
  cols = 50;

  isPathFindingInProgress$ = new BehaviorSubject(false);
  pathFindingSubscription!: Subscription;

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
          isPath: false
        } as CellNode;
      });
    });
    this.grid$.next(this.#grid);
  }

  updateGrid(grid: CellNode[][]) {
    this.#grid = cloneDeep(grid);
    this.grid$.next(this.#grid);
  }

  updateGridWithDelay(grid: CellNode[][], ms: number, isEnd: boolean) {
    if (!isEnd) {
      this.gridUpdates.push(cloneDeep(grid));
    } else {
      this.gridUpdates.push(cloneDeep(grid));
      const firstGrid = this.gridUpdates[0];
      const remainingUpdates = this.gridUpdates.slice(1);
      this.pathFindingSubscription = from(remainingUpdates)
        .pipe(
          take(remainingUpdates.length),
          // bufferCount(2),
          // map((v) => v[v.length - 1]),
          concatMap((v) => of(v).pipe(delay(ms, asyncScheduler))),
          startWith(firstGrid),
          finalize(() => {
            this.clearGridUpdates();
            this.isPathFindingInProgress$.next(false);
          })
        )
        .subscribe((grid) => {
          this.updateGrid(grid);
        });
    }
  }

  clearGridUpdates() {
    this.gridUpdates = [];
  }

  ngOnDestroy(): void {
    this.pathFindingSubscription?.unsubscribe();
  }
}
