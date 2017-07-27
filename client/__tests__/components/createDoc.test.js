import React from 'react';
import toaster from 'toastr';
import { shallow } from 'enzyme';
import { CreateDocument } from '../../components/CreateDocument';
import mockData from '../../../server/tests/mockData';

toaster.info = jest.fn(message => '');
let mockUser = mockData.regularUser;
let mockDocument = mockData.document;
mockDocument.createdAt = new Date();
mockDocument.id = 1;
mockDocument.owner = 1;

const mockEvent = {
  preventDefault: jest.fn(),
  target: {
    name: 'password',
    value: 'test'
  }
};

const setup = () => {
  const props = {
    createDocStatus: '',
    errorMessage: '',
    upsertDocument: jest.fn(),
    getDocument: jest.fn(),
    match: {
      params: {
        documentId: 1
      }
    }
  };
  const Wrapper = shallow(
    <CreateDocument {...props} />
  );
  return {
    props,
    Wrapper
  };
};


describe('components', () => {
  describe('Document', () => {
    const { Wrapper, props } = setup();
    Wrapper.setProps({
      document: mockDocument,
      status: 'success'
    });

    describe('should render a textbox for document title', () => {
      const txtTitle = Wrapper.find('#title').props();
      it('textbox should be required', () => {
        expect(txtTitle.required).toEqual(true);
      });
      it('should have a placeholder "First Name"', () => {
        expect(txtTitle.placeholder).toEqual('Title');
      });
      it('should have a className "validate"', () => {
        expect(txtTitle.className).toEqual('validate');
      });
    });

    describe('render a group radio button for access right', () => {
      it('has a radio button for private access right', () => {
        const rdbPrivate = Wrapper.find('#private').props();
        expect(rdbPrivate.id).toEqual('private');
      });

      it('has a radio button for private access right', () => {
        const rdbPublic = Wrapper.find('#public').props();
        expect(rdbPublic.id).toEqual('public');
      });

      it('has a radio button for private access right', () => {
        const rdbPublic = Wrapper.find('#public').props();
        expect(rdbPublic.id).toEqual('public');
      });
    });

    describe('should render a  button', () => {
      const btnSubmit = Wrapper.find('#btnsubmit').props();
      it('should have a type "submit" ', () => {
        expect(btnSubmit.type).toBe('submit');
      });
      it('should invoke the saveDocument function on click', () => {
        describe('saveDocument function', () => {
          it('should call the saveDocument action when every field is valid',
          () => {
            // set user profile in localstorage
            localStorage.setItem('userInfo', JSON.stringify(mockUser));
            Wrapper.setState({
              accessRight: 'role'
            });
            btnSubmit.onClick(mockEvent);
            expec(props.upsertDocument.mock.calls.length).toBe(1);
          });
          it('should display a message when a field is invalid', () => {
            Wrapper.setState({
              accessRight: null,
              title: 'ab'
            });

            btnSubmit.onClick(mockEvent);
          })
        })
      });
    });

    describe('should call componentWillReceiveProps on update', () => {
      it('should display a message from \'upsertDocument\' actions',
      () => {
        Wrapper.setProps({
          messageFrom: 'upsertDocument',
          message: 'unknown request',
        });
        const messageState = Wrapper.state('message');
        const isSubString = messageState.includes("unknown request")
        expect(isSubString).toEqual(true);
      });
    });
  });
});

