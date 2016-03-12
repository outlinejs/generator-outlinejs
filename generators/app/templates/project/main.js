import 'babel-polyfill';

import Boot from 'outlinejs/lib/boot';

import RootRouter from './urls';
import Settings from './settings';


Boot.init(Settings, RootRouter, 'main');
