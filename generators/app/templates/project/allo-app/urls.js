import { AlloController, AlloDetailController } from './controllers';
import { BaseRouter, url } from 'outlinejs/routers';

export default class extends BaseRouter {
  get urlPatterns() {
    return {
      '': url('allo:home', AlloController),
      'other/:detailId:': url('allo:other', AlloDetailController)
    };
  }
}
