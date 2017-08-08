import React from 'react';
import toaster from 'toastr';
import { mount } from 'enzyme';
import { Login } from '../../components/Login';

toaster.info = jest.fn(message => '');

const mockEvent = {
  preventDefault: jest.fn(),
  target: {
    name: 'email',
    value: 'okorocele@test.com'
  }
};

const setup = () => {
  const props = {
    siginin: jest.fn(),
    loginMessage: ''
  };

  const Wrapper = mount(
    <Login {...props} />
  );
  return {
    props,
    Wrapper
  };
};


describe('Login component', () => {
  const { Wrapper, props } = setup();

  it('should render email textbox for email only', () => {
    const txtEmail = Wrapper.find('#email').props();
    expect(txtEmail.required).toEqual(true);
    expect(txtEmail.placeholder).toEqual('Email');
    expect(txtEmail.className).toEqual('validate');

    txtEmail.onChange(mockEvent);
    expect(Wrapper.state('email')).toEqual(mockEvent.target.value);

    mockEvent.target.value = 'okoro@te';
    txtEmail.onChange(mockEvent);
    const errMessage = 'Please input a valid email address';
    expect(Wrapper.state('emailValidator')).toEqual(errMessage);
  });

  it(`should render a texbox for password,
    value should be at least 8 characters;
    including a number and specail character`, () => {
    const txtPassword = Wrapper.find('#password').props();
    expect(txtPassword.required).toBe(true);
    expect(txtPassword.placeholder).toEqual('Password');
    expect(txtPassword.className).toEqual('validate');
    mockEvent.target = {
      name: 'password',
      value: 'test'
    };
    txtPassword.onChange(mockEvent);
    expect(Wrapper.state('password'))
    .toEqual(mockEvent.target.value);
  });

  it('should render a button to login', () => {
    const btnSubmit = Wrapper.find('#signinSubmit').props();
    expect(btnSubmit.type).toBe('submit');

    expect(btnSubmit.onClick).toBeInstanceOf(Function);
    btnSubmit.onClick(mockEvent);
    expect(props.siginin.mock.calls.length).toBe(1);
  });

  it('should render message from \'login\' actions ', () => {
    Wrapper.setProps({
      messageFrom: 'login',
      message: 'welcome'
    });
    const messageState = Wrapper.state('message');
    const isSubString = messageState.includes('welcome');
    expect(isSubString).toEqual(true);
  });
});
