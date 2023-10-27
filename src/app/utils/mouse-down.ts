import { DOCUMENT } from '@angular/common';
import { ElementRef, InjectionToken, inject } from '@angular/core';
import {
  Observable,
  combineLatest,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  merge,
  shareReplay,
  takeUntil,
} from 'rxjs';

export const MOUSE_DOWN = new InjectionToken<(el: ElementRef) => Observable<any>>(
  'Is Mouse Down',
  {
    providedIn: 'root',
    factory() {
      return (el: ElementRef) => {
        // const mousedown$ = fromEvent(document, 'mousedown').pipe(
        //   filter((e) => (e as MouseEvent).button === 0),
        //   map((_) => true)
        // );
        // const mouseup$ = fromEvent(document, 'mouseup').pipe(
        //   filter((e) => (e as MouseEvent).button === 0),
        //   map((_) => false)
        // );
        // return merge(mousedown$, mouseup$).pipe(distinctUntilChanged());
        return move(el);
      }
    },
  }
);

export function move(el: ElementRef) {
  const down$ = fromEvent<PointerEvent>(el.nativeElement, 'pointerdown').pipe(map(_ => true));
  const up$ = fromEvent<PointerEvent>(el.nativeElement, 'pointerup').pipe(map(_ => false));
  const cancel$ = fromEvent<PointerEvent>(el.nativeElement, 'pointercancel').pipe(map(_ => false));
  const isDown$ = merge(down$, up$, cancel$);
  const move$ = combineLatest([isDown$, fromEvent<PointerEvent>(el.nativeElement, 'pointermove')]).pipe(
    filter(([isDown, _]) => isDown),
    map(([_, val]) => val),
    shareReplay(1)
  );
  const closeSubscription$ = merge(up$, cancel$);
  return move$
  // .pipe(takeUntil(closeSubscription$));
}
