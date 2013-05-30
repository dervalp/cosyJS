var page = cosy.app("Page");

page.module('globalHeader');

page.globalHeader.component("header", cosy.component("menu"));
page.globalHeader.component("content", cosy.component("imageList"));


page.module(module);
page.module(module);

page.globalHeader.menu.text;

/*

var Model = {};

var View = {};

var Presenter = {};
*/

/*
Page {
  AREA1 = {
    HEADER = {
      MENU = {
        SOURCE: MODEL|COLLECTION
      }
    }
    CONTENT = {
      IMAGELIST = {
        SOURCE: MODEL|COLLECTION
      }
    }
  },
  AREA2 = {
    MENU = {
      SOURCE: MODEL|COLLECTION
    },
    IMAGELIST = {
      SOURCE: MODEL|COLLECTION
    }
  }
}
*/

function updateInfo {
  //this
};

this.ImageList.watch({
  "selected": updateInfo
});

this.Menu.watch({

});