import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellNode } from '../../../models/node.model';
import { CellStateClassPipe } from '../../../pipes/cell-state-class/cell-state-class.pipe';
import { explored } from '../../../animations/animations';
import { MOUSE_DOWN } from '../../../utils/mouse-down';
import { combineLatest, fromEvent, map, switchMap } from 'rxjs';
import { merge } from 'lodash';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [CommonModule, CellStateClassPipe],
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [explored],
})
export class NodeComponent implements OnInit, OnDestroy {
  @Input({ required: true, alias: 'node' }) cellNode!: CellNode;
  @Input() isMouseDown: boolean | null = null;
  @Output() cellNodeClicked = new EventEmitter<CellNode>();
  mouseDown$ = inject(MOUSE_DOWN);
  host = inject(ElementRef);

  isMouseOver = false;

  @HostListener('click', ['$event.target'])
  onClick() {
    this.cellNodeClicked.emit(this.cellNode);
  }

  // @HostListener('mouseover', ['$event'])
  // onMouseOver() {
  //   // console.log(this.cellNode.row, this.cellNode.col);
  //   this.mouseDown$.subscribe(val => {
  //   this.cellNodeClicked.emit();
  //   console.log(this.cellNode.row, this.cellNode.col);
  //   });
  // }

  @HostListener('mouseover', ['$event'])
  onMouseOver() {
    this.isMouseOver = true;
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave() {
    this.isMouseOver = false;
  }

  ngOnInit(): void {

  }

  toggleWall() {
    this.cellNode.isWall = !this.cellNode.isWall;
  }

  ngOnDestroy(): void {}
}
