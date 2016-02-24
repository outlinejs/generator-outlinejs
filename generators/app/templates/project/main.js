import RootRouter from './urls';
import Boot from 'outlinejs/boot';
import Settings from './settings';

Boot.init(Settings, RootRouter, 'main');
