import { BaseController } from 'outlinejs/lib/controllers';

import { AlloView, AlloDetailView } from './views';


export class AlloController extends BaseController {
  static get loginRequired() {
    return false;
  }

  get view() {
    return AlloView;
  }

  init() {
    this.render();
  }

}

export class AlloDetailController extends BaseController {
  static get loginRequired() {
    return false;
  }

  get view() {
    return AlloDetailView;
  }

  init(detailId) {
    this.render({detail: detailId});
  }

}
