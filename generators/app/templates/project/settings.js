import { conf } from 'outlinejs';


export default class extends conf.BaseSettings {
  get MIDDLEWARE() {
    return [require('./allo-app/middleware')];
  }
}
