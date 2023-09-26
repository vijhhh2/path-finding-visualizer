import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { cloneDeep, isEmpty, isEqual } from 'lodash';

import { NodeComponent } from './node/node.component';
import { CellNode } from '../models/node.model';
import { MODE } from '../models/modes';
import { ModeManagerService } from 'src/app/services/mode-manager.service';
import { PathFindingService } from 'src/app/services/path-finding.service';
import { MatButtonModule } from '@angular/material/button';
import { GridManagerService } from '../../services/grid-manager.service';
import { explored } from '../../animations/animations';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, MatCardModule, NodeComponent, AsyncPipe, MatButtonModule],
  animations: [
    explored
  ]
})
export class GridComponent implements OnInit {
  // dependencies
  modeManager = inject(ModeManagerService);
  pathFindingService = inject(PathFindingService);
  gridManagerService = inject(GridManagerService);

  grid$ = this.gridManagerService.grid$.asObservable();

  startNode: CellNode | null = null;
  endNode: CellNode | null = null;

  mode$: Observable<MODE> = this.modeManager.mode$.asObservable();
  isPathFindingInProgress$ = this.gridManagerService.isPathFindingInProgress$;

  ngOnInit(): void {
    this.gridManagerService.createGrid();
  }

  startPathFinding() {
    if (isEmpty(this.startNode) || isEmpty(this.endNode)) {
      throw new Error(
        'To start path finding you need to specify start and end node'
      );
    }
    this.gridManagerService.isPathFindingInProgress$.next(true);
    this.pathFindingService.bfsPathFinding(
      this.startNode,
      this.endNode,
      cloneDeep(this.gridManagerService.grid)
    );
  }

  clearGrid() {
    this.gridManagerService.createGrid();
    this.startNode = null;
    this.endNode = null;
  }

  onCancel() {
    this.gridManagerService.pathFindingSubscription?.unsubscribe();
    this.gridManagerService.clearGridUpdates();
    // this.clearGrid();
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
}
