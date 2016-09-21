var React = require('react');
var ReactDOM = require('react-dom');
var Adal = require('./adal/adal-request');
var Users = require('./Users.jsx');

require('../node_modules/office-ui-fabric/dist/css/fabric.min.css');
require('../node_modules/office-ui-fabric/dist/css/fabric.components.min.css');
require('../assets/css/new-style.css');
require('../assets/css/styles.css');

var App = React.createClass({
  render: function() {
    return (
      <div>
      	<header>
            <div className="logo">
              <img src="assets/images/logo.svg" alt="People Consid">
              <h1>people</h1>
              <h6>find heroes @ consid</h6>
            </div>
          </header>
      </div>
    );
  }
});

Adal.processAdalCallback();

if (window === window.parent) {
  ReactDOM.render(<App />, document.getElementById('app'));
}