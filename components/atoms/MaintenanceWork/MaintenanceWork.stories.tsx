import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import MaintenanceWork from './MaintenanceWork';

export default {
  title: 'Atoms/MaintenanceWork',
  component: MaintenanceWork,
  argTypes: {},
} as ComponentMeta<typeof MaintenanceWork>;

const Template: ComponentStory<typeof MaintenanceWork> = args => (
  <MaintenanceWork {...args} />
);

export const Default = Template.bind({});
Default.args = {};
