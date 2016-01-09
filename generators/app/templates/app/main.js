import RootRouter from './urls';
import Boot from 'outlinejs/boot';
import Settings from './settings';

import 'outlinejs/auth/frameworks/backbone';

Boot.init(RootRouter, document.getElementById('main'), new Settings());
