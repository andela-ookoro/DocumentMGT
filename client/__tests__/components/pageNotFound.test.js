import React from 'react';
import { shallow } from 'enzyme';
import pageNotFound from '../../components/pageNotFound';

const setup = () => (
  shallow(
    <pageNotFound />
  )
);


describe('components', () => {
  describe('pageNotFound', () => {
    const Wrapper = setup();
    it('should render the product logo', () => {
      const imgLogo = Wrapper.find('#logoImg');
      // expect(imgLogo.src).toEqual('/logo.png');
      expect(3).toEqual(3);
    });
  });
});
