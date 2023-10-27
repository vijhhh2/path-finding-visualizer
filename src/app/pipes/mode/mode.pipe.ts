import { Pipe, PipeTransform } from '@angular/core';
import { MODE } from '../../models/modes';

const resources: {[key: string]: {image: string, description: string}} = {
  NONE: {
    image: 'assets/none.png',
    description: 'You do not have the capability to position the nodes.'
  },
  START: {
    image: 'assets/start.png',
    description: 'You have the ability to position the start node.'
  },
  END: {
    image: 'assets/end.png',
    description: 'You have the ability to position the end node.'
  },
  WALL: {
    image: 'assets/wall.png',
    description: 'You have the option to position the wall nodes strategically, guiding the algorithm to discover a path that circumvents them.'
  },
};
@Pipe({
  name: 'mode',
  standalone: true
})
export class ModePipe implements PipeTransform {

  transform(mode: MODE | null): {image: string, description: string} {
    if (!mode) {
     return {
      image: '',
      description: ''
     };
    }
    return resources[mode];
  }

}
