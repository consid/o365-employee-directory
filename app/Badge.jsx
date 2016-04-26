var React = require('react');

function getColor(text){
    switch(text.toLowerCase()) {
        case 'episerver':
            return '#00188F';
        case 'sharepoint':
            return '#D83B01'
        case 'sitecore':
            return '#5C2D91'
        case 'projektledning':
            return '#B4009E'
        case '.net':
            return '#008272'
        case 'java':
            return '#FFB900'
        default:
            return '#666666'
    }
}


var Badge = React.createClass({
  render: function() {
      var divStyle = {
        color: '#fff',
        padding: '.1em .3em .1em',
        marginRight: '.2em',
        fontSize: '75%',
        textAlign: 'center',
        borderRadius: '.25em',
        backgroundColor: getColor(this.props.text)
        };
      
      
    return (
      <span style={divStyle} className="badge">
        {this.props.text}
      </span>
    );
  }
});

module.exports = Badge;