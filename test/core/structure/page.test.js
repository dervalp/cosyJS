var should = require("should"),
    _c = require("../../../clientLib/cosy"),
    tmplEngine = require("../../../lib/core/template/helper")(),
    componentBuilder = require("../../../lib/core/structure/componentBuilder"),
    layoutBuilder = require("../../../lib/core/structure/layoutBuilder"),
    gridFactory = require("../../../lib/core/factory/grid"),
    Page = require("../../../lib/core/structure/pageBuilder");

var EMPTYGRID = {
    prefixClass: "",
    extraClass: "",
    classForRow: ""
};

var oneTextComponents = [{
        type: "text",
        category: "p",
        id: "description",
        text: "Lore Ipsum",
        order: 2,
        placeholder: "root"
    }
];

_c.setEngine(tmplEngine);

var basicStructure = {
    name: "root",
    order: 0,
    columns: [{
            name: "header",
            size: "12",
            columns: [{
                    name: "logo",
                    size: "4",
                    parent: "header",
                    order: 0
                }, {
                    name: "menu",
                    size: "8",
                    parent: "header",
                    order: 1
                },
            ],
            parent: "root",
            order: 0
        }, {
            name: "content",
            size: "12",
            columns: [{
                    name: "navigation",
                    size: "4",
                    parent: "content",
                    order: 0
                }, {
                    name: "main",
                    size: "8",
                    parent: "content",
                    order: 1
                }
            ],
            parent: "root",
            order: 1
        }, {
            name: "footer",
            size: "12",
            columns: [{
                    name: "footerContent",
                    size: "12",
                    parent: "footer",
                    order: 0
                }
            ],
            parent: "root",
            order: 2
        }
    ]
};

var EMPTYGRID = {
    prefixClass: "",
    extraClass: "",
    classForRow: ""
};
var basicComponents = [{
        type: "text",
        category: "p",
        id: "description",
        text: "Lore Ipsum",
        order: 1,
        placeholder: "main"
    }
];
var components = ["text", "image"];

describe("Given a pageBuilder", function () {
    var layout;

    describe("with no grid and no component", function () {
        before(function (done) {
            layoutBuilder.build(function (layoutconfiguration) {
                layout = layoutconfiguration["base.master"];
                done();
            });
        });

        it("it should render a basic html structure", function (done) {
            var gridInstance = gridFactory.create();

            var page = new Page({}, gridInstance, layout);

            page.render(function (html) {
                html.should.equal("<!DOCTYPE html><html><head><title></title></head><body><div class='cosy-root 12'></div></body></html>");
                done();
            });
        });
    });
    /*describe('with empty grid and no component', function() {
      it('it should render a basic html structure', function(done) {
          var page = new Page({ grid: EMPTYGRID });

          page.build(function(html) {
              html.should.equal("<!DOCTYPE html><html><head><title></title></head><body><div class='cosy-root 12'></div></body></html>");
              done();
          });
      });
  });
  describe('with empty grid and 1 text component', function() {
     it('it should render a basic html structure with a text inside', function(done) {
          var page = new Page(_c, { grid: EMPTYGRID }, oneTextComponents);

          page.build(function(html) {
              console.log(html)
              html.should.equal("<!DOCTYPE html><html><head><title></title></head><body><div class='cosy-root 12'><p class='cosy-text'>Lore Ipsum</p></div></body></html>");
              done();
          });
      }); 
  });
  describe('with empty grid and 1 text component', function() {
     it('it should render a basic html structure with a text inside', function(done) {
          
          var page = new Page(_c, { grid: EMPTYGRID }, basicComponents, basicStructure);

          page.build(function(html) {
            html.should.equal("<!DOCTYPE html><html><head><title></title></head><body><div id='cosy-root' ><div  class='cosy-12 header'><div  class='cosy-4 logo'></div><div  class='cosy-8 menu'></div></div><div  class='cosy-12 content'><div  class='cosy-4 navigation'></div><div  class='cosy-8 main'><p class='cosy-text'>Lore Ipsum</p></div></div><div  class='cosy-12 footer'><div  class='cosy-12 footerContent'></div></div></div></body></html>")
            done();
          });
          
      });
  });*/
});