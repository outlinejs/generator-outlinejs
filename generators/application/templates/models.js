import { BaseModel } from 'outlinejs/models';

export class User extends BaseModel {
  get id() {
    return this.get('id');
  }
  get displayName() {
    return this.get('name');
  }
  get email() {
    return this.get('email');
  }
}
