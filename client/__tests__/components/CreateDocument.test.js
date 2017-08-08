import React from 'react';
import toaster from 'toastr';
import { mount } from 'enzyme';
import { CreateDocument } from '../../components/CreateDocument';
import mockData from '../../../server/tests/mockData';

toaster.info = jest.fn(message => '');
const mockUser = mockData.regularUser;
const mockDocument = mockData.document;
mockDocument.createdAt = new Date().toDateString();
mockDocument.id = 1;
mockDocument.owner = 1;

const mockBtn = {
  target: {
    id: 'public',
    value: 'public',
    name: 'accessRight'
  }
};
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
  const Wrapper = mount(
    <CreateDocument {...props} />
  );
  return {
    props,
    Wrapper
  };
};


describe('Create Document components', () => {
  const { Wrapper, props } = setup();
  Wrapper.setProps({
    document: mockDocument,
    status: 'success'
  });

  it('should render a required textbox for document title', () => {
    const txtTitle = Wrapper.find('#title').props();
    expect(txtTitle.required).toEqual(true);
    expect(txtTitle.placeholder).toEqual('Title');
    expect(txtTitle.className).toEqual('validate');
  });

  it('should render a group radio button for document access rights', () => {
    const rdbPrivate = Wrapper.find('#private').props();
    expect(rdbPrivate.id).toEqual('private');

    const rdbPublic = Wrapper.find('#public').props();
    expect(rdbPublic.id).toEqual('public');

    const rdbRole = Wrapper.find('#role').props();
    expect(rdbRole.id).toEqual('role');

    const myDocumentsTab = Wrapper.find('#public').props();
    myDocumentsTab.onChange(mockBtn);
    const stateAccessRight = Wrapper.state('accessRight');
    expect(stateAccessRight).toBe(mockBtn.target.id);
  });

  describe('submit button', () => {
    const btnSubmit = Wrapper.find('#btnsubmit').props();

    it('should have a type "submit" ', () => {
      expect(btnSubmit.type).toBe('submit');
    });

    it('should call the saveDocument action when every field is valid ', () => {
           // set user profile in localstorage
      localStorage.setItem('userInfo', JSON.stringify(mockUser));
      Wrapper.setState({
        accessRight: 'role'
      });
      const btnSubmit1 = Wrapper.find('#btnsubmit').props();
      btnSubmit1.onClick(mockEvent);
      expect(props.upsertDocument.mock.calls.length).toBe(1);
    });

    it('should display a message, when a fields is invalid', () => {
      const btnSubmit2 = Wrapper.find('#btnsubmit').props();
      Wrapper.setState({
        accessRight: null,
        title: 'ab'
      });
      btnSubmit2.onClick(mockEvent);
      const messageState = Wrapper.state('message');
      const isSubString = messageState.includes('Please');
      expect(isSubString).toEqual(true);
    });
  });

  it('should display a message from \'upsertDocument\' actions', () => {
    Wrapper.setProps({
      messageFrom: 'upsertDocument',
      message: 'document has been updated successfully',
    });
    const messageState = Wrapper.state('message');
    const isSubString = messageState.includes('successfully');
    expect(isSubString).toEqual(true);
  });
});

