import { BaseRouter, include } from 'outlinejs/routers';
import AlloAppRouter from './allo-app/urls';

export default class extends BaseRouter {
  get urlPatterns() {
    return {
      '': include(AlloAppRouter)
    };
  }
}
