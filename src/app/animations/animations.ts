import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [animate('1s', style({
    backgroundColor: 'yellow',
    opacity: 1
  }))]),
]);
export const explored = trigger('explored', [
  state(
    'explored',
    style({
      backgroundColor: 'yellow',
    })
  ),
  state(
    'default',
    style({
      backgroundColor: 'white',
    })
  ),
  transition('void => explored', [animate('1s')]),
  transition('default => explored', [animate('1s')]),
]);
