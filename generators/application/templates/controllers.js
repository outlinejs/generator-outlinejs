import { BaseLayoutController } from 'outlinejs/lib/controllers';
import { MyLayoutView, MyContentView } from './views';
import { UserCollection } from './managers';
import { runtime } from 'outlinejs/lib/contexts';

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

  async loadUsers(users) {
    try {
      this.render({ myVar: this.i18n.gettext('Users loaded ...'), users: await users.all() });
    } catch (ex) {
      this.render({ myVar: this.i18n.gettext('Users not loaded!!!') });
      console.log(ex);
    }
  }

  init() {
    if (runtime.isClient && !this.isViewRendered) {
      this.render({ myVar: this.i18n.gettext('Loading users ...') });
    }

    var users = new UserCollection();
    this.loadUsers(users);
  }
}
