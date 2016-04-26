var React = require('react');

var highlightedSkills = ["Episerver", "Sharepoint", "Projektledning", "Sitecore", "C#", "Java"];

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOfIgnoreCase(i) < 0;});
};

Array.prototype.intersection = function(a) {
    return this.filter(function(i) {return a.indexOfIgnoreCase(i) >= 0;});
};

Array.prototype.indexOfIgnoreCase = function (searchElement, fromIndex) {
    return this.map(function (value) {
        return value.toLowerCase();
    }).indexOf(searchElement.toLowerCase(), fromIndex);
};

var User = React.createClass({
  render: function() {
    var mailLink = "mailto:" + this.props.user.email;
    var primarySkills = this.props.user.skills;
    var skills = this.props.user.skills;
    
    if(primarySkills.length > 0) {
        //primarySkills = intersect_safe(highlightedSkills.sort(), this.props.user.skills.sort());
        primarySkills = skills.intersection(highlightedSkills);
    }
    
    skills = skills.diff(primarySkills);
    
    skills = skills.join(", ");
    primarySkills = primarySkills.join(", ");
      
    return (
      <div className="ms-Persona ms-Persona--xl">
        <div className="ms-Persona-imageArea">
          <div className="ms-Persona-initials ms-Persona-initials--blue">{this.props.user.displayName.substr(0, 2).toUpperCase()}</div>
          <img className="ms-Persona-image" src={this.props.user.imageUrl} />
        </div>
        <div className="ms-Persona-details">
          <div className="ms-Persona-primaryText" title={this.props.user.displayName}><a href={mailLink} className="ms-Link">{this.props.user.displayName}</a></div>
          <div className="ms-Persona-secondaryText" title={this.props.user.phone}>{this.props.user.phone}</div>
          <div className="ms-Persona-tertiaryText" title={primarySkills}>{primarySkills}</div>
          <div className="ms-Persona-optionalText" title={skills}>{skills}</div>
        </div>
      </div>
    );
  }
});

module.exports = User;