import { BaseRouter, url } from 'outlinejs/lib/routers';

import { AlloController, AlloDetailController } from './controllers';


export default class extends BaseRouter {
  get urlPatterns() {
    return {
      '': url('allo:home', AlloController),
      'other/:detailId:': url('allo:other', AlloDetailController)
    };
  }
}
