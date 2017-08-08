import React from 'react';
import { mount } from 'enzyme';
import toaster from 'toastr';
import { Profile } from '../../components/Profile';
import mockData from '../../../server/tests/mockData';

toaster.info = jest.fn(message => '');
const mockUser = mockData.regularUser;
const getAttribute = value => ('test');
const mockControl = {
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
    id: mockUser.id
  }
};

const props = {
  updateProfile: jest.fn(),
  getUser: jest.fn()
};
const setup = () => {
  const Wrapper = mount(<Profile {...props} />, { attachTo: document.body });
  return {
    props,
    Wrapper
  };
};

describe('Profile component', () => {
  const Wrapper1 = mount(<Profile {...props} />);
  // set user profile in localstorage
  localStorage.setItem('userInfo', JSON.stringify(mockUser));
  const { Wrapper } = setup();

  describe('componentWillMount', () => {
    it('should render an message when user is not logged in', () => {
      const message = Wrapper1.state('message');
      expect(message).toBe('Unable to retrieve your profile, ' +
      'please signout and login.');
    });

    it('should render the user\' profile from the \'getUser\' action',
    () => {
      expect(props.getUser.mock.calls.length).toBe(1);

      // mock dispatch action
      Wrapper.setProps({
        fname: mockUser.fname,
        lname: mockUser.lname,
        mname: mockUser.mname,
        email: mockUser.email,
        title: mockUser.title
      });

      const userInfoDom = Wrapper.find('.userInfo').props().children;
      const userNameDom = userInfoDom[0].props.children[1];
      const userName =
        `${mockUser.fname} ${mockUser.mname} ${mockUser.lname}`;
      expect(userNameDom).toEqual(userName);
      const userEmailDom = userInfoDom[1].props.children[1];
      expect(userEmailDom).toEqual(mockUser.email);
      const userTitleDom = userInfoDom[2].props.children[1];
      expect(userTitleDom).toEqual(mockUser.title);
    });
  });

  it('should render message from \'profile or getUser\' actions ', () => {
    Wrapper.setProps({
      messageFrom: 'profile',
      message: 'welcome'
    });
    let messageState = Wrapper.state('message');
    let isSubString = messageState.includes('welcome');
    expect(isSubString).toEqual(true);

    Wrapper.setProps({
      messageFrom: 'getUser',
      message: 'I am here'
    });
    messageState = Wrapper.state('message');
    isSubString = messageState.includes('I am here');
    expect(isSubString).toEqual(true);
  });

  describe('update profile panel', () => {
    it('should render a textbox for first name, which is required', () => {
      const txtFname = Wrapper.find('#fname').props();
      expect(txtFname.placeholder).toEqual('First Name');
      expect(txtFname.className).toEqual('validate');
      expect(txtFname.value).toEqual(mockUser.fname);

      mockControl.target = {
        name: 'fname',
        value: 'Bamidele'
      };
      txtFname.onChange(mockControl);
      expect(Wrapper.state('fname'))
      .toEqual(mockControl.target.value);
    });

    it('should render a textbox for middle name, which is optional', () => {
      const txtMname = Wrapper.find('#mname').props();
      expect(txtMname.placeholder).toEqual('Middle Name');
      expect(txtMname.className).toEqual('validate');
      expect(txtMname.value).toEqual(mockUser.mname);

      mockControl.target = {
        name: 'mname',
        value: 'musa'
      };
      txtMname.onChange(mockControl);
      // test for empty middle name
      expect(Wrapper.state('mname')).toEqual(mockControl.target.value);
      mockControl.target = {
        name: 'mname',
        value: ''
      };
      txtMname.onChange(mockControl);
      expect(Wrapper.state('mname')).toEqual(mockControl.target.value);
    });

    it('should render a textbox for last name, which is required', () => {
      const txtLname = Wrapper.find('#lname').props();
      expect(txtLname.placeholder).toEqual('Last Name');
      expect(txtLname.className).toEqual('validate');
      expect(txtLname.value).toEqual(mockUser.lname);
    });

    it('should render a textbox for email, which is required', () => {
      const txtEmail = Wrapper.find('#email').props();
      expect(txtEmail.placeholder).toEqual('Email');
      expect(txtEmail.className).toEqual('validate');
      expect(txtEmail.value).toEqual(mockUser.email);

      mockControl.target = {
        name: 'email',
        value: 'okorocele'
      };
      txtEmail.onChange(mockControl);
      expect(Wrapper.state('email')).toEqual(mockControl.target.value);
    });

    it('should render a button to update profile only', () => {
      Wrapper.setState({
        showPassword: false
      });
      const btnUpdateProfile = Wrapper.find('#btnUpdateProfile').props();
      expect(btnUpdateProfile.type).toBe('submit');

      btnUpdateProfile.onClick(mockActionButton);
      expect(props.updateProfile.mock.calls.length).toBe(1);
    });
  });

  describe('update password', () => {
    it(`should render a texbox for password,
      value should be at least 8 characters,
      including a number and specail character`, () => {

      // change state to show update password container
      Wrapper.setState({
        showPassword: true
      });
      const txtPassword = Wrapper.find('#password').props();
      expect(txtPassword.placeholder).toEqual('Password');
      expect(txtPassword.className).toEqual('validate');

      // should render validation error when password is invalid
      mockControl.target = {
        name: 'password',
        value: 'okorocele'
      };
      txtPassword.onChange(mockControl);
      expect(Wrapper.state('password')).toEqual(mockControl.target.value);
      let passwordValidator = Wrapper.find('#passwordValidator').props();
      expect(passwordValidator.children)
      .toEqual('Password should contain atleast a number and ' +
        'a special character');

      // clear validation message when password is valid or empty
      mockControl.target = {
        name: 'password',
        value: 'okorocele@!1'
      };
      txtPassword.onChange(mockControl);
      passwordValidator = Wrapper.find('#passwordValidator').props();
      expect(passwordValidator.children).toEqual('');
      mockControl.target = {
        name: 'password',
        value: ''
      };
      txtPassword.onChange(mockControl);
      passwordValidator = Wrapper.find('#passwordValidator').props();
      expect(passwordValidator.children).toEqual('');
    });

    it('should render a textbox for old password', () => {
      const txtOldPassword = Wrapper.find('#curPassword').props();
      expect(txtOldPassword.placeholder).toEqual('old Password');
      expect(txtOldPassword.className).toEqual('validate');

      mockControl.target = {
        name: 'curPassword',
        value: 'testing!2'
      };
      txtOldPassword.onChange(mockControl);
      expect(Wrapper.state('curPassword')).toEqual(mockControl.target.value);
    });

    it('should render a textbox to comfirm password', () => {
      const txtComfirmpassword = Wrapper.find('#comfirmpassword').props();
      expect(txtComfirmpassword.placeholder).toEqual('Comfirm Password');
      expect(txtComfirmpassword.className).toEqual('validate');

      // reset message when comfirm password match
      Wrapper.setState({
        password: ''
      });
      txtComfirmpassword.onChange();
      expect(Wrapper.state('comfirmpasswordValidator'))
      .toEqual('');

      // renders message when \'comfirm password\' does not match
      Wrapper.setState({
        password: '1233'
      });
      txtComfirmpassword.onChange();
      expect(Wrapper.state('comfirmpasswordValidator'))
      .toEqual('Password does not match');
    });

    it('renders a  button to update password', () => {
      // set user profile in localstorage
      localStorage.setItem('userInfo', JSON.stringify(mockUser));
      const btnSubmit = Wrapper.find('#btnSubmit').props();
      expect(btnSubmit.type).toBe('submit');

      btnSubmit.onClick(mockActionButton);
      expect(props.updateProfile.mock.calls.length).toBe(2);
    });
  });

  it('should render a toggle button to switch into edit password view',
  () => {
    const showPasswordBtn = Wrapper.find('#updatePassword').props();
    showPasswordBtn.onChange();
    expect(Wrapper.state('showPassword')).toEqual(false);
  });
});
