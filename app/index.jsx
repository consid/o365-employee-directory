var React = require('react');
var ReactDOM = require('react-dom');
var Adal = require('./adal/adal-request');
var Users = require('./Users.jsx');

require('../node_modules/office-ui-fabric/dist/css/fabric.min.css');
require('../node_modules/office-ui-fabric/dist/css/fabric.components.min.css');
require('../assets/css/style.css');
require('../node_modules/font-awesome/less/font-awesome.less');

var App = React.createClass({
  render: function() {
    return (
      <div>
      	<header id="top">
          <div className="ms-Grid">
            <div className="logo">
              <img src="assets/images/logo.svg" alt="People Consid" />
              <h1>people</h1>
              <h6>find heroes @ consid</h6>
            </div>
          </div>
        </header>
        <a className="top" href="#top" rel="relativeanchor"><i className="fa fa-chevron-up" aria-hidden="true"></i></a>
        <Users />
      </div>
    );
  }
});

Adal.processAdalCallback();

if (window === window.parent) {
  ReactDOM.render(<App />, document.getElementById('app'));
}