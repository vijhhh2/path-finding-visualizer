import { S, W, E, ESCAPE, R } from '@angular/cdk/keycodes';
import {
  Injectable,
  OnDestroy,
  Renderer2,
  RendererFactory2,
  inject,
} from '@angular/core';
import { MODE } from '../components/models/modes';
import {
  BehaviorSubject,
  Subject,
  fromEventPattern,
  map,
  takeUntil,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModeManagerService implements OnDestroy {
  // Dependencies
  rendererFactory2 = inject(RendererFactory2);

  #mode: MODE = 'NONE';
  mode$ = new BehaviorSubject<MODE>(this.#mode);
  destroy$ = new Subject<void>();

  get mode() {
    return this.#mode;
  }

  constructor() {
    const renderer = this.rendererFactory2.createRenderer(null, null);
    this.onkeyDownListener(renderer);
  }

  onkeyDownListener(renderer: Renderer2) {
    let removeListener: () => void;
    const createEventListener = (handler: (e: Event) => boolean | void) => {
      removeListener = renderer.listen('document', 'keydown', handler);
    };
    fromEventPattern<KeyboardEvent>(createEventListener, () => removeListener())
      .pipe(
        takeUntil(this.destroy$),
        map((e) => e?.keyCode),
      )
      .subscribe(this.onkeyDown.bind(this));
  }

  onkeyDown(keyCode: number) {
    switch (keyCode) {
      case S:
        this.toggleStartMode();
        break;
      case W:
        this.toggleWallMode();
        break;
      case E:
        this.toggleEndMode();
        break;
      case R:
        this.toggleResetMode();
        break;
      case ESCAPE:
        this.enterNoneMode();
        break;
      default:
        console.log('Please escape to enter NONE');
    }
  }

  updateMode(mode: MODE) {
    this.#mode = mode;
    this.mode$.next(this.#mode);
  }

  enterNoneMode() {
    if (this.#mode !== 'NONE') {
      this.updateMode('NONE');
    }
  }

  toggleEndMode() {
    if (this.#mode === 'END') {
      this.updateMode('NONE');
    } else {
      this.updateMode('END');
    }
  }

  toggleWallMode() {
    if (this.#mode === 'WALL') {
      this.updateMode('NONE');
    } else {
      this.updateMode('WALL');
    }
  }

  toggleStartMode() {
    if (this.#mode === 'START') {
      this.updateMode('NONE');
    } else {
      this.updateMode('START');
    }
  }

  toggleResetMode() {
    if (this.#mode === 'RESET') {
      this.updateMode('NONE');
    } else {
      this.updateMode('RESET');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
