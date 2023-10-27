import { MinPriorityQueue } from '@datastructures-js/priority-queue';

import { ALL_DIRECTIONS } from '../constants/directions';
import { CellNode, Grid } from '../models/node.model';
import { Algos, PathFinding } from '../models/path-finding.interface';
import { isEqual, isEqualWith } from 'lodash';
import { inject } from '@angular/core';
import { GridManagerService } from '../services/grid-manager.service';

export class AStar implements PathFinding {
  name: Algos = 'A*';

  constructor(private gridManagerService: GridManagerService) {}

  findPath(start: CellNode, end: CellNode, grid: Grid) {
    const frontier = new MinPriorityQueue<CellNode>((node) => node.fCost ?? 0);
    const closed: { [key: string]: CellNode } = {};

    frontier.enqueue(start);
    while (frontier.size() > 0) {
      const currentNode = frontier.dequeue();
      closed[`${currentNode.row},${currentNode.col}`] = currentNode;
      currentNode.isClosed = true;

      if (this.isEndNode(currentNode, end)) {
        this.createPath(currentNode, grid);
        break;
      }

      const neighbors = this.getNeighbors(currentNode, grid);

      for (const neighbor of neighbors) {
        if (
          closed[`${neighbor.row},${neighbor.col}`] ||
          neighbor.isVisited ||
          neighbor.isWall
        ) {
          continue;
        }

        const newMovementCostToNeighbor =
          (currentNode.gCost || 0) +
          this.getDistanceBetweenTwoNodes(currentNode, neighbor);
        if (
          newMovementCostToNeighbor < neighbor.gCost ||
          !this.isContains(neighbor, frontier.toArray())
        ) {
          neighbor.gCost = newMovementCostToNeighbor;
          neighbor.hCost = this.getDistanceBetweenTwoNodes(neighbor, end);
          neighbor.fCost = neighbor.gCost + neighbor.hCost;
          neighbor.connectedTo = currentNode;
          neighbor.isVisited = true;

          if (!this.isContains(neighbor, frontier.toArray())) {
            frontier.enqueue(neighbor);
          }
        }
      }

      this.gridManagerService.updateGridWithDelayUpdated(grid, false);
    }
    this.gridManagerService.updateGridWithDelayUpdated(grid, true);
  }

  getNeighbors(node: CellNode, grid: Grid) {
    let neighBors: CellNode[] = [];

    for (const direction of ALL_DIRECTIONS) {
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

  getDistanceBetweenTwoNodes(nodeA: CellNode, nodeB: CellNode) {
    const distX = Math.abs(nodeA.row - nodeB.row);
    const distY = Math.abs(nodeA.col - nodeB.col);

    if (distX > distY) {
      return 14 * distY + 10 * (distX - distY);
    } else {
      return 14 * distX + 10 * (distY - distX);
    }
  }

  isContains(nodeToFind: CellNode, nodes: CellNode[]) {
    return (
      nodes.filter((node) => {
        return isEqualWith(
          nodeToFind,
          node,
          (a, b) => a.row === b.row && a.col === b.col
        );
      }).length > 0
    );
  }
}
