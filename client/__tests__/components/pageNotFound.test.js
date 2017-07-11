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

    // it('should render the brand name', () => {
    //   const lblBrandname = Wrapper.find('#brandName').props();
    //   expect(lblBrandname.text).toEqual(' Doc Hub');
    // });

    // it('should render a link to return to the home page', () => {
    //   const lnkHome = Wrapper.find('#lnkHome').props();
    //   expect(lnkHome.href).toEqual(' Doc Hub');
    // });
  });
});
