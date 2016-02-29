import { BaseSettings } from 'outlinejs/lib/conf';

export default class extends BaseSettings {
  get MIDDLEWARE() {
    return [require('./allo-app/middleware')];
  }
}
