import { controllers } from 'outlinejs';

import { AlloView, AlloDetailView } from './views';


export class AlloController extends controllers.BaseController {
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

export class AlloDetailController extends controllers.BaseController {
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
