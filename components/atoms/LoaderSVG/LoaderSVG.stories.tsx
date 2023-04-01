import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import LoaderSVG from './LoaderSVG';

export default {
  title: 'Atoms/LoaderSVG',
  component: LoaderSVG,
  argTypes: {
    text: { control: 'text' },
  },
} as ComponentMeta<typeof LoaderSVG>;

const Template: ComponentStory<typeof LoaderSVG> = args => (
  <LoaderSVG {...args} />
);

export const Default = Template.bind({});
Default.args = {
  text: 'First name',
};
