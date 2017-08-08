import React from 'react';
import toaster from 'toastr';
import { mount } from 'enzyme';
import { Signup } from '../../components/Signup';
import mockData from '../../../server/tests/mockData';


toaster.info = jest.fn(message => '');
const mockRole = mockData.role;
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


describe('Signup component', () => {
  const { Wrapper, props } = setup();

  it('should render a textbox for first name, which is required', () => {
    const txtFname = Wrapper.find('#fname').props();
    expect(txtFname.placeholder).toEqual('First Name');
    expect(txtFname.className).toEqual('validate');

    mockControl.target = {
      name: 'fname',
      value: 'Bamidele'
    };
    txtFname.onChange(mockControl);
    expect(Wrapper.state('fname')).toEqual(mockControl.target.value);
  });

  describe('middle name', () => {
    const txtMname = Wrapper.find('#mname').props();
    it('should render a textbox for middle name', () => {
      expect(txtMname.placeholder).toEqual('Middle Name');
      expect(txtMname.className).toEqual('validate');
    });

    it('should accept vlaues between 2 to 30 alphabets only', () => {
      mockControl.target = {
        name: 'mname',
        value: 'm'
      };
      txtMname.onChange(mockControl);
      errMessage = 'Please input between 2 to 30 alphabets only';
      expect(Wrapper.state('mnameValidator')).toEqual(errMessage);
    });

    it('should accept empty value', () => {
      mockControl.target = {
        name: 'mname',
        value: ''
      };
      txtMname.onChange(mockControl);
      expect(Wrapper.state('mname')).toEqual(mockControl.target.value);
    });
  });

  it('should render a textbox for last name, which is required', () => {
    const txtLname = Wrapper.find('#lname').props();
    expect(txtLname.placeholder).toEqual('Last Name');
    expect(txtLname.className).toEqual('validate');
  });

  describe('email', () => {
    const txtEmail = Wrapper.find('#emailsignup').props();
    it('should render a textbox for email', () => {
      expect(txtEmail.id).toEqual('emailsignup');
      expect(txtEmail.placeholder).toEqual('Email');
      expect(txtEmail.className).toEqual('validate');
    });

    it('should accept only a valid email address', () => {
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

  it(`should render a texbox for password,
    value should be at least 8 characters;
    including a number and specail character`, () => {
    const txtPassword = Wrapper.find('#passwordsignup').props();
    expect(txtPassword.placeholder).toEqual('Password');
    expect(txtPassword.className).toEqual('validate');

    mockControl.target = {
      name: 'password',
      value: 'okorocele'
    };
    txtPassword.onChange(mockControl);
    expect(Wrapper.state('password')).toEqual(mockControl.target.value);
  });

  describe('comfirm password', () => {
    const txtComfirmpassword = Wrapper.find('#comfirmpassword').props();
    it('should render a texbox for "Comfirm Password"', () => {
      expect(txtComfirmpassword.placeholder).toEqual('Comfirm Password');
      expect(txtComfirmpassword.className).toEqual('validate');
    });

    it('should reset message when comfirm password match', () => {
      Wrapper.setState({
        password: ''
      });
      txtComfirmpassword.onChange();
      expect(Wrapper.state('comfirmpasswordValidator')).toEqual('');
    });

    it('should return message when "comfirm password" does not match',
    () => {
      Wrapper.setState({
        password: '1233'
      });
      txtComfirmpassword.onChange();
      expect(Wrapper.state('comfirmpasswordValidator'))
      .toEqual('Password does not match');
    });
  });

  describe('list of roles', () => {
    const lsbRole = Wrapper.find('#roleId').props();
    const options = lsbRole.children;

    it('should accept only number as valid input', () => {
      mockControl.target = {
        name: 'roleId',
        value: 2
      };
      lsbRole.onChange(mockControl);
      expect(Wrapper.state('roleId')).toEqual(mockControl.target.value);
    });

    it('should throw an error for non numeric input', () => {
      mockControl.target.value = 'a';
      lsbRole.onChange(mockControl);
      errMessage = 'Please select your role';
      expect(Wrapper.state('roleIdValidator')).toEqual(errMessage);
    });

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

  it('should render a  submit button to signup', () => {
    const btnSubmit = Wrapper.find('#signupSubmit').props();
    expect(btnSubmit.type).toBe('submit');

    expect(btnSubmit.onClick).toBeInstanceOf(Function);
    btnSubmit.onClick(mockControl);
    expect(props.signUp.mock.calls.length).toBe(1);
  });

  it('should render message from \'signup or getRoles\' actions ', () => {
    Wrapper.setProps({
      messageFrom: 'signup',
      message: 'welcome'
    });
    let messageState = Wrapper.state('message');
    let isSubString = messageState.includes('welcome');
    expect(isSubString).toEqual(true);

    Wrapper.setProps({
      messageFrom: 'getRoles',
      message: 'this roles'
    });
    messageState = Wrapper.state('message');
    isSubString = messageState.includes('this roles');
    expect(isSubString).toEqual(true);
  });
});
