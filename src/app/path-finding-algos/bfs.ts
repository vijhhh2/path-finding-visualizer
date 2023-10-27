import { CellNode, Grid } from '../models/node.model';
import {
  Algos,
  PathFinding,
} from '../models/path-finding.interface';
import { DIRECTIONS } from '../constants/directions';
import { GridManagerService } from '../services/grid-manager.service';

export class BFS implements PathFinding {
  name: Algos = 'BFS';

  constructor(private gridManagerService: GridManagerService) {}

  findPath(start: CellNode, end: CellNode, grid: Grid) {
    this.bfsPathFinding(start, end, grid);
  }

  bfsPathFinding(start: CellNode, end: CellNode, grid: Grid) {
    const frontier = [start];
    const closed: { [key: string]: CellNode } = {};

    while (frontier.length > 0) {
      let currentNode = frontier.shift() as CellNode;

      if (this.isEndNode(currentNode, end)) {
        this.createPath(currentNode, grid);
        break;
      }

      closed[`${currentNode.row},${currentNode.col}`] = currentNode;
      currentNode.isClosed = true;

      const neighbors = this.getNeighbors(currentNode, grid);
      for (const neighbor of neighbors) {
        if (
          closed[`${neighbor.row},${neighbor.col}`] ||
          neighbor.isVisited ||
          neighbor.isWall
        ) {
          continue;
        }
        neighbor.connectedTo = currentNode;
        neighbor.isVisited = true;
        frontier.push(neighbor);
      }
      this.gridManagerService.updateGridWithDelayUpdated(grid, false);
    }

    this.gridManagerService.updateGridWithDelayUpdated(grid, true);
  }

  getNeighbors(node: CellNode, grid: Grid) {
    let neighBors: CellNode[] = [];

    for (const direction of DIRECTIONS) {
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
