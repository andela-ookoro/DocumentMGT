/* global localStorage */
import React from 'react';
import PropTypes from 'prop-types';
import { toServertime, timeSince } from '../helper';


const DocumentList = (props) => {
  // get user info from local storage
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const {
    id,
    title,
    author,
    owner,
    accessRight,
    createdAt,
    deleteDocument
  } = props;

  return (
    <tr id={`doc${id}`}>
      <td id={`title${id}`}>{title}</td>
      <td id={`author${id}`}>{author}</td>
      <td id={`createdAt${id}`} className="tooltip">
        {toServertime(createdAt)}
        <span className="tooltiptext">
          {timeSince(createdAt)}
        </span>
      </td>
      <td id={`access${id}`}>
        {accessRight}
      </td>
      {(user.id === owner)
        ?
          <td>
            <a
              className="tooltip"
              id={`view${id}`}
              href={`#/document/${id}/${title.toString()
              .replace(new RegExp(' ', 'g'), '_')}`}
            >
              <i className=" material-icons">description</i>
              <span className="tooltiptext">
                View document
            </span>
            </a>
            <a
              className="tooltip"
              id={`edit${id}`}
              href={`#/createDocument/${id}/${title.toString()
                .replace(new RegExp(' ', 'g'), '_')}/edit`}
            >
              <i className="material-icons">mode_edit</i>
              <span className="tooltiptext">
                Edit document
              </span>
            </a>
            <botton className="tooltip">
              <i
                className="material-icons"
                id={id}
                onDoubleClick={deleteDocument}
              >
                delete_forever
                </i>
              <span className="tooltiptext">
                double click to Delete document
              </span>
            </botton>
          </td>
      :
          <td>
            <a
              className="tooltip"
              id={`view${id}`}
              href={`#/document/${id}/${title
                .toString()
                .replace(new RegExp(' ', 'g'), '_')}`}
            >
              <i className=" material-icons">description</i>
              <span className="tooltiptext">
                View document
              </span>
            </a>
          </td>
    }
    </tr>
  );
};

DocumentList.propTypes = {
  deleteDocument: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  accessRight: PropTypes.string.isRequired,
  owner: PropTypes.number.isRequired,
  createdAt: PropTypes.string.isRequired
};

export default DocumentList;
