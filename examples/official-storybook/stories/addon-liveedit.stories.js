import React from 'react';
import { storiesOf } from '@storybook/react';
import { withLiveEdit } from '@storybook/addon-liveedit';

storiesOf('Addons|Live Edit', module).add(
  'first test',
  withLiveEdit(() => <div>This story should have changed the name of the storybook</div>)
);
