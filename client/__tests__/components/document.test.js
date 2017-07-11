import React from 'react';
import { mount } from 'enzyme';
import { Document } from '../../components/Document';
import mockData from '../../../server/__test__/mockData';

let mockDocument = mockData.document;
mockDocument.createdAt = new Date();
mockDocument.id = 1;
mockDocument.owner = 1;

const setup = () => {
  const props = {
    status: '',
    document: mockDocument,
    getDocument: jest.fn(),
    match: {
      params: {
        documentId: 1
      }
    }
  };
  const Wrapper = mount(
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
    Wrapper.setProps({
      document: mockDocument,
      status: 'success'
    });
    describe('When a document exist', () => {
      const renderedDoc = Wrapper.props().document;
      it('should render the title of the document', () => {
        // const title = Wrapper.find('#title').props();
        // console.log('title', title);
        expect(renderedDoc.title).toEqual(mockDocument.title);
      });

      it('should render the author of of the document', () => {
        // const author = Wrapper.find('#author').props();
        expect(renderedDoc.author).toEqual(mockDocument.author);
      });

      it('should render the body of of the document', () => {
        // const documentBody = Wrapper.find('#documentBody').props();
        // expect(documentBody.value).toEqual(mockDocument.body);
        expect(renderedDoc.body).toEqual(mockDocument.body);
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


