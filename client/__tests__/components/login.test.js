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
  describe('should render a Login form', () => {
    it('should render a form', () => {
      expect(Wrapper.find('form')).not.toBeNull();
    });

    describe('should render a textbox for email', () => {
      const txtEmail = Wrapper.find('#email').props();
      it('textbox should be required', () => {
        expect(txtEmail.required).toEqual(true);
      });

      it('should have a placeholder "Email"', () => {
        expect(txtEmail.placeholder).toEqual('Email');
      });

      it('should have a className "validate"', () => {
        expect(txtEmail.className).toEqual('validate');
      });

      describe('triggers the \'onChange\' function when a user enter a text',
      () => {
        it('should accept only a value email address', () => {
          txtEmail.onChange(mockEvent);
          expect(Wrapper.state('email')).toEqual(mockEvent.target.value);
        });

        it('should throw an error for invalid email address', () => {
          mockEvent.target.value = 'okoro@te';
          txtEmail.onChange(mockEvent);
          const errMessage = 'Please input a valid email address';
          expect(Wrapper.state('emailValidator')).toEqual(errMessage);
        });
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

      it('should trigger the \'onChange\' function when a user enter a text',
      () => {
        mockEvent.target = {
          name: 'password',
          value: 'test'
        };
        txtPassword.onChange(mockEvent);
        expect(Wrapper.state('password'))
        .toEqual(mockEvent.target.value);
      });
    });

    describe('should render a  submit button', () => {
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
      const isSubString = messageState.includes('welcome');
      expect(isSubString).toEqual(true);
    });
  });
});
