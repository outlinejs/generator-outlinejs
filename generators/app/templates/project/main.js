import 'babel-polyfill';
import RootRouter from './urls';
import Boot from 'outlinejs/lib/boot';
import Settings from './settings';

Boot.init(Settings, RootRouter, 'main');
