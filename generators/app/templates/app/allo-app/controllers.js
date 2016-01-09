import { BaseController } from 'outlinejs/controllers';
import { AlloView, AlloDetailView } from './views';

export class AlloController extends BaseController {
  static get loginRequired() {
    return false;
  }

  init() {
    this.view = AlloView;
    this.render();
  }

}

export class AlloDetailController extends BaseController {
  static get loginRequired() {
    return false;
  }

  init(detailId) {
    this.view = AlloDetailView;
    this.render({detail: detailId});
  }

}
