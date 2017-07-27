import React from 'react';
import { mount } from 'enzyme';
import toaster from 'toastr';
import { Profile } from '../../components/Profile';
import mockData from '../../../server/tests/mockData';

toaster.info = jest.fn(message => '');
let mockUser = mockData.regularUser;
const getAttribute = value => ('test');
let mockControl = {
  preventDefault: jest.fn(),
  target: {
    getAttribute,
    name: 'fname',
    value: 'Bamidele'
  }
};
const mockActionButton = {
  preventDefault: jest.fn(),
  target: {
    id : mockUser.id
  }
};

const props = {
  updateProfile: jest.fn(),
  getUser: jest.fn()
};
const setup = () => {
  const Wrapper = mount(<Profile { ...props } />, { attachTo: document.body }); 
  return {
    props,
    Wrapper
  };
};

describe('components', () => {
  describe('Profile', () => {
    let Wrapper1 = mount(<Profile { ...props } />);
    // set user profile in localstorage
    localStorage.setItem('userInfo', JSON.stringify(mockUser));
    let { Wrapper, props } = setup();

    describe('on componentWillMount', () => {
      it('should render an message when user is not logged in', () => {
        const message = Wrapper1.state('message');
        expect(message).toBe('Unable to retrieve your profile, please signout and login.')
      })
      describe('should retrieve user\'s profile when user is logged in', () => {
        it('should invoke \'getUser\' action with the user\'s id', () => {
          expect(props.getUser.mock.calls.length).toBe(1);
        })

        // mock dispatch action
        Wrapper.setProps({
          fname: mockUser.fname,
          lname: mockUser.lname,
          mname: mockUser.mname,
          email: mockUser.email,
          title: mockUser.title
        });

        const userInfoDom = Wrapper.find('.userInfo').props().children;
        it('should display the user full name, email and title', () => {
          const userNameDom = userInfoDom[0].props.children[1];
          const userName = `${mockUser.fname} ${mockUser.mname} ${mockUser.lname}`;
          expect(userNameDom).toEqual(userName);
          const userEmailDom = userInfoDom[1].props.children[1];
          expect(userEmailDom).toEqual(mockUser.email);
          const userTitleDom = userInfoDom[2].props.children[1];
          expect(userTitleDom).toEqual(mockUser.title);
        })
      });
      
    });

    describe('should render a form to edit profile', () => {
      describe('When user wants to update only her profile', () => {
        describe('should render a textbox for first name', () => {
          const txtFname = Wrapper.find('#fname').props();
          it('should have a placeholder "First Name"', () => {
            expect(txtFname.placeholder).toEqual('First Name');
          });
          it('should have a className "validate"', () => {
            expect(txtFname.className).toEqual('validate');
          });
          it('should have same value as the user\'s fname', () => {
            expect(txtFname.value).toEqual(mockUser.fname);
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
          it('should have same value as the user\'s mname', () => {
            expect(txtMname.value).toEqual(mockUser.mname);
          });

          it(`onChange event should invoke a function "onChange"`, () => {
            mockControl.target = {
              name: 'mname',
              value: 'musa'
            }
            txtMname.onChange(mockControl);
            // test for empty middle name
            expect(Wrapper.state('mname')).toEqual(mockControl.target.value);
            mockControl.target = {
              name: 'mname',
              value: ''
            }
            txtMname.onChange(mockControl);
            expect(Wrapper.state('mname')).toEqual(mockControl.target.value);
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
          it('should have same value as the user\'s mname', () => {
            expect(txtLname.value).toEqual(mockUser.lname);
          });
        });

        describe('should render a textbox for email', () => {
          const txtEmail = Wrapper.find('#email').props();
          it('should have a placeholder "Email"', () => {
            expect(txtEmail.placeholder).toEqual('Email');
          });
          it('should have a className "validate"', () => {
            expect(txtEmail.className).toEqual('validate');
          });
          it('should have same value as the user\'s email', () => {
            expect(txtEmail.value).toEqual(mockUser.email);
          });
          it(`onChange event should invoke a function "onChange" `, () => {
            mockControl.target = {
              name: 'email',
              value: 'okorocele'
            }
            txtEmail.onChange(mockControl);
            expect(Wrapper.state('email')).toEqual(mockControl.target.value);
          });
        });

        describe('should render a  button to update profile', () => {
          const btnUpdateProfile = Wrapper.find('#btnUpdateProfile').props();
          it('should have a type "submit" ', () => {
            expect(btnUpdateProfile.type).toBe('submit');
          });
          it('should invoke the save method on click', () => {
            btnUpdateProfile.onClick(mockActionButton);
            expect(props.updateProfile.mock.calls.length).toBe(1);
          });
        });
      });

      describe('when a user\'s wants to edit her password', () => {
        // change state to show update password container
        Wrapper.setState({
          showPassword: true
        });
        describe('should render a textbox for new password', () => {
          const txtPassword = Wrapper.find('#password').props();

          it('should have a placeholder "Password"', () => {
            expect(txtPassword.placeholder).toEqual('Password');
          });

          it('should have a className "validate"', () => {
            expect(txtPassword.className).toEqual('validate');
          });

          describe(`onChange event should invoke a function "onChange"`, () => {
            it('render validation error when password is invalid', () => {
              mockControl.target = {
                name: 'password',
                value: 'okorocele'
              }
              txtPassword.onChange(mockControl);
              expect(Wrapper.state('password')).toEqual(mockControl.target.value);
              let passwordValidator = Wrapper.find('#passwordValidator').props();
              expect(passwordValidator.children)
              .toEqual('Password should contain atleast a number and a special character')
            });

            it('render clear validation message when password is valid or empty', () => {
              mockControl.target = {
                name: 'password',
                value: 'okorocele@!1'
              }
              txtPassword.onChange(mockControl);
              let passwordValidator = Wrapper.find('#passwordValidator').props();
              expect(passwordValidator.children).toEqual('');
              //
              mockControl.target = {
                name: 'password',
                value: ''
              }
              txtPassword.onChange(mockControl);
              passwordValidator = Wrapper.find('#passwordValidator').props();
              expect(passwordValidator.children).toEqual('')
            })
          });
        });

        describe('should render a textbox for old password', () => {
          const txtOldPassword = Wrapper.find('#curPassword').props();
          it('should have a placeholder "Old Password"', () => {
            expect(txtOldPassword.placeholder).toEqual('old Password');
          });
          it('should have a className "validate"', () => {
            expect(txtOldPassword.className).toEqual('validate');
          });

          it(`onChange event should invoke a function "onChange"`, () => {
            mockControl.target = {
              name: 'curPassword',
              value: 'testing!2'
            }
            txtOldPassword.onChange(mockControl);
            expect(Wrapper.state('curPassword')).toEqual(mockControl.target.value);
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

        describe('should render a  button to update password', () => {
          // set user profile in localstorage
          localStorage.setItem('userInfo', JSON.stringify(mockUser));
          const btnSubmit = Wrapper.find('#btnSubmit').props();
          it('should have a type "submit" ', () => {
            expect(btnSubmit.type).toBe('submit');
          });
          it('should invoke the save method on click', () => {
            btnSubmit.onClick(mockActionButton);
            expect(props.updateProfile.mock.calls.length).toBe(2);
          });
        });
      });

      it('should render a button to switch into edit password view', () => {
        const showPasswordBtn = Wrapper.find('#updatePassword').props();
        showPasswordBtn.onChange();
        expect(Wrapper.state('showPassword')).toEqual(false);
      });
      it('should render message from \'profile or getUser\' actions ', () => {
          Wrapper.setProps({
            messageFrom: 'profile',
            message: 'welcome'
          });
          let messageState = Wrapper.state('message');
          let isSubString = messageState.includes("welcome")
          expect(isSubString).toEqual(true);

          Wrapper.setProps({
            messageFrom: 'getUser',
            message: 'I am here'
          });
          messageState = Wrapper.state('message');
          isSubString = messageState.includes("I am here")
          expect(isSubString).toEqual(true);
      });
    });
  });
});
