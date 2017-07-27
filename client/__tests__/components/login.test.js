import React from 'react';
import toaster from 'toastr';
import { mount } from 'enzyme';
import { Login } from '../../components/Login';

toaster.info = jest.fn(message => '');
const mockEvent = {
  preventDefault: jest.fn(),
  target: {
    name: 'password',
    value: 'test'
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


describe('components', () => {
  describe('Login', () => {
    const { Wrapper, props } = setup();
    describe('should render a Login form', () => {
      it('should render a form', () => {
        expect(Wrapper.find('form')).not.toBeNull();
      });

      describe('should render a textbox for email', () => {
        const txtFname = Wrapper.find('#email').props();
        it('textbox should be required', () => {
          expect(txtFname.required).toEqual(true);
        });
        it('should have a placeholder "Email"', () => {
          expect(txtFname.placeholder).toEqual('Email');
        });
        it('should have a className "validate"', () => {
          expect(txtFname.className).toEqual('validate');
        });
      });

      describe('should render a textbox for password', () => {
        const txtPassword = Wrapper.find('#password').props();
        it('textbox should be required', () => {
          expect(txtPassword.required).toBe(true);
        });
        it('should have a placeholder "Password"', () => {
          expect(txtPassword.placeholder).toEqual('Password');
        });
        it('should have a className "validate"', () => {
          expect(txtPassword.className).toEqual('validate');
        });
        it(`onChange event should invoke a function "onChange";
          `, () => {
          txtPassword.onChange(mockEvent);
          expect(Wrapper.state('password'))
          .toEqual(mockEvent.target.value);
        });
      });

      describe('should render a  button', () => {
        const btnSubmit = Wrapper.find('#signinSubmit').props();
        it('should have a type "submit" ', () => {
          expect(btnSubmit.type).toBe('submit');
        });
        it('should invoke the save method on click', () => {
          expect(btnSubmit.onClick).toBeInstanceOf(Function);
          btnSubmit.onClick(mockEvent);
          expect(props.siginin.mock.calls.length).toBe(1);
        });
      });
      it('should render message from \'login\' actions ', () => {
          Wrapper.setProps({
            messageFrom: 'login',
            message: 'welcome'
          });
          const messageState = Wrapper.state('message');
          const isSubString = messageState.includes("welcome")
          expect(isSubString).toEqual(true);
      });
    });
  });
});
