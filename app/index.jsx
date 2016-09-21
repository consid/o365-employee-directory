var React = require('react');
var ReactDOM = require('react-dom');
var Adal = require('./adal/adal-request');
var Users = require('./Users.jsx');

require('../node_modules/office-ui-fabric/dist/css/fabric.min.css');
require('../node_modules/office-ui-fabric/dist/css/fabric.components.min.css');
require('../assets/css/new-style.css');
require('../assets/css/styles.css');
require('../node_modules/font-awesome/less/font-awesome.less');

var App = React.createClass({
  render: function() {
    return (
        <Users />
    );
  }
});

Adal.processAdalCallback();

if (window === window.parent) {
  ReactDOM.render(<App />, document.getElementById('app'));
}