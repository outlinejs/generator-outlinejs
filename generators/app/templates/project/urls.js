import { routers } from 'outlinejs';
import { routing } from 'outlinejs';

import AlloAppRouter from './allo-app/urls';


export default class extends routers.BaseRouter {
  static get urlPatterns() {
    return {
      '': routing.include(AlloAppRouter)
    };
  }
}
