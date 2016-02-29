import { MyController } from './controllers';
import { BaseRouter, url } from 'outlinejs/lib/routers';

export default class extends BaseRouter {
  get urlPatterns() {
    return {
      '': url('<%= applicationSlug %>:main', MyController)
    };
  }
}
