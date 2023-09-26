import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellNode } from '../../models/node.model';
import { CellStateClassPipe } from '../cell-state-class/cell-state-class.pipe';
import { explored } from '../../../animations/animations';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [CommonModule, CellStateClassPipe],
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [explored]
})
export class NodeComponent {
  @Input({ required: true, alias: 'node' }) cellNode!: CellNode;
  @Output() cellNodeClicked = new EventEmitter<CellNode>();

  @HostListener('click', ['$event.target'])
  onClick() {
    this.cellNodeClicked.emit(this.cellNode);
  }
}
