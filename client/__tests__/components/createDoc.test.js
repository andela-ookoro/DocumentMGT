import React from 'react';
import { shallow } from 'enzyme';
import { CreateDocument } from '../../components/CreateDocument';
import mockData from '../../../server/tests/mockData';

let mockDocument = mockData.document;
mockDocument.createdAt = new Date();
mockDocument.id = 1;
mockDocument.owner = 1;

const setup = () => {
  const props = {
    createDocStatus: '',
    errorMessage: '',
    upsertDocument: jest.fn(),
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

    describe('should render an editor for document body', () => {
      const txtContent = Wrapper.find('#content').props();
      it('textbox should be required', () => {
        expect(txtContent.required).toEqual(true);
      });
      it('should have a placeholder "First Name"', () => {
        expect(txtContent.placeholder).toEqual('Body');
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
  });
});

