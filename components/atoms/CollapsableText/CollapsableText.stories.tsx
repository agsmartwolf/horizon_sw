import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import CollapsableText from './CollapsableText';

export default {
  title: 'atoms/CollapsableText',
  component: CollapsableText,
  argTypes: {
    text: { control: 'text' },
  },
} as ComponentMeta<typeof CollapsableText>;

const Template: ComponentStory<typeof CollapsableText> = args => (
  <CollapsableText {...args} />
);

export const Default = Template.bind({});
Default.args = {
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc vel tincidunt lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl si',
};
