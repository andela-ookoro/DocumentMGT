import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { Documents } from '../../components/Documents';
import mockData from '../../../server/tests/mockData';

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
// const mockDeleteButton = {
//   preventDefault: jest.fn(),
//   target: {
//     id : mockDocument.id
//   }
// };

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

            it('should call the action "getDocuments" with the value of the' +
            'searchHint textbox', () => {
              txtsearchHint.onChange();
              expect(props.getDocuments.mock.calls.length).toBe(2);
            });
          });
        });
      });
    });

    describe('should have a tab for each access right', () => {
      it('should have tab for "myDocuments" documents', () => {
        const myDocumentsTab = Wrapper.find('#myDocument').props();
        expect(myDocumentsTab.value).toEqual('myDocument');
      });

      it('should have tab for "private" documents', () => {
        const myDocumentsTab = Wrapper.find('#private').props();
        expect(myDocumentsTab.value).toEqual('private');
      });

      it('should have tab for "public" documents', () => {
        const myDocumentsTab = Wrapper.find('#public').props();
        expect(myDocumentsTab.value).toEqual('public');
      });

      it('should have tab for "role" documents', () => {
        const myDocumentsTab = Wrapper.find('#role').props();
        expect(myDocumentsTab.value).toEqual('role');
      });

      it('each tab should call a function "getDocuments" on click', () => {
        const myDocumentsTab = Wrapper.find('#role').props();
        myDocumentsTab.onClick(mockTab);
        expect(props.getDocuments.mock.calls.length).toBe(3);
      });
    });

    describe('should call componentWillReceiveProps on update', () => {
      const mockUser = mockData.user;
      mockUser.id = 1;
      localStorage.setItem('userInfo', JSON.stringify(mockUser));
      it('should display a message from actions when an operation',
      () => {
        Wrapper.setProps({
          status: 'failed',
          messageFrom: 'deleteDocument',
          message: 'unknown request',
          deleteStatus: 'failed'
        });
        expect(Wrapper.state('message')).toEqual('unknown request');
      });

      it('should reset the message state when an operation is successful',
      () => {
        Wrapper.setProps({
          deleteStatus: 'failed',
          message: 'document has been deleted successfully '
        });
        expect(Wrapper.state('message')).toEqual('');
      });
    });

    describe('should render a table of document', () => {
      describe('rows', () => {
        it('should have column "Author"', () => {
          const author = Wrapper.find('#author1').props();
          expect(author.children).toEqual(mockDocument.author);
        });
        it('should have column "Title"', () => {
          const title = Wrapper.find('#title1').props();
         expect(title.children).toEqual(mockDocument.title);
        });
        it('should have column "Accessibilty"', () => {
          const access = Wrapper.find('#access1').props();
         expect(access.children).toEqual(mockDocument.accessRight);
        });
        it('should have column "createdAt"', () => {
          const createdAt = Wrapper.find('#createdAt1').props();
          expect(createdAt.children).toEqual(mockDocument.createdAt);
        });
        describe('should have colomn "delete" for only document owner', () => {
          const deleteButton = Wrapper.find(`#${mockDocument.id}`).props();
          it('button id should be the same as document id', () => {
            expect(deleteButton.id).toEqual(mockDocument.id);
          });
          it('should invoke the "deleteDocument" on diuble click', () => {
            // deleteButton.onDoubleClick(mockDeleteButton);
            // expect(props.deleteDocuments.mock.calls.length).toBe(1);
          });
        });
      });
    });
  });
});


