import React from 'react';
import $ from 'jquery';


/**
 * @class Footer
 * @extends {React.Component}
 */
class Footer extends React.Component {

  /**
   * @returns  {null} - null
   * @memberof Document
   */
  render() {
    return (
      <div>
        <div className="extraDiv" />
        <div id="footerDiv">
          <footer className="page-footer">
            <div className="footer-copyright" >
              <div className="container">
              © 2017 1moreSmile
              <a
                className="grey-text text-lighten-4 right"
                href="mailto:okwudiri.okoro@andela.com?Subject=User%20Feedback"
                target="_top"
              >
                Feedback mail
              </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}

export default Footer;
