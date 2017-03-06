import 'babel-polyfill';

import {Boot} from 'outlinejs';

import RootRouter from './urls';
import Settings from './settings';


Boot.init(Settings, RootRouter, 'main');
