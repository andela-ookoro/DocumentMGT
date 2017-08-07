import React from 'react';
import toaster from 'toastr';
import { shallow } from 'enzyme';
import { Document } from '../../components/Document';
import mockData from '../../../server/tests/mockData';

toaster.info = jest.fn(message => '');
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


describe('Document components', () => {
  const { Wrapper } = setup();
  describe('When a document exist', () => {
    Wrapper.setProps({
      document: mockDocument,
      status: 'success'
    });
    const renderedDoc = Wrapper.props().children.props.children[2].props;
    describe('renders the document header', () => {
      const docHeader = renderedDoc.children[0].props;
      describe('renders the author of the document ', () => {
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
        });
      });

      describe('renders the title of the document ', () => {
        const title = docHeader.children[1];
        it('should render a h6 element', () => {
          expect(title.type).toEqual('h6');
        });
        it('should display the title of the document as "Author <name>"',
        () => {
          const titleDom = title.props.children;
          expect(titleDom).toEqual(mockDocument.title);
        });
      });

      it('should render a hr element after the header', () => {
        const hr = docHeader.children[2];
        expect(hr.type).toEqual('hr');
      });
    });

    it('should render the body in a div element', () => {
      const docBody = renderedDoc.children[1];
      const body = mockDocument.body;
      const bodyDom = docBody.props.children;
      expect(bodyDom).toEqual(body);
      expect(docBody.type).toEqual('div');
    });
  });

  describe('when document does not exist', () => {
    Wrapper.setProps({
      document: {},
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

  it('should display a message from \'getDocument\' actions', () => {
    Wrapper.setProps({
      messageFrom: 'getDocument',
      message: 'unknown request',
    });
    const messageState = Wrapper.state('message');
    const isSubString = messageState.includes('unknown request');
    expect(isSubString).toEqual(true);
  });
});


