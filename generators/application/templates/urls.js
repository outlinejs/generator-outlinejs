import { BaseRouter, url } from 'outlinejs/lib/routers';

import { MyController } from './controllers';


export default class extends BaseRouter {
  get urlPatterns() {
    return {
      '': url('<%= applicationSlug %>:main', MyController)
    };
  }
}
