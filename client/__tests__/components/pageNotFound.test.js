import React from 'react';
import Renderer from 'react-test-renderer';
import pageNotFound from '../../components/pageNotFound';

describe('rendering', () => {
  it('should render content as describe in the component', () => {
    const component = Renderer.create(
      <pageNotFound />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});