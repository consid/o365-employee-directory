var React = require('react');
var ReactDOM = require('react-dom');

var SearchBar = React.createClass({
    doSearch:function(event){
        var query=event.target.value;
        this.props.doSearch(query);
    },
  render: function() {
    return (
      <div className="ms-SearchBox">
        <input className="ms-SearchBox-field" ref="searchInput" value={this.props.query} onChange={this.doSearch} type="text" placeholder="Search..." />
        </div>
    );
  }
});

module.exports = SearchBar;