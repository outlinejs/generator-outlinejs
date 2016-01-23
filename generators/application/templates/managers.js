import { BaseCollection } from 'outlinejs/managers';
import { User } from './models';

export class UserCollection extends BaseCollection {
  get url() {
    return 'http://jsonplaceholder.typicode.com/users';
  }
  get model() {
    return User;
  }
}
