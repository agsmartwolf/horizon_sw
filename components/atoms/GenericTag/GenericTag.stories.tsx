import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import GenericTag from './GenericTag';

export default {
  title: 'Atoms/GenericTag',
  component: GenericTag,
  argTypes: {
    children: { control: 'text' },
  },
} as ComponentMeta<typeof GenericTag>;

const Template: ComponentStory<typeof GenericTag> = args => (
  <GenericTag {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: 'Available for subscription',
};

export const Secondary = Template.bind({});
Default.args = {
  children: 'Available for subscription',
  secondary: true,
};
