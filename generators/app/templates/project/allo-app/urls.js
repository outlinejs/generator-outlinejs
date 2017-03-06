import { routers } from 'outlinejs';
import { routing } from 'outlinejs';

import { AlloController, AlloDetailController } from './controllers';


export default class extends routers.BaseRouter {
  static get urlPatterns() {
    return {
      '': routing.i18nUrl('allo:home', AlloController),
      'other/:detailId:': routing.i18nUrl('allo:other', AlloDetailController)
    };
  }
}
