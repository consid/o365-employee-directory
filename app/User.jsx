var React = require('react');

var User = React.createClass({
  render: function() {
      
      var mailLink = "mailto:" + this.props.user.email;
      var skills = this.props.user.skills.join(", ");
      
      
    return (
      <div className="ms-Persona ms-Persona--lg">
        <div className="ms-Persona-imageArea">
          <div className="ms-Persona-initials ms-Persona-initials--blue">{this.props.user.displayName.substr(0, 2).toUpperCase()}</div>
          <img className="ms-Persona-image" src={this.props.user.imageUrl} />
        </div>
        <div className="ms-Persona-details">
          <div className="ms-Persona-primaryText" title={this.props.user.displayName}><a href={mailLink} className="ms-Link" target="_blank">{this.props.user.displayName}</a></div>
          <div className="ms-Persona-secondaryText" title={this.props.user.phone}>{this.props.user.phone}</div>
          <div className="ms-Persona-tertiaryText" title={skills}>{skills}</div>
        </div>
      </div>
    );
  }
});

module.exports = User;