import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import ProductColorSelect from './ProductColorSelect';

export default {
  title: 'Atoms/ProductColorSelect',
  component: ProductColorSelect,
  argTypes: {
    text: { control: 'text' },
  },
  decorators: [
    Story => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof ProductColorSelect>;

const Template: ComponentStory<typeof ProductColorSelect> = args => (
  <ProductColorSelect {...args} />
);

export const Default = Template.bind({});

Default.args = {
  label: 'Trial for 30 days',
};
