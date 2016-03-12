import { BaseCollection } from 'outlinejs/lib/managers';

import { User } from './models';


export class UserCollection extends BaseCollection {
  get url() {
    return 'http://jsonplaceholder.typicode.com/users';
  }
  get model() {
    return User;
  }
  async all() {
    return await this.fetch();
  }
}
