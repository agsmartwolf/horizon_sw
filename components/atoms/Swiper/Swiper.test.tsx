import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Swiper from './Swiper';

describe('<Swiper />', () => {
  test('it should mount', () => {
    render(<Swiper />);
    
    const swiper = screen.getByTestId('Swiper');

    expect(swiper).toBeInTheDocument();
  });
});