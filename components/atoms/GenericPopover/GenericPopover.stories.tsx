import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import GenericPopover from './GenericPopover';

export default {
  title: 'atoms/GenericPopover',
  component: GenericPopover,
  argTypes: {
    onChange: { table: { disable: true } },
  },
} as ComponentMeta<typeof GenericPopover>;

const Template: ComponentStory<typeof GenericPopover> = args => (
  <GenericPopover {...args} />
);

export const Default = Template.bind({});

Default.args = {
  defaultOpen: false,
  name: 'GenericPopover',
  children: (
    <ul>
      <li>Option</li>
      <li>Option</li>
      <li>Option</li>
      <li>Option</li>
      <li>Option</li>
    </ul>
  ),
};
