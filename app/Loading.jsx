var React = require('react');

var Loading = React.createClass({
  render: function() {
    return (
      <div className="spinner">
        <img src={'assets/images/ajax-loader.svg'} />
      </div>
    );
  }
});

module.exports = Loading;