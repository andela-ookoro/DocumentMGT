import React from 'react';
import { mount } from 'enzyme';
import Header from '../../components/Signup';

const setup = () => {
  const props = {
    addTodo: jest.fn()
  };

  const enzymeWrapper = mount(<Header {...props} />);

  return {
    props,
    enzymeWrapper
  };
};


describe('components', () => {
  describe('Header', () => {
    it('should render self and subcomponents', () => {
      const { enzymeWrapper } = setup();

      expect(enzymeWrapper.find('header').hasClass('header')).toBe(true);

      expect(enzymeWrapper.find('h1').text()).toBe('todos');

      const todoInputProps = enzymeWrapper.find('TodoTextInput').props();
      expect(todoInputProps.newTodo).toBe(true);
      expect(todoInputProps.placeholder).toEqual('What needs to be done?');
    });

    it('should call addTodo if length of text is greater than 0', () => {
      const { enzymeWrapper, props } = setup();
      const input = enzymeWrapper.find('TodoTextInput');
      input.props().onSave('');
      expect(props.addTodo.mock.calls.length).toBe(0);
      input.props().onSave('Use Redux');
      expect(props.addTodo.mock.calls.length).toBe(1);
    });
  });
});
