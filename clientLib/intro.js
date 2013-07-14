(function () {
  //use strict to prevent use of Obsolete Functions
  "use strict";
  //keep a reference of the root (could be usefull for frame)
  var root = this
    , _Cosy = root.Sitecore // Map over Sitecore in case of overwrite
    , __COSYDEBUG = root.__COSYDEBUG || false
    , __info = { }
    , __cosy = window._c // Map over the _sc in case of overwrite
    , Cosy
    , _c
    , models = {}
    , views = {}
    , data = {}
    , fctry = {};

  //define the global variable that will be used inside the core
  //support for COMMONJS, it will export the Sitecore global.
  if (typeof exports !== 'undefined') {
    _c = Cosy = exports;
  }  else {
    //if we are not on COMMONJS style,
    //then we use the root (generally the window object) to store sitecore
    _c = Cosy = root.Cosy = root._c = {};
  }

  //keep Local reference for deps
  var $ = root.jQuery;

  //version of Sitecore
  _c.VERSION = "0.0.1";
  //Define the API Entry Point
  _c.__SITECOREDEBUG = __SITECOREDEBUG;
  _c.__info = __info;