import { AsyncPipe, NgFor } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { isEqual } from 'lodash';

import { NodeComponent } from './node/node.component';
import { CellNode } from '../models/node.model';
import { MODE } from '../models/modes';
import { ModeManagerService } from 'src/app/services/mode-manager.service';

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
  imports: [NgFor, MatCardModule, NodeComponent, AsyncPipe],
})
export class GridComponent implements OnInit {
  // dependencies
  modeManager = inject(ModeManagerService);

  grid: CellNode[][] = [[]];

  rows = arrayRange(0, 19, 1);
  cols = arrayRange(0, 49, 1);

  startNode!: CellNode;
  endNode!: CellNode;

  mode$: Observable<MODE> = this.modeManager.mode$.asObservable();

  ngOnInit(): void {
    this.grid = new Array(20).fill(0).map((_, row) => {
      return new Array(50).fill(0).map((_, col) => {
        return {
          row,
          col,
          isStart: row === 13 && col === 5 ? true : false,
          isEnd: row === 4 && col === 42 ? true : false,
          isWall: false,
          isExplored: false,
        } as CellNode;
      });
    });

    this.startNode = this.grid[13][5];
    this.endNode = this.grid[4][42];
  }

  onCellNodeClicked(node: CellNode) {
    console.log(node);
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
      default:
        break;
    }
  }

  private updateStartNode(node: CellNode) {
    this.grid[this.startNode.row][this.startNode.col] = {
      ...this.startNode,
      isStart: false
    };
    this.startNode = {
      ...node,
      isStart: true
    };
    this.grid[node.row][node.col] = this.startNode;
  }

  private updateEndNode(node: CellNode) {
    this.grid[this.endNode.row][this.endNode.col] = {
      ...this.endNode,
      isEnd: false
    };
    this.endNode = {
      ...node,
      isEnd: true
    };
    this.grid[node.row][node.col] = this.endNode;
  }

  private updateWallNode(node: CellNode) {
    if(this.isStarOrEndNode(node)) {
      return;
    }
    this.grid[node.row][node.col] = {
      ...node,
      isWall: !node.isWall
    }
  }

  private isStarOrEndNode(node: CellNode): boolean {
    return (isEqual(this.startNode, node) || isEqual(this.endNode, node));
  }
}
