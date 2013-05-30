_.extend(_sc, {
  /**
   * load dependencies you need to the PageCode
   * @params {global} generally the windows object 
   */
  load: function (global) {
    // collect dependencies from html attributes - dependencies can be separated by commas
    var deps = [ ];
    $("[data-sc-require]").each(function () {
      var depEl = $(this);
      if(!depEl.is('[data-sc-app]')) {
          $.each(depEl.attr("data-sc-require").split(","), function (i, e) {
          if(deps.indexOf(e) < 0) {
            deps.push(e);
          }
        });
      }
    });

    // override require.js define() to collect sub-dependencies
    var subdeps = [ ];
    var _define = global.__sc_define;

    global.__sc_define = function (name, deps, callback) {
      if (typeof name == "string") {
        subdeps.push(name);
      }

      _define(name, deps, callback);
    };

    _sc.debug("Requiring files: ", deps);
    
    // load dependencies from html attributes
    require(deps, function() {
      // find the page code
      var $pageCode = $("script[type='text/x-sitecore-pagecode']"),
          page = $("body"),
          pageCodeSrc = $pageCode.attr("src"),
          behaviorsFromPagecode = $pageCode.data("sc-behaviors"),
          pageCode = null;

      page.attr("data-sc-behaviors", behaviorsFromPagecode);

      var runPageCode = function () {
        if (subdeps.length == 0) {
          // no dependencies - instantiate the page code and run it
          global.__sc_define = _define;
          var instance = new pageCode();
          instance.run();
        } else {
          // subdependencies found - run recursively
          var t = subdeps;
          subdeps = [];
          _sc.debug("Requiring files: ", t);
          require(t, runPageCode);
        }
      };

      // define function to be called recursively until no subdependencies are collected
      var run = function () {
        if (subdeps.length === 0) {
          // if there is an app, load and run it
          if (pageCodeSrc) {

            _sc.debug("Requiring page code: ", [pageCodeSrc]);

            require([pageCodeSrc], function (pc) {
              pageCode = pc;
              runPageCode();
            });

          } else {
            // no pagecode - run default
            global.__sc_define = _define;
            Sitecore.Factories.createApp();
          }
        } else {
          // subdependencies found - run recursively
          var t = subdeps;

          subdeps = [ ];
          _sc.debug("Requiring files: ", t);
          require(t, run);
        }
      };

      run();
    });
  }
});
