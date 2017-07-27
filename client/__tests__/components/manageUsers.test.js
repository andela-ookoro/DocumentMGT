import React from 'react';
import toaster from 'toastr';
import { mount } from 'enzyme';
import { ManageUsers } from '../../components/ManageUsers';
import mockData from '../../../server/tests/mockData';

toaster.info = jest.fn(message => '');
let regularUser = mockData.regularUser;
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
    id : regularUser.id
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
      <ManageUsers { ...props } />
  );
  return {
    props,
    Wrapper
  };
};

describe('components', () => {
  describe('ManageUsers', () => {
    const { Wrapper, props } = setup();
    describe('should render a search form', () => {
      describe('should render a textbox to recieve user\'s search hint', () => {
        const txtsearchHint = Wrapper.find('#searchHint').props();
        it('ID should be "txtsearchHint"', () => {
          expect(txtsearchHint.id).toEqual('searchHint');
        });

        describe('onChange event should invoke a function "searchUser"',
        () => {
          describe('searchUser', () => {
            it('is a function', () => {
              expect(txtsearchHint.onChange).toBeInstanceOf(Function);
            });

            it('should call the action "getUsers" with the value of the' +
            'searchHint textbox', () => {
              txtsearchHint.onChange();
              expect(props.getUsers.mock.calls.length).toBe(2);
            });
          });
        });
      });
    });

    describe('should render a tab for each user category', () => {
      it('should render tab for "active" users', () => {
        const activeUsersTab = Wrapper.find('#active').props();
        expect(activeUsersTab.value).toEqual('active');
      });

      it('should render tab for "disabled" users', () => {
        const disabledUsersTab = Wrapper.find('#disabled').props();
        expect(disabledUsersTab.value).toEqual('disabled');
      });

      it('should render tab for "inactive" users', () => {
        const inactiveUsersTab = Wrapper.find('#inactive').props();
        expect(inactiveUsersTab.value).toEqual('inactive');
      });

      it('each tab should call a function "getUsers" on click', () => {
        const disabledUsersTab = Wrapper.find('#disabled').props();
        disabledUsersTab.onClick(mockTab);
        expect(props.getUsers.mock.calls.length).toBe(3);
      });
    });

    describe('should render a table of users', () => {
      // set props, which triggers component will recieve props event
      Wrapper.setProps({
          status: 'success',
          users: [regularUser]
      });
      describe('rows', () => {
        const user = regularUser;
        it('should have column "Name"', () => {
          const userName = Wrapper.find('#name3').props();
          expect(userName.children).toEqual(regularUser.name);
        })
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

        describe('should have button "block" for only "active" owner', () => {
          const blockButton = Wrapper.find(`#${regularUser.id}`).props();
          it('button id should be the same as selected user id', () => {
            expect(blockButton.id).toEqual(regularUser.id);
          });

          it('should invoke the "blockUser" on double click', () => {
            blockButton.onDoubleClick(mockActionButton);
            expect(props.blockUser.mock.calls.length).toBe(1);
          });

          it('on success, the user should be remove from state',
          () => {
            let usersBeforeBlock = Wrapper.state('users');
            expect(usersBeforeBlock).toEqual([{...regularUser}]);
             Wrapper.setProps({
              messageFrom: 'blockUser',
              message: 'success'
            });
            let usersAfterBlock = Wrapper.state('users');
            expect(usersAfterBlock).toEqual([]);
          })
        });

        describe('should have button "restore" for only "blocked" owner', () => {
          /**
           * set props, which triggers component will recieve props event
           * set user's status to disabled
           */
          regularUser.status = 'disabled'
          Wrapper.setProps({
            status: 'success',
            users: [regularUser]
          });
          const restoreButton = Wrapper.find(`#${regularUser.id}`).props();
          it('button id should be the same as selected user id', () => {
            expect(restoreButton.id).toEqual(regularUser.id);
          });

          it('should invoke the "restoreUser" on double click', () => {
            restoreButton.onDoubleClick(mockActionButton);
            expect(props.restoreUser.mock.calls.length).toBe(1);
          });

          it('on success, the user should be remove from state', () => {
             Wrapper.setProps({
              messageFrom: 'restoreUser',
              message: 'success'
            });
            let usersAfterRestore = Wrapper.state('users');
            expect(usersAfterRestore).toEqual([]);
          })
        });
      });
    });

    it('should render message from \'restoreUser or blockUser\' actions ',
    () => {
        Wrapper.setProps({
          messageFrom: 'restoreUser',
          message: 'welcome'
        });
        let messageState = Wrapper.state('message');
        let isSubString = messageState.includes("welcome")
        expect(isSubString).toEqual(true);

        Wrapper.setProps({
          messageFrom: 'blockUser',
          message: 'done'
        });
        messageState = Wrapper.state('message');
        isSubString = messageState.includes("done")
        expect(isSubString).toEqual(true);
    });
  });
});
