import React from 'react';
import toaster from 'toastr';
import { mount } from 'enzyme';
import { Documents } from '../../components/Documents';
import mockData from '../../../server/tests/mockData';

toaster.info = jest.fn(message => message);
const mockDocument = mockData.document;
mockDocument.createdAt = new Date().toDateString();
mockDocument.createdAt = new Date().toDateString();
mockDocument.id = 1;
mockDocument.owner = 1;
const mockUser = mockData.regularUser;
mockUser.id = 1;

const getAttribute = value => ('test');
const mockTab = {
  preventDefault: jest.fn(),
  target: {
    getAttribute,
    name: 'password',
    value: 'test'
  }
};
const mockDeleteButton = {
  preventDefault: jest.fn(),
  target: {
    id: mockDocument.id
  }
};

const props = {
  status: '',
  documents: [mockDocument],
  pageCount: 0,
  message: '',
  deleteStatus: '',
  getDocuments: jest.fn(),
  deleteDocument: jest.fn(),
  sendMessage: () => {},
};

const setup = () => {
  localStorage.setItem('userInfo', JSON.stringify(mockUser));
  const Wrapper = mount(
    <Documents {...props} />
  );
  return {
    props,
    Wrapper
  };
};

describe('Documents components', () => {
  localStorage.setItem('userInfo', JSON.stringify(mockUser));
  const { Wrapper } = setup();

  it('should display a message from \'getDocument\' actions', () => {
    Wrapper.setProps({
      messageFrom: 'getDocuments',
      message: 'unknown request',
    });
    const messageState = Wrapper.state('message');
    const isSubString = messageState.includes('unknown request');
    expect(isSubString).toEqual(true);
  });

  it('should render a texbox to search for documents', () => {
    const txtsearchHint = Wrapper.find('#searchText').props();
    expect(txtsearchHint.id).toEqual('searchText');
    txtsearchHint.onChange();
    expect(props.getDocuments.mock.calls.length).toBe(2);
  });

  it('renders a tab for each document access-right category', () => {
    const myDocumentsTab = Wrapper.find('#myDocument').props();
    expect(myDocumentsTab.value).toEqual('myDocument');

    const privateDocumentTab = Wrapper.find('#private').props();
    expect(privateDocumentTab.value).toEqual('private');

    const publicDocumentsTab = Wrapper.find('#public').props();
    expect(publicDocumentsTab.value).toEqual('public');

    const roleDocumentsTab = Wrapper.find('#role').props();
    expect(roleDocumentsTab.value).toEqual('role');
    myDocumentsTab.onClick(mockTab);
    expect(props.getDocuments.mock.calls.length).toBe(3);
  });

  describe('table of document', () => {
    // set login user in local storage
    mockUser.id = 1;
    Wrapper.setProps({
      status: 'success',
      documents: [mockDocument]
    });

    it('should render a column "Author"', () => {
      const author = Wrapper.find('#author1').props();
      expect(author.children).toEqual(mockDocument.author);
    });
    it('should render a column "Title"', () => {
      const title = Wrapper.find('#title1').props();
      expect(title.children).toEqual(mockDocument.title);
    });
    it('should render a column "Accessibilty"', () => {
      const access = Wrapper.find('#access1').props();
      expect(access.children).toEqual(mockDocument.accessRight);
    });
    it('should render a column "createdAt"', () => {
      const createdAt = Wrapper.find('#createdAt1').props();
      expect(createdAt.children[0]).toEqual(mockDocument.createdAt);
    });

    it(`should render a link to view,
      which redirects the users to the document page`, () => {
      const viewButton = Wrapper.find(`#view${mockDocument.id}`).props();
      const documentUrl = `#/document/${mockDocument.id}/${mockDocument
        .title
        .toString().replace(new RegExp(' ', 'g'), '_')}`;
      expect(viewButton.href).toEqual(documentUrl);
    });

    it(`should render a link,
      which redirects the users to the createDocument page`, () => {
      const editButton = Wrapper.find(`#edit${mockDocument.id}`).props();
      const editUrl = `#/createDocument/${mockDocument.id}/${mockDocument.title
        .toString()
         .replace(new RegExp(' ', 'g'), '_')}/edit`;
      expect(editButton.href).toEqual(editUrl);
    });

    it('renders a button to delete document, for author only', () => {
      const deleteButton = Wrapper.find(`#${mockDocument.id}`).props();
      expect(deleteButton.id).toEqual(mockDocument.id);

      deleteButton.onDoubleClick(mockDeleteButton);
      expect(props.deleteDocument.mock.calls.length).toBe(1);

      const documentsBeforeDelete = Wrapper.state('documents');
      expect(documentsBeforeDelete).toEqual([{ ...mockDocument }]);
      Wrapper.setProps({
        messageFrom: 'deleteDocument',
        message: 'success'
      });
      const documentsAfterDelete = Wrapper.state('documents');
      expect(documentsAfterDelete).toEqual([]);
    });
  });
});
