  if(__SITECOREDEBUG) {

    var numberOfApps = 0
        , totalNumberOfControls = 0
        , totlaNumberOfApp = 0
        , alltheControls = [];

    var retrieveAppInfo = function(app) {      
      var numberOfNestedApp = 0,
          nestedApps = [],
          nbControlInThisApp = 0;

        for(var param in app) {
          if(app[param] && app[param].modelType === "application") {
            var app = app[param];
            totlaNumberOfApp += 1;
            numberOfNestedApp += 1;

            _.each(app.Controls, function(control){
              totalNumberOfControls += 1;
              nbControlInThisApp += 1;
              alltheControls.push(control);
            });
            nestedApps.push(retrieveAppInfo(app[param]));
          }
        }
        return {
          numberOfNestedApp: numberOfApps,
          nestedApps: nestedApps,
          nbControlInThisApp: nbControlInThisApp
        };
    };

    var getAllInfo = function() {
      var appStats = retrieveAppInfo(Sitecore);
      return {
        numberOfApps: numberOfApps,
        totalNumberOfControls: totalNumberOfControls,
        totlaNumberOfApp: totlaNumberOfApp,
        alltheControls: alltheControls,
        allApplications: appStats
      };
    };

    _sc.__info = function() {
      return  {
        Components: {
          totalComponents: Sitecore.Components.length,
          compontentList: Sitecore.Components
        },
        Pipelines: {
          totalPipelines: Sitecore.Pipelines.length()
        },
        Applications: getAllInfo()
      };
    }
  }
}).call(window);