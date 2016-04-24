"use strict"

var store = require('store')

module.exports = (function() {
    // timecache.js
    var timecache = {
        set: function(key, val, exp) {
            //console.log("TimeCache: " + key + ", " + val + ", " + exp);
            store.set(key, { val:val, exp:exp, time:new Date().getTime() })
        },
        get: function(key) {
            var info = store.get(key)
            if (!info) { return null }
            if (new Date().getTime() - info.time > info.exp) { return null }
            return info.val
        }
    }
    
    return timecache;
}())