import { BaseSettings } from 'outlinejs/conf';

export default class extends BaseSettings {
  get MIDDLEWARE() {
    return [require('./allo-app/middleware')];
  }
}
