import React from 'react';
import toaster from 'toastr';
import { mount } from 'enzyme';
import { ManageUsers } from '../../components/ManageUsers';
import mockData from '../../../server/tests/mockData';

toaster.info = jest.fn(message => '');
const regularUser = mockData.regularUser;
const getAttribute = value => ('test');
const mockTab = {
  preventDefault: jest.fn(),
  target: {
    getAttribute,
    name: 'password',
    value: 'test'
  }
};
const mockActionButton = {
  preventDefault: jest.fn(),
  target: {
    id: regularUser.id
  }
};

const props = {
  getUsers: jest.fn(),
  restoreUser: jest.fn(),
  blockUser: jest.fn(),
  sendMessage: () => {},
};

const setup = () => {
  const Wrapper = mount(
    <ManageUsers {...props} />
  );
  return {
    props,
    Wrapper
  };
};

describe('ManageUsers component', () => {
  const { Wrapper } = setup();

  it('should render a texbox to search for users', () => {
    const txtsearchHint = Wrapper.find('#searchHint').props();
    expect(txtsearchHint.id).toEqual('searchHint');

    txtsearchHint.onChange();
    expect(props.getUsers.mock.calls.length).toBe(2);
  });

  it('should render a tab for each user category', () => {
    const activeUsersTab = Wrapper.find('#active').props();
    expect(activeUsersTab.value).toEqual('active');

    const disabledUsersTab = Wrapper.find('#disabled').props();
    expect(disabledUsersTab.value).toEqual('disabled');

    const inactiveUsersTab = Wrapper.find('#inactive').props();
    expect(inactiveUsersTab.value).toEqual('inactive');

    disabledUsersTab.onClick(mockTab);
    expect(props.getUsers.mock.calls.length).toBe(3);
  });

  describe('table of users', () => {
    // set props, which triggers component will recieve props event
    Wrapper.setProps({
      status: 'success',
      users: [regularUser]
    });

    const user = regularUser;
    it('should have column "Name"', () => {
      const userName = Wrapper.find('#name3').props();
      expect(userName.children).toEqual(regularUser.name);
    });

    it('should have column "Email"', () => {
      const email = Wrapper.find(`#email${user.id}`).props();
      expect(email.children).toEqual(regularUser.email);
    });

    it('should have column "Role"', () => {
      const role = Wrapper.find(`#role${user.id}`).props();
      expect(role.children).toEqual(regularUser.role);
    });

    it('should have column "doc count"', () => {
      const docCount = Wrapper.find(`#docCount${user.id}`).props();
      expect(docCount.children).toEqual(regularUser.doccount);
    });

    it('should have column "status"', () => {
      const status = Wrapper.find(`#status${user.id}`).props();
      expect(status.children).toEqual(regularUser.status);
    });

    it('should renders a button to block only active users', () => {
      const blockButton = Wrapper.find(`#${regularUser.id}`).props();
      expect(blockButton.id).toEqual(regularUser.id);

      blockButton.onDoubleClick(mockActionButton);
      expect(props.blockUser.mock.calls.length).toBe(1);
      const usersBeforeBlock = Wrapper.state('users');
      expect(usersBeforeBlock).toEqual([{ ...regularUser }]);
      Wrapper.setProps({
        messageFrom: 'blockUser',
        message: 'success'
      });
      const usersAfterBlock = Wrapper.state('users');
      expect(usersAfterBlock).toEqual([]);
    });

    it('should render a button to restore only "blocked" owner', () => {
      /**
       * set props, which triggers component will recieve props event
       * set user's status to disabled
       */
      regularUser.status = 'disabled';
      Wrapper.setProps({
        status: 'success',
        users: [regularUser]
      });
      const restoreButton = Wrapper.find(`#${regularUser.id}`).props();
      expect(restoreButton.id).toEqual(regularUser.id);

      restoreButton.onDoubleClick(mockActionButton);
      expect(props.restoreUser.mock.calls.length).toBe(1);
      Wrapper.setProps({
        messageFrom: 'restoreUser',
        message: 'success'
      });
      const usersAfterRestore = Wrapper.state('users');
      expect(usersAfterRestore).toEqual([]);
    });

    it('should render message from \'restoreUser or blockUser\' actions ',
    () => {
      Wrapper.setProps({
        messageFrom: 'restoreUser',
        message: 'welcome'
      });
      let messageState = Wrapper.state('message');
      let isSubString = messageState.includes('welcome');
      expect(isSubString).toEqual(true);

      Wrapper.setProps({
        messageFrom: 'blockUser',
        message: 'done'
      });
      messageState = Wrapper.state('message');
      isSubString = messageState.includes('done');
      expect(isSubString).toEqual(true);
    });
  });
});
