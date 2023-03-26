import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import Table from './Table';

export default {
  title: 'Atoms/Table',
  component: Table,
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} as ComponentMeta<typeof Table>;

const Template: ComponentStory<typeof Table> = args => <Table {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Placeholder = Template.bind({});
Placeholder.args = {};

export const Disabled = Template.bind({});
Disabled.args = {};
