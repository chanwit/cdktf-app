import { App } from 'cdktf';

import { AppStack } from './app'
import { BootstrapStack } from './bootstrap'

const app = new App();
new AppStack(app, 'app');
new BootstrapStack(app, 'bootstrap')
app.synth();
