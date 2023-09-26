import { Injectable, inject } from '@angular/core';
import { CellNode } from '../components/models/node.model';
import { GridManagerService } from './grid-manager.service';
import { isEqual, isEqualWith } from 'lodash';

const directions = [
  [-1, 0], // TOP
  [0, 1], // RIGHT
  [1, 0], // DOWN
  [0, -1], // LEFT
] as const;

@Injectable({
  providedIn: 'root',
})
export class PathFindingService {
  gridManagerService = inject(GridManagerService);

  constructor() {}

  bfsPathFinding(start: CellNode, end: CellNode, grid: CellNode[][]) {
    const frontier = [start];
    const closed: { [key: string]: CellNode } = {};

    while (frontier.length > 0) {
      let currentNode = frontier.shift() as CellNode;

      if (this.isEndNode(currentNode, end)) {
        this.createPath(currentNode, grid);
        this.gridManagerService.updateGridWithDelay(grid, 1, true)
        return;
      }

      closed[`${currentNode.row},${currentNode.col}`] = currentNode;
      currentNode.isClosed = true;

      const neighbors = this.getNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        if (closed[`${neighbor.row},${neighbor.col}`] || neighbor.isVisited) {
          continue;
        }
        neighbor.connectedTo = currentNode;
        neighbor.isVisited = true;
        frontier.push(neighbor);
      }
      this.gridManagerService.updateGridWithDelay(grid, 1, false);
    }

    this.gridManagerService.updateGridWithDelay(grid, 1, true);
  }

  getNeighbors(node: CellNode, grid: CellNode[][]) {
    let neighBors: CellNode[] = [];

    for (const direction of directions) {
      const row = node.row + direction[0];
      const col = node.col + direction[1];
      if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
        continue;
      }
      neighBors.push(grid[row][col]);
    }

    return neighBors;
  }

  isEndNode(currentNode: CellNode, endNode: CellNode) {
    return currentNode.row === endNode.row && currentNode.col === endNode.col;
  }

  createPath(node: CellNode, grid: CellNode[][]) {
    let currentNode = node.connectedTo;
    while (currentNode?.connectedTo) {
      currentNode.isPath = true;
      grid[currentNode.row][currentNode.col] = currentNode;
      currentNode = currentNode?.connectedTo;
    }
  }
}
