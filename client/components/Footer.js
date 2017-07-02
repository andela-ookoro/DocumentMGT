import React from 'react';
import $ from 'jquery';

class Footer extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    // create custom google search markup
    const embedcode = `<script>
      (function() {
        var cx = '008956209690011123482:ot0nxazwtpq';
        var gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = true;
        gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gcse, s);
      })();
    </script>
    <gcse:search></gcse:search>`;
   $('#gsearch').html(embedcode);
  }

  render(){
    return (
      <div>
      <div className="extraDiv"></div>
      <div id="footerDiv">
        <footer className="page-footer">
          <div id="gsearch"></div>
          <div className="footer-copyright" >
            <div className="container">
             © 2017 1moreSmile
             <a className="grey-text text-lighten-4 right"
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
