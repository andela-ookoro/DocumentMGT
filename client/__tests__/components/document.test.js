import React from 'react';
import { shallow } from 'enzyme';
import { Document } from '../../components/Document';
import mockData from '../../../server/tests/mockData';

const mockDocument = mockData.document;
mockDocument.createdAt = new Date().toDateString();
mockDocument.id = 1;
mockDocument.owner = 1;

const setup = () => {
  const props = {
    status: 'success',
    document: mockDocument,
    getDocument: jest.fn(),
    match: {
      params: {
        documentId: 1
      }
    }
  };
  const Wrapper = shallow(
    <Document {...props} />
  );
  return {
    props,
    Wrapper
  };
};


describe('components', () => {
  describe('Document', () => {
    const { Wrapper, props } = setup();
    describe('When a document exist', () => {
       Wrapper.setProps({
        document: mockDocument,
        status: 'success'
      });
      const renderedDoc = Wrapper.props().children.props.children[2].props;
      describe('should render the document header', () => {
        const docHeader = renderedDoc.children[0].props;
        describe('render the author of the document ', () => {
          const author = docHeader.children[0];
          it('should render a h5 element', () => {
            expect(author.type).toEqual('h5');
          });
          it('should display the author of the document as "Author <name>"',
          () => {
            const authorDom = author.props.children;
            expect(authorDom[0]).toEqual('Author ');
            expect(authorDom[1].type).toEqual('br');
            expect(authorDom[2]).toEqual(mockDocument.author);
          })
        });

        describe('render the title of the document ', () => {
          const title = docHeader.children[1];
          it('should render a h6 element', () => {
            expect(title.type).toEqual('h6');
          });
          it('should display the title of the document as "Author <name>"',
          () => {
            const titleDom = title.props.children;
            expect(titleDom).toEqual(mockDocument.title);
          })
        });

        describe('render the a line after the header', () => {
          const hr = docHeader.children[2];
          it('should render a hr element', () => {
            expect(hr.type).toEqual('hr');
          });
        });
      });

      describe('render the body of the document ', () => {
        const docBody = renderedDoc.children[1];
        const body = mockDocument.body;

        it('should render a div element', () => {
          expect(docBody.type).toEqual('div');
        });
        it('should display the body of the document', () => {
          const bodyDom = docBody.props.children;
          expect(bodyDom).toEqual(body);
        });
      });
    });

    describe('when document does not exist', () => {
      mockDocument.body = null;
      Wrapper.setProps({
        document: mockDocument,
        status: 'failed'
      });
      const docNotFound = Wrapper.find('#docNotFound').props();

      it('should display a text "No document found, please select a document"',
      () => {
        expect(docNotFound.children[0])
        .toEqual('No document found, please select a document');
      });
      it('should render a link to return to the document dashboard', () => {
        const docDashboardlink = docNotFound.children[1];
        expect(docDashboardlink.props.href).toEqual('#/dashboard');
      });
    });
  });
});


