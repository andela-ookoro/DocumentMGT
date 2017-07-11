import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Signup } from '../../components/Signup';
import mockData from '../../../server/__test__/mockData';
import { SIGN_UP_SUCCESS } from '../../actions/actionTypes';



const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const store = mockStore({
  type: SIGN_UP_SUCCESS
});

let mockRole = mockData.role;
mockRole.id = 1;

// mock html control
const mockEvent = mockData.mockEvent;

const setup = () => {
  const props = {
    getRoles: jest.fn(),
    signUp: jest.fn(),
    roles: [mockRole],
    signupMessage: ''
  };

  const Wrapper = mount(
    <Signup {...props} />
  );
  return {
    props,
    Wrapper
  };
};


describe('components', () => {
  describe('Signup', () => {
    const { Wrapper, props } = setup();
    describe('should render a signup form', () => {
      it('should render a form', () => {
        expect(Wrapper.find('form')).not.toBeNull();
      });

      describe('should render a textbox for first name', () => {
        const txtFname = Wrapper.find('#fname').props();
        it('textbox should be required', () => {
          expect(txtFname.required).toEqual(true);
        });
        it('should have a placeholder "First Name"', () => {
          expect(txtFname.placeholder).toEqual('First Name');
        });
        it('should have a className "validate"', () => {
          expect(txtFname.className).toEqual('validate');
        });
      });

      describe('should render a textbox for middle name', () => {
        const txtMname = Wrapper.find('#mname').props();
        it('textbox should not be required', () => {
          expect(txtMname.required).toBeUndefined();
        });
        it('should have a placeholder "Middle Name"', () => {
          expect(txtMname.placeholder).toEqual('Middle Name');
        });
        it('should have a className "validate"', () => {
          expect(txtMname.className).toEqual('validate');
        });
      });

      describe('should render a textbox for last name', () => {
        const txtLname = Wrapper.find('#lname').props();
        it('textbox should be required', () => {
          expect(txtLname.required).toBe(true);
        });
        it('should have a placeholder "Last Name"', () => {
          expect(txtLname.placeholder).toEqual('Last Name');
        });
        it('should have a className "validate"', () => {
          expect(txtLname.className).toEqual('validate');
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

      describe('should render a textbox for comfirm password', () => {
        const txtComfirmpassword = Wrapper.find('#comfirmpassword')
        .props();
        it('textbox should be required', () => {
          expect(txtComfirmpassword.required).toBe(true);
        });
        it('should have a placeholder "Comfirm Password"', () => {
          expect(txtComfirmpassword.placeholder).toEqual('Comfirm Password');
        });
        it('should have a className "validate"', () => {
          expect(txtComfirmpassword.className).toEqual('validate');
        });
        describe('onChange event should invoke a function "matchPassword"',
        () => {
          expect(txtComfirmpassword.onChange).toBeInstanceOf(Function);
          describe('function "matchPassword" ', () => {
            it(`returns 'Right password'
                when 'comfirm password' does match the password entered`,
                () => {
                  Wrapper.setState({
                    password: ''
                  });
                  txtComfirmpassword.onChange();
                  expect(Wrapper.node.comfirmPasswordStatus.text)
                  .toEqual('Right password');
                });
            it(`returns 'Wrong password'
                when 'comfirm password' does not match the password entered`,
                () => {
                  Wrapper.setState({
                    password: 'mettt'
                  });
                  txtComfirmpassword.onChange();
                  expect(Wrapper.node.comfirmPasswordStatus.text)
                  .toEqual('Wrong password');
                });
          });
        });
      });

      describe('should render a select control for roles', () => {
        const lsbRole = Wrapper.find('#roleId').props();
        const options = lsbRole.children;
        it('textbox should be required', () => {
          expect(lsbRole.required).toBe(true);
        });
        it('should have a className "browser-default"', () => {
          expect(lsbRole.className).toEqual('browser-default');
        });
        it('onChange event should invoke a function "onChange"', () => {
          expect(lsbRole.onChange).toBeInstanceOf(Function);
        });
        it('should display a default option to select a role', () => {
          const firstOption = options[0].props;
          expect(firstOption.children).toEqual('Choose your group');
        });
        describe('should display roles as options', () => {
          it('should dosplay every role in the props "roles"', () => {
            // add One to include the default option
            expect(options).toHaveLength(props.roles.length + 1);
          });
          describe('options', () => {
            const firstRoleOption = options[1][0].props;
            it('should have a title equal to the role description',
            () => {
              expect(firstRoleOption.title).toEqual(props.roles[0].description);
            });
            it('should have a value equal to the role id', () => {
              expect(firstRoleOption.value).toEqual(props.roles[0].id);
            });
            it('should have a text equal to the role title', () => {
              expect(firstRoleOption.children).toEqual(props.roles[0].title);
            });
          });
        });
      });
      describe('should render a  button', () => {
        const btnSubmit = Wrapper.find('#submit').props();
        it('should have a type "submit" ', () => {
          expect(btnSubmit.type).toBe('submit');
        });
        it('should invoke the save method on click', () => {
          expect(btnSubmit.onClick).toBeInstanceOf(Function);
          btnSubmit.onClick(mockEvent);
          expect(props.signUp.mock.calls.length).toBe(1);
        });
      });
    });
  });
});
