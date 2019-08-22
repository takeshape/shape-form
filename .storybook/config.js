import { configure, addDecorator } from '@storybook/react';
import StorybookDecorator from './storybook-decorator';

addDecorator(StorybookDecorator);

function loadStories() {
  const req = require.context('../src', true, /\.stories\.[jt]sx$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);