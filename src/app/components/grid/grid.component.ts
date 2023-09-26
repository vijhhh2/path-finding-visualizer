import { AsyncPipe, NgFor } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { isEmpty, isEqual } from 'lodash';

import { NodeComponent } from './node/node.component';
import { CellNode } from '../models/node.model';
import { MODE } from '../models/modes';
import { ModeManagerService } from 'src/app/services/mode-manager.service';
import { PathFindingService } from 'src/app/services/path-finding.service';
import { MatButtonModule } from '@angular/material/button';

const arrayRange = (start: number, stop: number, step: number) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  standalone: true,
  imports: [NgFor, MatCardModule, NodeComponent, AsyncPipe, MatButtonModule],
})
export class GridComponent implements OnInit {
  // dependencies
  modeManager = inject(ModeManagerService);
  pathFindingService = inject(PathFindingService);

  grid: CellNode[][] = [[]];

  rows = 20;
  cols = 50;

  startNode!: CellNode;
  endNode!: CellNode;

  mode$: Observable<MODE> = this.modeManager.mode$.asObservable();

  ngOnInit(): void {
    this.grid = new Array(this.rows).fill(0).map((_, row) => {
      return new Array(this.cols).fill(0).map((_, col) => {
        return {
          row,
          col,
          isStart: false,
          isEnd: false,
          isWall: false,
          isExplored: false,
        } as CellNode;
      });
    });
  }

  startPathFinding() {
    if (isEmpty(this.startNode) || isEmpty(this.endNode)) {
      throw new Error(
        'To start path finding you need to specify start and end node'
      );
    }
    this.pathFindingService.bfsPathFinding(
      this.startNode,
      this.endNode,
      this.grid
    );
  }

  onCellNodeClicked(node: CellNode) {
    console.log(node);
    const mode = this.modeManager.mode;
    switch (mode) {
      case 'START':
        this.updateStartNode(node);
        // this.pathFindingService.bfsPathFinding(node, node, this.grid);
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
    // If its empty update start node directly
    if (isEmpty(this.startNode)) {
      this.startNode = node;
    } else {
      // Set previous start node isStart false
      this.grid[this.startNode.row][this.startNode.col] = {
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
    this.grid[node.row][node.col] = this.startNode;
  }

  private updateEndNode(node: CellNode) {
    // If its empty update end node directly
    if (isEmpty(this.endNode)) {
      this.endNode = node;
    } else {
      // Set previous start node isEnd false
      this.grid[this.endNode.row][this.endNode.col] = {
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
    this.grid[node.row][node.col] = this.endNode;
  }

  private updateWallNode(node: CellNode) {
    // Check if this node is start or end.
    // If it is return
    if (this.isStarOrEndNode(node)) {
      return;
    }

    // Update node received isWall to true/false and update node in th grid
    this.grid[node.row][node.col] = {
      ...node,
      isWall: !node.isWall,
    };
  }

  private resetNode(node: CellNode) {
    const newNode = {
      ...node,
      isStart: false,
      isEnd: false,
      isWall: false,
      isExplored: false,
    } as CellNode;

    this.grid[node.row][node.col] = newNode;
  }

  private isStarOrEndNode(node: CellNode): boolean {
    return isEqual(this.startNode, node) || isEqual(this.endNode, node);
  }
}
