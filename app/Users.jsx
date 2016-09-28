var React = require('react');
var Adal = require('./adal/adal-request');
var Loading = require('./Loading.jsx');
var User = require('./User.jsx');
var SearchBar = require('./SearchBar.jsx')
var q = require('q');
var Immutable = require('immutable');
var TimeCache = require('./cache/timecache.js')

const FILTER_KEYS = ['displayName', 'city', 'skills', 'department', 'phone']
const GROUP_KEY = "city";
const SORT_KEY = "displayName";

var loadUserPictures = true;
var loadUserDetails = true;

function compare(a,b) {
  if (a[SORT_KEY] < b[SORT_KEY])
    return -1;
  else if (a[SORT_KEY] > b[SORT_KEY])
    return 1;
  else 
    return 0;
}

function groupCompare(a,b){
if (a[0][GROUP_KEY] < b[0][GROUP_KEY]) return -1;
if (a[0][GROUP_KEY] > b[0][GROUP_KEY]) return 1;
return 0;
}

function groupBy( array , f )
{
  var groups = {};
  array.forEach( function( o )
  {
    var group = JSON.stringify( f(o) );
    groups[group] = groups[group] || [];
    groups[group].push( o );  
  });
  
  return Object.keys(groups).map( function(group)
  {
    return groups[group]; 
  })
}

function filterMatchUser(searchTerm, user) {
    const regex = new RegExp(searchTerm, 'i');
    var match = false;
    FILTER_KEYS.forEach(function(propertyName) {
        var value = user[propertyName];
        
        // If array, convert to flat string
        if(Array.isArray(value)) {
            value = value.join();
        }
        
        // Search
        if(value != null && value.search(regex) > -1)
        {
            match = true;
            return;
        }
    });
    return match;     
}

function getUserPicture(userId) {
  var deferred = q.defer();
  
  Adal.adalRequest({
    //url: 'https://graph.microsoft.com/beta/users/' + userId + '/photo/$value',
    url: 'https://graph.microsoft.com/beta/users/' + userId + '/Photos/96X96/$value',
    dataType: 'blob'
  }).then(function(image) {
    var url = window.URL || window.webkitURL;
    deferred.resolve({
      id: userId,
      url: url.createObjectURL(image)
    });
  }, function(err) {
    deferred.reject(err);
  });

  return deferred.promise;
}

function getUserDetails(userId) {
  var deferred = q.defer();
  
  var cachedDetails = TimeCache.get(userId);
  
  if(cachedDetails != null) {
    deferred.resolve({
        id: userId,
        details: cachedDetails
        });    
  }
  else {
    Adal.adalRequest({
    url: 'https://graph.microsoft.com/v1.0/users/' + userId + '?$select=skills,pastProjects',
    headers: {
        'Accept': 'application/json;odata.metadata=full'
      }
    }).then(function(userDetails) {
        // Cache user details
        var longDuration = Math.floor(12096e5 * Math.random()); // Max two weeks
        var shortDuration = Math.floor(60000 * 10 * Math.random()); // Max ten minutes
        var duration = shortDuration;
        if(userDetails.skills.length > 0) {
            // If user has stored skills, cache them longer
            duration = longDuration;
        }
        TimeCache.set(userId, userDetails, duration);
        
        // Return value
        deferred.resolve({
        id: userId,
        details: userDetails
        });
    }, function(err) {
        deferred.reject(err);
    });    
  }
  
  return deferred.promise;
}

var Users = React.createClass({
  getInitialState: function() {
    return {
      loading: true,
      searchTerm: '', 
      users: Immutable.List(),
      filteredUsers: Immutable.List()
    };
  },
  searchUpdated (term) {
    this.setState({searchTerm: term})
  },
  filterData(searchTerm) {
    const filtered = this.state.users.filter(function(user) {
      return filterMatchUser(searchTerm, user);
    });

    this.setState({
      searchTerm: searchTerm,
      filteredUsers: filtered
    });
  },
  componentDidMount: function() {
      var component = this;
      component.serverRequest = Adal.adalRequest({
      //url: 'https://graph.microsoft.com/v1.0/me?' +
      url: 'https://graph.microsoft.com/beta/users?' +
      //'&$expand=skills' +
      '&$select=id,displayName,department,mail,city,country,businessPhones,mobilePhone' +
      //'&$select=skills' +
      '&$top=500' +
      '&$orderBy=displayName' +
      //'&$top=20',
      //'&$filter=City lt \'0\'',
      //'&$filter=Country eq \'Sweden\' or Country eq \'Sverige\'',
      '',
      headers: {
        'Accept': 'application/json;odata.metadata=full'
      }
    }).then(function(data) {
      var myUsers = [];
    
       data.value.forEach(function(userInfo) {
        myUsers.push({
            id: userInfo.id,
            displayName: userInfo.displayName,
            department: userInfo.department,
            email: userInfo.mail,
            phone: userInfo.mobilePhone || userInfo.businessPhones[0],
            city: userInfo.city || "۬ܢ No city",
            imageUrl: null,
            skills: []
          });
         
         if(loadUserPictures)
         {
            getUserPicture(userInfo.id).then(function(pictureInfo) {
                component.setState(function(previousState, curProps) {
                for (var i = 0; i < previousState.users.length; i++) {
                    var u = previousState.users[i];
                    if (u.id === pictureInfo.id) {
                    u.imageUrl = pictureInfo.url;
                    break;
                    }
                }
                });
            }, function(err) {
                console.error(err);
            });
        }
      
        if(loadUserDetails)
        {
            getUserDetails(userInfo.id).then(function(userDetails) {
                component.setState(function(previousState, curProps) {
                for (var i = 0; i < previousState.users.length; i++) {
                    var u = previousState.users[i];
                    if (u.id === userDetails.id) {
                    u.skills = userDetails.details['skills'] || [];
                    break;
                    }
                }
                });
            }, function(err) {
                console.error(err);
            });
        }  
                    
      }, this);
            
      this.setState({
          users: myUsers,
          filteredUsers: myUsers,
          loading: false
      });
      
    }.bind(component));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    // 1. Group users
    var groupedUsers = groupBy(this.state.filteredUsers, function(item)
    {
        return [item[GROUP_KEY]];
    });
    
    // 2. Sort groups
    groupedUsers.sort(groupCompare);
    
    // Build JSX
    var userGroups = groupedUsers.map(function(userGroup) {
        var title = userGroup[0][GROUP_KEY] || "No value for '" + GROUP_KEY + "'";
        
        var users = userGroup.map(function(user) {
        return (
            <div className="ms-Grid-col layout-small-size1of1 layout-medium-size1of2 layout-large-size1of2 layout-size1of3 center" key={user.id}>
                <User user={user} />
            </div>
            );
        });
        
        return (
            <div className="contentbox" key={title}>
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-u-sm12 center">
                        <h2 className="ms-font-xl center">{title}</h2>
                    </div>
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-u-sm12">
                        {users}
                      </div>
                    </div>
                </div>
            </div>
        );      
  
        
    });

    var loading = this.state.loading ? <Loading /> : '';
    
    return (
      <div>
        <SearchBar query={this.state.searchTerm} doSearch={this.filterData} />
        {loading} 
        <div className="ms-Grid"> 
          <div className="ms-Grid-row">
            {userGroups}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Users;