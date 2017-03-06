import { routers } from 'outlinejs';
import { routing } from 'outlinejs';

import { MyController } from './controllers';


export default class extends routers.BaseRouter {
  static get urlPatterns() {
    return {
      '': routing.i18nUrl('<%= applicationSlug %>:main', MyController)
    };
  }
}
