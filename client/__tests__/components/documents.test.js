import React from 'react';
import toaster from 'toastr';
import { mount, shallow } from 'enzyme';
import { Documents } from '../../components/Documents';
import mockData from '../../../server/tests/mockData';

toaster.info = jest.fn(message => '');
let mockDocument = mockData.document;
mockDocument.createdAt = new Date().toDateString();
mockDocument.id = 1;
mockDocument.owner = 1;
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
    id : mockDocument.id
  }
};
const mockPagination = {
  selected: 1
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
  const Wrapper = mount(
      <Documents { ...props } />
  );
  return {
    props,
    Wrapper
  };
};

describe('components', () => {
  describe('Documents', () => {
    const { Wrapper, props } = setup();
    describe('should render a search form', () => {
      describe('should render a textbox to recieve user\'s search hint', () => {
        const txtsearchHint = Wrapper.find('#searchHint').props();
        it('ID should be "txtsearchHint"', () => {
          expect(txtsearchHint.id).toEqual('searchHint');
        });

        describe('onChange event should invoke a function "searchDocument"',
        () => {
          describe('searchDocument', () => {
            it('is a function', () => {
              expect(txtsearchHint.onChange).toBeInstanceOf(Function);
            });

            it('should call the action "getDocuments" with the value of the ' +
            'searchHint textbox', () => {
              txtsearchHint.onChange();
              expect(props.getDocuments.mock.calls.length).toBe(2);
            });
          });
        });
      });
    });

    describe('should render a tab for each access right', () => {
      it('should render a tab for "myDocuments" documents', () => {
        const myDocumentsTab = Wrapper.find('#myDocument').props();
        expect(myDocumentsTab.value).toEqual('myDocument');
      });

      it('should render a tab for "private" documents', () => {
        const myDocumentsTab = Wrapper.find('#private').props();
        expect(myDocumentsTab.value).toEqual('private');
      });

      it('should render a tab for "public" documents', () => {
        const myDocumentsTab = Wrapper.find('#public').props();
        expect(myDocumentsTab.value).toEqual('public');
      });

      it('should render a tab for "role" documents', () => {
        const myDocumentsTab = Wrapper.find('#role').props();
        expect(myDocumentsTab.value).toEqual('role');
      });

      it('each tab should call a function "getDocuments" on click', () => {
        const myDocumentsTab = Wrapper.find('#role').props();
        myDocumentsTab.onClick(mockTab);
        expect(props.getDocuments.mock.calls.length).toBe(3);
      });
    });

    describe('should render a table of document', () => {
      // set login user in local storage
      const mockUser = mockData.user;
      mockUser.id = 1;
      localStorage.setItem('userInfo', JSON.stringify(mockUser));
      Wrapper.setProps({
        status: 'success',
        documents: [mockDocument]
      });

      describe('rows', () => {
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
          expect(createdAt.children).toEqual(mockDocument.createdAt);
        });

        describe('should render  a link to view the content of a document', () => {
           const viewButton = Wrapper.find(`#view${mockDocument.id}`).props();
          it('which redirects the users to the document page', () => {
            const documentUrl = `#/document/${mockDocument.id}/${mockDocument.title
              .toString().replace(new RegExp(' ', 'g'), '_')}`;
            expect(viewButton.href).toEqual(documentUrl);

          });
        });

        describe('should render a link to edit document for only document owner',
        () => {
          const editButton = Wrapper.find(`#edit${mockDocument.id}`).props();
          it('which redirects the users to the createDocument page', () => {
            const editUrl = `#/createDocument/${mockDocument.id}/${mockDocument
            .title.toString().replace(new RegExp(' ', 'g'), '_')}/edit`;
            expect(editButton.href).toEqual(editUrl);
          });
        });

        describe('should render a colomn "delete" for only document owner', () => {
          const deleteButton = Wrapper.find(`#${mockDocument.id}`).props();
          it('button id should be the same as document id', () => {
            expect(deleteButton.id).toEqual(mockDocument.id);
          });

          it('should invoke the "deleteDocument" on double click', () => {
            deleteButton.onDoubleClick(mockDeleteButton);
            expect(props.deleteDocument.mock.calls.length).toBe(1);
          });

          it('on successfull delete, the document should be remove from state',
          () => {
            let documentsBeforeDelete = Wrapper.state('documents');
            expect(documentsBeforeDelete).toEqual([{...mockDocument}]);
             Wrapper.setProps({
              messageFrom: 'deleteDocument',
              message: 'success'
            });
            let documentsAfterDelete = Wrapper.state('documents');
            expect(documentsAfterDelete).toEqual([]);
          })
        });
      });
    });

    describe('should call componentWillReceiveProps on update', () => {
      it('should display a message from \'getDocument\' actions',
      () => {
        Wrapper.setProps({
          messageFrom: 'getDocuments',
          message: 'unknown request',
        });
        const messageState = Wrapper.state('message');
        const isSubString = messageState.includes("unknown request")
        expect(isSubString).toEqual(true);
      });
    });
  });
});


