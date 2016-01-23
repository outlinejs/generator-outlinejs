import RootRouter from './urls';
import Boot from 'outlinejs/boot';
import Settings from './settings';

Boot.init(RootRouter, document.getElementById('main'), new Settings());
