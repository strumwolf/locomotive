var vows = require('vows');
var assert = require('assert');
var util = require('util');
var Route = require('locomotive/route');
var helpers = require('locomotive/helpers');
var dynamicHelpers = require('locomotive/helpers/dynamic');


/* MockLocomotive */

function MockLocomotive() {
  var self = this;
  this._routes = {};
  this._routes['TestController#index'] = new Route('get', '/test');
  
  this._routes._find = function(controller, action) {
    var key = controller + '#' + action;
    return self._routes[key];
  }
}

/* MockRequest */

function MockRequest() {
}

/* MockResponse */

function MockResponse(fn) {
}

/* util */

function augment(a, b) {
  for (var method in b) {
    a[method] = b[method];
  }
}


vows.describe('URLDynamicHelpers').addBatch({
  
  'helpers': {
    topic: function() {
      var app = new MockLocomotive();
      var req = new MockRequest();
      req.locomotive = app;
      req.controller = 'TestController';
      req.action = 'show';
      var res = new MockResponse();
      var view = new Object();
      var dynHelpers = {};
      for (var key in dynamicHelpers) {
        dynHelpers[key] = dynamicHelpers[key].call(this, req, res);
      }
      
      augment(view, helpers);
      augment(view, dynHelpers);
      return view;
    },
    
    'urlFor': {
      topic: function(view) {
        return view;
      },
    
      'should build correct url for request controller': function (view) {
        assert.isFunction(view.urlFor);
        assert.equal(view.urlFor({ action: 'index' }), '/test');
      },
      'should build correct url for request controller and protocol and host options': function (view) {
        assert.isFunction(view.urlFor);
        assert.equal(view.urlFor({ action: 'index', protocol: 'https', host: 'www.example.net' }), 'https://www.example.net/test');
      },
      'should build correct url for request controller and protocol, host, and pathname options': function (view) {
        assert.isFunction(view.urlFor);
        assert.equal(view.urlFor({ protocol: 'https', host: 'www.example.net', pathname: 'welcome' }), 'https://www.example.net/welcome');
      },
    },
  },
  
}).export(module);
