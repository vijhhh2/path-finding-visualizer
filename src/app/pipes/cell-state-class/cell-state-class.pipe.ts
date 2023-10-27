import { Pipe, PipeTransform } from '@angular/core';
import { isEmpty } from 'lodash';
import { CellNode } from '../../models/node.model';

@Pipe({
  name: 'cellStateClass',
  standalone: true,
})
export class CellStateClassPipe implements PipeTransform {
  transform(node: CellNode): string {
    if (isEmpty(node)) {
      return '';
    }
    if (node.isStart) {
      return 'start';
    } else if (node.isEnd) {
      return 'end';
    } else if (node.isWall) {
      return 'wall';
    } else if (node.isPath) {
      return 'path';
    } else if (node.isClosed) {
      return 'closed';
    } else if (node.isVisited) {
      return 'visited';
    } else {
      return '';
    }
  }
}
