import React from 'react';
import toaster from 'toastr';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Signup } from '../../components/Signup';
import mockData from '../../../server/tests/mockData';
import { SIGN_UP_SUCCESS } from '../../actions/actionTypes';


toaster.info = jest.fn(message => '');
let mockUser = mockData.regularUser;
let mockRole = mockData.role;
mockRole.id = 1;
const getAttribute = value => ('test');

// mock html control
const mockControl = {
  preventDefault: jest.fn(),
  target: {
    getAttribute,
    name: 'password',
    value: 'testing!1'
  }
};
let errMessage;
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
        it('should have a placeholder "First Name"', () => {
          expect(txtFname.placeholder).toEqual('First Name');
        });
        it('should have a className "validate"', () => {
          expect(txtFname.className).toEqual('validate');
        });
        it('onChange event should invoke a function \'onChange\'', () => {
          mockControl.target = {
            name: 'fname',
            value: 'Bamidele'
          }
          txtFname.onChange(mockControl);
          expect(Wrapper.state('fname'))
          .toEqual(mockControl.target.value);
        });
      });

      describe('should render a textbox for middle name', () => {
        const txtMname = Wrapper.find('#mname').props();
        it('should have a placeholder "Middle Name"', () => {
          expect(txtMname.placeholder).toEqual('Middle Name');
        });
        it('should have a className "validate"', () => {
          expect(txtMname.className).toEqual('validate');
        });

        describe('onChange event should invoke a function "onChange"', () => {
          it('valid input should have between 2 to 30 alphabets only', () => { 
            mockControl.target = {
              name: 'mname',
              value: 'm'
            }
            txtMname.onChange(mockControl);
            errMessage = 'Please input between 2 to 30 alphabets only'
            expect(Wrapper.state('mnameValidator')).toEqual(errMessage);
          });

          it('input can be empty', () => {
            mockControl.target = {
              name: 'mname',
              value: ''
            }
            txtMname.onChange(mockControl);
            expect(Wrapper.state('mname')).toEqual(mockControl.target.value);
          });
        });
      });

      describe('should render a textbox for last name', () => {
        const txtLname = Wrapper.find('#lname').props();
        it('should have a placeholder "Last Name"', () => {
          expect(txtLname.placeholder).toEqual('Last Name');
        });
        it('should have a className "validate"', () => {
          expect(txtLname.className).toEqual('validate');
        });
      });

       describe('should render a textbox for email', () => {
        const txtEmail = Wrapper.find('#emailsignup').props();
        it('should have an id "emailsignup"', () => {
          expect(txtEmail.id).toEqual('emailsignup');
        });
        it('should have a placeholder "Email"', () => {
          expect(txtEmail.placeholder).toEqual('Email');
        });
        it('should have a className "validate"', () => {
          expect(txtEmail.className).toEqual('validate');
        });
        describe('onChange event should invoke a function "onChange"', () => {
          it('should accept only a value email address', () => {
            mockControl.target = {
              name: 'email',
              value: 'okorocele@test.com'
            };
            txtEmail.onChange(mockControl);
            expect(Wrapper.state('email')).toEqual(mockControl.target.value);
          });

          it('should throw an error for invalid email address', () => {
            mockControl.target.value = 'okoro@te';
            txtEmail.onChange(mockControl);
            errMessage = 'Please input a valid email address';
            expect(Wrapper.state('emailValidatorsignup')).toEqual(errMessage);
          });
        });
      });

      describe('should render a textbox for password', () => {
        const txtPassword = Wrapper.find('#passwordsignup').props();
        it('should have a placeholder "Password"', () => {
          expect(txtPassword.placeholder).toEqual('Password');
        });
        it('should have a className "validate"', () => {
          expect(txtPassword.className).toEqual('validate');
        });
        it('onChange event should invoke a function "onChange"', () => {
          mockControl.target = {
            name: 'password',
            value: 'okorocele'
          }
          txtPassword.onChange(mockControl);
          expect(Wrapper.state('password')).toEqual(mockControl.target.value);
        });
      });

      describe('should render a textbox for comfirm password', () => {
        const txtComfirmpassword = Wrapper.find('#comfirmpassword').props();
        it('should have a placeholder "Comfirm Password"', () => {
          expect(txtComfirmpassword.placeholder).toEqual('Comfirm Password');
        });

        it('should have a className "validate"', () => {
          expect(txtComfirmpassword.className).toEqual('validate');
        });

       describe('onChange event should invoke a function "matchPassword"',
          () => {
            describe('function "matchPassword" ', () => {
              it(`reset message when comfirm password match`,() => {
                Wrapper.setState({
                  password: ''
                });
                txtComfirmpassword.onChange();
                 expect(Wrapper.state('comfirmpasswordValidator'))
                .toEqual('');
              });

              it(`returns message when 'comfirm password' does not match`, () =>
              {
                Wrapper.setState({
                  password: '1233'
                });
                txtComfirmpassword.onChange();
                expect(Wrapper.state('comfirmpasswordValidator'))
                .toEqual('Password does not match');
              });
            });
          });
      });

      describe('should render a select control for roles', () => {
        const lsbRole = Wrapper.find('#roleId').props();
        const options = lsbRole.children;
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
          describe('onChange event should invoke a function "onChange"', () => {
            const lsbRole = Wrapper.find('#roleId').props();
            it('should accept only number as valid input', () => {
              mockControl.target = {
                name: 'roleId',
                value: 2
              }
              lsbRole.onChange(mockControl);
              expect(Wrapper.state('roleId')).toEqual(mockControl.target.value);
            });

            it('should throw an error for non numeric input', () => { 
              mockControl.target.value = 'a';
              lsbRole.onChange(mockControl);
              errMessage = 'Please select your role';
              expect(Wrapper.state('roleIdValidator')).toEqual(errMessage);
            })
          });
        });
      });
      describe('should render a  button', () => {
        const btnSubmit = Wrapper.find('#signupSubmit').props();
        it('should have a type "submit" ', () => {
          expect(btnSubmit.type).toBe('submit');
        });
        it('should invoke the save method on click', () => {
          expect(btnSubmit.onClick).toBeInstanceOf(Function);
          btnSubmit.onClick(mockControl);
          expect(props.signUp.mock.calls.length).toBe(1);
        });
      });

      it('should render message from \'signup or getRoles\' actions ', () => {
          Wrapper.setProps({
            messageFrom: 'signup',
            message: 'welcome'
          });
          let messageState = Wrapper.state('message');
          let isSubString = messageState.includes("welcome")
          expect(isSubString).toEqual(true);

          Wrapper.setProps({
            messageFrom: 'getRoles',
            message: 'this roles'
          });
          messageState = Wrapper.state('message');
          isSubString = messageState.includes("this roles")
          expect(isSubString).toEqual(true);
      });
    });
  });
});
