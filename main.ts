import { App } from 'cdktf';

import { AppStack } from './stacks/app'
import { BootstrapStack } from './stacks/bootstrap'

const app = new App();
new AppStack(app, 'app');
new BootstrapStack(app, 'bootstrap')
app.synth();
