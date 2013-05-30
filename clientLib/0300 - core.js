_.extend(_sc, {
  /**
   *  destroy the app and unregister all the bindings
   *  @param {app} Sitecore.Definitions.Application you want to destroy
   */
  destroy: function(app) {
    if( !app && !app.destroy ) { throw "you need an app to be destroy"};
    var name = app.name;
    app.destroy();
    delete Sitecore[name];
  },
  /**
   *  destroy the app and unregister all the bindings
   *  @param {deep} removing all Sitecore variables from the global scope
   *  @returns the Sitecore library
   */
  noConflict: function(deep) {
    if ( root._sc === Sitecore ) {
      root._sc = __sc;
    }

    if ( deep && root.Sitecore === Sitecore ) {
      root.Sitecore = _Sitecore;
    }

    return Sitecore;
  }
});
