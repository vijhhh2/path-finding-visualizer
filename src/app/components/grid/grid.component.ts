import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  Observable,
  Subject,
  concatMap,
  delay,
  filter,
  of,
  takeUntil,
} from 'rxjs';
import { cloneDeep, isEmpty, isEqual } from 'lodash';

import { NodeComponent } from './node/node.component';
import { MODE } from '../../models/modes';
import { ModeManagerService } from 'src/app/services/mode-manager.service';
import { PathFindingService } from 'src/app/services/path-finding.service';
import { MatButtonModule } from '@angular/material/button';
import { GridManagerService } from '../../services/grid-manager.service';
import { explored } from '../../animations/animations';
import { CellNode } from '../../models/node.model';
import { MOUSE_DOWN } from '../../utils/mouse-down';
import { ModePipe } from '../../pipes/mode/mode.pipe';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Algos } from '../../models/path-finding.interface';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatCardModule,
    NodeComponent,
    AsyncPipe,
    MatButtonModule,
    MatInputModule,
    ModePipe,
    MatSelectModule,
    ReactiveFormsModule
  ],
  animations: [explored],
})
export class GridComponent implements OnInit, OnDestroy, AfterViewInit {
  // dependencies
  modeManager = inject(ModeManagerService);
  pathFindingService = inject(PathFindingService);
  gridManagerService = inject(GridManagerService);
  mouseDown$ = inject(MOUSE_DOWN);
  // host = inject(ElementRef);
  // zone = inject(NgZone);
  // cdr = inject(ChangeDetectorRef);

  grid$ = this.gridManagerService.grid$.asObservable();

  startNode: CellNode | null = null;
  endNode: CellNode | null = null;

  mode$: Observable<MODE> = this.modeManager.mode$.asObservable();
  isPathFindingInProgress$ = this.pathFindingService.isPathFindingInProgress$;
  endProgress$!: Subject<void>;
  algorithms = [
    'A*',
    'BFS'
  ];

  selectedAlgorithm = new FormControl<Algos>('BFS', Validators.required);

  // @ViewChildren(NodeComponent) nodes!: QueryList<NodeComponent>;


  ngOnInit(): void {
    this.gridManagerService.createGrid();
  }

  ngAfterViewInit(): void {
    // this.zone.runOutsideAngular(() => {
    //   this.mouseDown$(this.host).subscribe(() => {
    //     const nodes = this.nodes?.toArray() || [];
    //     nodes.forEach(node => {
    //       if (node.isMouseOver) {
    //         node.toggleWall();
    //       }
    //     });
    //     this.cdr.detectChanges();
    //   });
    // });

  }

  startPathFinding() {
    if (isEmpty(this.startNode) || isEmpty(this.endNode)) {
      throw new Error(
        'To start path finding you need to specify start and end node'
      );
    }

    this.trackGridProgress();

    this.pathFindingService.findPath(
      this.startNode,
      this.endNode,
      cloneDeep(this.gridManagerService.grid),
      this.selectedAlgorithm.value!
    );
  }

  private trackGridProgress() {
    this.pathFindingService.isPathFindingInProgress$.next(true);

    const gridProgress$ =
      this.gridManagerService.gridUpdatesProgress$.asObservable();
    this.endProgress$ = new Subject<void>();

    gridProgress$
      .pipe(
        filter((v) => v.grid.length > 0),
        concatMap((grid) => of(grid).pipe(delay(1))),
        takeUntil(this.endProgress$),
      )
      .subscribe(({ isEnd, grid }) => {
        this.gridManagerService.updateGrid(grid);
        if (isEnd) {
          this.endProgress$.next();
          this.endProgress$.complete();
          this.pathFindingService.isPathFindingInProgress$.next(false);
          this.gridManagerService.updateGridWithDelayUpdated([], false);
        }
      });
  }

  clearGrid() {
    this.gridManagerService.createGrid();
    this.startNode = null;
    this.endNode = null;
  }

  onCancel() {
    this.pathFindingService.isPathFindingInProgress$.next(false);
    this.endProgress$.next();
    this.endProgress$.complete();
    this.clearGrid();
  }

  onCellNodeClicked(node: CellNode) {
    const mode = this.modeManager.mode;
    switch (mode) {
      case 'START':
        this.updateStartNode(node);
        break;
      case 'END':
        this.updateEndNode(node);
        break;
      case 'WALL':
        this.updateWallNode(node);
        break;
      case 'RESET':
        this.resetNode(node);
        break;
      default:
        break;
    }
  }

  private updateStartNode(node: CellNode) {
    const grid = this.gridManagerService.grid;
    // If its empty update start node directly
    if (isEmpty(this.startNode)) {
      this.startNode = node;
    } else {
      // Set previous start node isStart false
      grid[this.startNode.row][this.startNode.col] = {
        ...this.startNode,
        isStart: false,
      };
    }

    // Update node received isStart to true and assign it to start node
    this.startNode = {
      ...node,
      isStart: true,
    };

    // Update node in th grid
    grid[node.row][node.col] = this.startNode;
    this.gridManagerService.updateGrid(grid);
  }

  private updateEndNode(node: CellNode) {
    const grid = this.gridManagerService.grid;
    // If its empty update end node directly
    if (isEmpty(this.endNode)) {
      this.endNode = node;
    } else {
      // Set previous start node isEnd false
      grid[this.endNode.row][this.endNode.col] = {
        ...this.endNode,
        isEnd: false,
      };
    }

    // Update node received isEnd to true and assign it to start node
    this.endNode = {
      ...node,
      isEnd: true,
    };

    // Update node in th grid
    grid[node.row][node.col] = this.endNode;
    this.gridManagerService.updateGrid(grid);
  }

  private updateWallNode(node: CellNode) {
    const grid = this.gridManagerService.grid;

    // Check if this node is start or end.
    // If it is return
    if (this.isStarOrEndNode(node)) {
      return;
    }

    // Update node received isWall to true/false and update node in th grid
    grid[node.row][node.col] = {
      ...node,
      isWall: !node.isWall,
    };
    this.gridManagerService.updateGrid(grid);
  }

  private resetNode(node: CellNode) {
    const grid = this.gridManagerService.grid;
    const newNode = {
      ...node,
      isStart: false,
      isEnd: false,
      isWall: false,
      isVisited: false,
    } as CellNode;

    grid[node.row][node.col] = newNode;
    this.gridManagerService.updateGrid(grid);
  }

  private isStarOrEndNode(node: CellNode): boolean {
    return isEqual(this.startNode, node) || isEqual(this.endNode, node);
  }

  trackBy = (index: number, node: CellNode) => {
    return `${node.row},${node.col}`;
  };

  trackByArray = (index: number, node: CellNode[]) => {
    return index;
  };

  ngOnDestroy(): void {

  }
}
