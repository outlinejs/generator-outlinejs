import { BaseLayoutController } from 'outlinejs/controllers';
import { MyLayoutView, MyContentView } from './views';
import { UserCollection } from './managers';
import { gettext } from 'outlinejs/utils/translation';
import { runtime } from 'outlinejs/contexts';

export class MyController extends BaseLayoutController {
  static get loginRequired() {
    return false;
  }

  get layoutView() {
    return MyLayoutView;
  }

  get view() {
    return MyContentView;
  }

  init() {
    if (runtime.isClient && !this.isViewRendered) {
      this.render({ myVar: gettext('Loading users ...') });
    }

    var users = new UserCollection();
    users.fetch().then(() => {
      this.render({ myVar: gettext('Users loaded ...'), users: users });
    }).catch((err) => {
      console.log(err);
    });
  }
}
