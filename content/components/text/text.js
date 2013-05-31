_c.component({
    name: "text",
    events: {
    	"click": "test"
    },
    test: function() {
    	alert("test");
    },
    attributes: [
		{ name: "text" }
    ]
});