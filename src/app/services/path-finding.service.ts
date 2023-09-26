import { Injectable } from '@angular/core';
import { CellNode } from '../components/models/node.model';

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
  constructor() {}

  bfsPathFinding(start: CellNode, end: CellNode, grid: CellNode[][]) {
    const frontier = [start];
    const closed: {[key: string]: CellNode} = {};
    
    while(frontier.length > 0) {
      let currentNode = frontier.shift() as CellNode;
      closed[`${currentNode.row,currentNode.col}`] = currentNode;

      const neighBors =this.getNeighbors(currentNode, grid);
      for(const neighBor of neighBors) {
        if(closed[`${neighBor.row,neighBor.col}`] || neighBor.isExplored) {
          continue;
        }
        neighBor.connectedTo = currentNode;
        neighBor.isExplored = true;
        frontier.push(neighBor);
      }
    }
    
  }

  getNeighbors(node: CellNode, grid: CellNode[][]) {
    let neighBors: CellNode[] = [];

    for (const direction of directions) {
      const row = node.row + direction[0];
      const col = node.row + direction[1];
      if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
        continue;
      }
      neighBors.push(grid[row][col]);
    }

    return neighBors;
  }
}
