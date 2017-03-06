import { controllers } from 'outlinejs';

import { MyLayoutView, MyContentView } from './views';


export class MyController extends controllers.BaseLayoutController {
  static get loginRequired() {
    return false;
  }

  get layoutView() {
    return MyLayoutView;
  }

  get view() {
    return MyContentView;
  }

  init() {
    this.render();
  }
}
