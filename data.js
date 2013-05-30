 var basicStructure = 
 {  
  name:     "root",
  order: 0,
  columns:  [
              {
                name:     "header",
                columns:  [
                            { name: "logo", size:"4", parent: "header", order: 0 },
                            { name: "menu", size:"8", parent: "header", order: 1 },
                          ],
                parent: "root",
                order: 0
              },
              {
                name:     "content",
                columns:  [
                            { name: "main", size:"12", parent: "content", order: 0 }                        
                          ],
                parent: "root",
                order: 1
              },
              {
                name:     "footer",
                columns:  [
                            { name: "footerContent", size:"12", parent: "footer", order: 0 }                            
                          ],
                parent: "root",
                order: 2
              }
  ]
};

var pages = [
  {
    layout: "layout",
    name: "index",
    controller: {
      clientSide : true
    },
    route: "/",
    components: [
      { type: "text", category: "h1", id: "Logo", order:1 , dynamic: true, placeholder: "logo", data: { text: "Cosy Js" } },
      { type: "menu", id: "menu", fixed: true, data: { items: [ { name: "Home", route: "/" } , { name: "About", route: "/about" } ] }, order:1 ,  placeholder: "menu" },
      { type: "text", category: "p", id: "description", order:3, dynamic: true , placeholder: "main", data: { text: "Hygge helps you to manage your scripts and stylesheets, in development as well as in production. Create you package and get your Hygge id." } },
      { type: "collapse", category: "p", id: "description", data: { items: [ { name: "Jquery", content: "Empty"} ] }, order:3 , placeholder: "main" }
      //{ type: "image", source: "https://redappleapartments.files.wordpress.com/2012/05/copenhagen1.jpg", id: "image", order:4, placeholder: "main" },
    ]
  },
  {
    layout: "layout",
    route: "/about",
    components: [
      { category: "text", type: "h1", id: "title", value: "Hello World", order:1 ,  placeholder: "main" }
    ]
  }
];


var EMPTYGRID = { prefixClass: "span", extraClass: "", classForRow: "row" };

module.exports = {
  EMPTYGRID: EMPTYGRID,
  pages: pages,
  basicStructure: basicStructure
};